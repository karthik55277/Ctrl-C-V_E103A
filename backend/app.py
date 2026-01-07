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
        business_context = data.get('businessContext', {})
        task_mode = data.get('taskMode', {})
        
        if not user_message:
            return jsonify({'error': 'Message is required'}), 400
        
        if not GEMINI_API_KEY:
            return jsonify({
                'error': 'Gemini API key not configured',
                'message': 'Please configure GEMINI_API_KEY in your .env file'
            }), 500
        
        # Extract business context with defaults
        business_type = business_context.get('businessType', 'Small Business')
        budget = business_context.get('budget', '₹0 – ₹2,000')
        time_per_day = business_context.get('time', 'Less than 30 minutes')
        team_size = business_context.get('team', 'Solo')
        goal = business_context.get('goal', 'Increase Sales')
        
        # Extract task mode with defaults
        intent_mode = task_mode.get('mode', 'GENERAL')
        intent_objective = task_mode.get('objective', 'Provide helpful business advice')
        intent_guidelines = task_mode.get('guidelines', 'Be supportive and realistic')
        
        # Define constraint rules based on context
        constraint_rules = f"""
- Budget Limit: {budget} per month - suggest only free or very low-cost actions
- Time Limit: {time_per_day} daily - suggest quick, efficient tasks
- Team Size: {team_size} - suggest only what this team size can handle
- Skill Level: Beginner - avoid technical solutions
- No paid ads unless budget allows and user specifically asks
- No complex tools or software subscriptions
- No hiring external help (agencies, freelancers, consultants)
"""
        
        # Create a prompt optimized for small business growth
        system_prompt = f"""You are an AI Business Growth Assistant designed specifically for small and non-technical business owners.

TASK MODE: {intent_mode}

TASK OBJECTIVE:
{intent_objective}

TASK GUIDELINES:
{intent_guidelines}

BUSINESS CONTEXT:
- Business Type: {business_type}
- Primary Goal: {goal}
- Monthly Budget: {budget}
- Daily Time Availability: {time_per_day}
- Team Size: {team_size}
- Skill Level: Beginner

STRICT CONSTRAINT ENFORCEMENT:
The suggestions you generate MUST respect the following rules exactly.
Do not suggest actions that violate these rules.
{constraint_rules}

If any user request conflicts with these constraints:
- Politely refuse that part
- Suggest a simpler alternative
- Explain briefly why

RESPONSE RULES:
- Use bullet points only.
- Maximum 6 bullet points.
- One clear action per bullet.
- Avoid guarantees, promises, or timelines.
- Always assume manual review before execution.
- If uncertain, say: "This step requires manual review."

STRICT BEHAVIOR RULES:
- Suggest ONLY actions that this specific business owner can realistically do alone
- Assume limited time, budget, and technical skills
- Do NOT assume access to marketing agencies, teams, freelancers, or consultants
- Avoid advanced strategies, automation, funnels, integrations, or complex tools
- Never make financial guarantees or exaggerated claims
- Keep instructions short, clear, and step-by-step
- Prefer low-effort, low-cost, ethical actions
- The AI only suggests ideas; the human must review and execute them

COMMUNICATION STYLE:
- Friendly, supportive, and non-technical
- Use plain language, no jargon
- Be realistic and honest about what's achievable
- Encourage consistency over perfection

CORE PRINCIPLE:
"AI suggests only what this specific user can realistically execute given their constraints."""

        full_prompt = f"{system_prompt}\n\nUSER REQUEST:\n{user_message}\n\nProvide actionable advice in bullet point format that respects all constraints above:"
        
        # Initialize the model
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        # Generate content
        response = model.generate_content(full_prompt)
        
        # Extract the text response
        generated_text = response.text
        
        return jsonify({
            'success': True,
            'content': generated_text,
            'message': generated_text,
            'context_used': {
                'business_type': business_type,
                'budget': budget,
                'time_per_day': time_per_day,
                'team_size': team_size,
                'goal': goal
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
