from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import google.generativeai as genai
import sqlite3
from datetime import datetime
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from werkzeug.security import generate_password_hash, check_password_hash

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)
app.secret_key = os.getenv('SECRET_KEY', 'dev-secret-key')

# Token serializer (stateless token with expiry handled on load)
serializer = URLSafeTimedSerializer(app.secret_key, salt='auth-token')

# Simple SQLite DB setup for users (file: backend/auth.db)
DB_PATH = os.path.join(os.path.dirname(__file__), 'auth.db')

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

# initialize DB on startup
init_db()

# Configure Gemini API
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
else:
    print("Warning: GEMINI_API_KEY not found in environment variables")

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'gemini_configured': GEMINI_API_KEY is not None
    })


@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json or {}
    name = data.get('name', '').strip()
    email = (data.get('email') or '').strip().lower()
    password = data.get('password', '')

    if not name or not email or not password:
        return jsonify({'error': 'name, email and password are required'}), 400

    conn = get_db_connection()
    cur = conn.cursor()
    # check existing
    cur.execute('SELECT id FROM users WHERE email = ?', (email,))
    if cur.fetchone():
        conn.close()
        return jsonify({'error': 'Email already registered'}), 400

    pw_hash = generate_password_hash(password)
    created_at = datetime.utcnow().isoformat()
    cur.execute('INSERT INTO users (name, email, password_hash, created_at) VALUES (?,?,?,?)',
                (name, email, pw_hash, created_at))
    conn.commit()
    conn.close()

    token = serializer.dumps({'email': email})
    return jsonify({'success': True, 'token': token, 'user': {'name': name, 'email': email}}), 201


@app.route('/api/login', methods=['POST'])
def login():
    data = request.json or {}
    email = (data.get('email') or '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({'error': 'email and password required'}), 400

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT id, name, email, password_hash FROM users WHERE email = ?', (email,))
    row = cur.fetchone()
    conn.close()

    if not row:
        return jsonify({'error': 'Invalid credentials'}), 401

    if not check_password_hash(row['password_hash'], password):
        return jsonify({'error': 'Invalid credentials'}), 401

    token = serializer.dumps({'email': row['email']})
    return jsonify({'success': True, 'token': token, 'user': {'name': row['name'], 'email': row['email']}})


@app.route('/api/me', methods=['GET'])
def me():
    auth = request.headers.get('Authorization', '')
    if auth.startswith('Bearer '):
        token = auth.split(' ', 1)[1]
    else:
        token = request.args.get('token')

    if not token:
        return jsonify({'error': 'Missing token'}), 401

    try:
        payload = serializer.loads(token, max_age=24*3600)  # 24 hours
    except SignatureExpired:
        return jsonify({'error': 'Token expired'}), 401
    except BadSignature:
        return jsonify({'error': 'Invalid token'}), 401

    email = payload.get('email')
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT id, name, email, created_at FROM users WHERE email = ?', (email,))
    row = cur.fetchone()
    conn.close()

    if not row:
        return jsonify({'error': 'User not found'}), 404

    return jsonify({'user': {'id': row['id'], 'name': row['name'], 'email': row['email'], 'created_at': row['created_at']}})

@app.route('/api/generate-content', methods=['POST'])
def generate_content():
    """Generate content using Gemini AI with strict workflow support"""
    try:
        data = request.json
        user_message = data.get('message', '')
        business_context = data.get('businessContext', {})
        task_mode = data.get('taskMode', {})
        history = data.get('history', [])
        
        if not user_message:
            return jsonify({'error': 'Message is required'}), 400
        
        if not GEMINI_API_KEY:
            return jsonify({
                'error': 'Gemini API key not configured',
                'message': 'Please configure GEMINI_API_KEY in your .env file'
            }), 500
        
        # Extract business context defaults
        business_type = business_context.get('businessType', 'Small Business')
        budget = business_context.get('budget', '₹0 – ₹2,000')
        goal = business_context.get('goal', 'Increase Sales')
        
        intent_mode = task_mode.get('mode', 'GENERAL')
        
        if intent_mode == 'CONTENT':
            system_prompt = f"""You are an AI Business Growth Content Assistant.
Help create social media post content and AI image prompts ONLY via strict human-approval.

BUSINESS: {business_type}, Goal: {goal}, Budget: {budget}

RULES:
1. NO automatic images.
2. Generate post text FIRST.
3. WAIT for approval before image prompts.
4. Suggestions must be simple/realistic for small business.

STEP 1: POST CONTENT
Format:
POST IDEA: [Details]
CAPTION: [Hook/Body/CTA]
HASHTAGS: [5-8]
IMAGE DESCRIPTION (TEXT): [Human description]

Ask: "Do you approve this post? (Yes / Edit / Reject)"

STEP 2: IMAGE PROMPT (ONLY AFTER "YES/APPROVE")
Output ONLY:
IMAGE PROMPT: [Photorealistic, 4:5, minimalist]
NEGATIVE PROMPT: [Blurry, text, logos]
"""
        else:
            system_prompt = f"""You are an AI Business Growth Assistant.
Goal: {goal}, Budget: {budget}, Business: {business_type}
Suggest 3-5 simple, free/low-cost actions in bullet points.
Friendly, non-technical language.
"""

        # Since version is 0.3.2, we don't have system_instruction.
        # We prepend it to the first message or the current one.
        model = genai.GenerativeModel('gemini-2.5-flash') # Use gemini-pro for stability on old versions
        
        # Build the prompt with history
        full_query = f"{system_prompt}\n\n"
        for msg in history:
            prefix = "User: " if msg['type'] == 'user' else "AI: "
            full_query += f"{prefix}{msg['text']}\n"
        
        full_query += f"User: {user_message}\nAI:"
        
        response = model.generate_content(full_query)
        generated_text = response.text
        
        return jsonify({
            'success': True,
            'content': generated_text,
            'message': generated_text,
            'context_used': {
                'business_type': business_type,
                'intent_mode': intent_mode
            }
        })
        
    except Exception as e:
        print(f"Error generating content: {str(e)}")
        return jsonify({
            'error': 'Failed to generate content',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(debug=True, port=port, host='0.0.0.0')
