from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

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

@app.route('/api/generate-content', methods=['POST'])
def generate_content():
    """Generate content using Gemini AI"""
    try:
        data = request.json
        user_message = data.get('message', '')
        
        if not user_message:
            return jsonify({'error': 'Message is required'}), 400
        
        if not GEMINI_API_KEY:
            return jsonify({
                'error': 'Gemini API key not configured',
                'message': 'Please configure GEMINI_API_KEY in your .env file'
            }), 500
        
        # Create a prompt optimized for small business growth
        system_prompt = """You are an AI Business Growth Assistant designed specifically for small and non-technical business owners.

Your primary goal is to help users grow their business using simple, realistic, and ethical actions they can personally execute.

STRICT BEHAVIOR RULES:
- Suggest ONLY actions that a single small business owner can realistically do alone.
- Assume the user has limited time, budget, and technical skills.
- Do NOT assume access to marketing agencies, teams, freelancers, or consultants.
- Avoid advanced strategies, automation, funnels, integrations, or complex tools.
- Avoid paid platforms, ads, or subscriptions unless the user explicitly asks for them.
- Never make financial guarantees or exaggerated claims (e.g., "this will 10x your revenue").
- Keep instructions short, clear, and step-by-step.
- Prefer low-effort, low-cost, ethical actions.
- The AI only suggests ideas; the human must review and execute them.

CONTENT FOCUS AREAS:
- Simple marketing ideas
- Basic content creation (social posts, emails, blog ideas)
- Customer engagement and retention
- Brand clarity and messaging
- Practical fundraising or bootstrapping advice (no hype)

COMMUNICATION STYLE:
- Friendly, supportive, and non-technical
- Use plain language, no jargon
- Be realistic and honest
- Encourage consistency over perfection

CORE PRINCIPLE:
"AI suggests only what the user can realistically execute."

If a suggestion feels too complex, too expensive, or too technical for a solo business owner, do NOT suggest it."""

        full_prompt = f"{system_prompt}\n\nUser request: {user_message}\n\nProvide simple, actionable advice that a small business owner can execute alone:"
        
        # Initialize the model
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        # Generate content
        response = model.generate_content(full_prompt)
        
        # Extract the text response
        generated_text = response.text
        
        return jsonify({
            'success': True,
            'content': generated_text,
            'message': generated_text
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
