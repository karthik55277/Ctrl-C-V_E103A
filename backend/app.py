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
