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
        
        # Create a prompt optimized for content generation
        system_prompt = """You are an AI Content Assistant specialized in helping small businesses create engaging social media content. 
        
Your role is to:
- Generate creative captions for Instagram, Facebook, Twitter, LinkedIn
- Create content ideas and suggestions
- Suggest relevant hashtags
- Write engaging stories and posts
- Provide marketing copy that's friendly, professional, and conversion-focused

Keep responses concise, engaging, and tailored to small businesses. Always include relevant hashtags when appropriate."""

        full_prompt = f"{system_prompt}\n\nUser request: {user_message}\n\nProvide a helpful response:"
        
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
