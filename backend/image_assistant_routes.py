from flask import Blueprint, request, jsonify
from image_assistant_service import image_assistant_service

image_assistant_bp = Blueprint('image_assistant', __name__)

@image_assistant_bp.route('/api/image-assistant/generate-text', methods=['POST'])
def generate_text():
    """Route for STEP 1: Post Idea Generation"""
    try:
        data = request.json
        business_details = data.get('businessDetails')
        
        if not business_details:
            return jsonify({"error": "Business details are required"}), 400
            
        content = image_assistant_service.generate_text_content(business_details)
        return jsonify({
            "success": True,
            "content": content
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@image_assistant_bp.route('/api/image-assistant/generate-prompts', methods=['POST'])
def generate_prompts():
    """Route for STEP 2: Image Prompt Generation (Requires approval flag)"""
    try:
        data = request.json
        post_content = data.get('postContent')
        approved = data.get('approved', False)
        
        if not approved:
            return jsonify({"error": "Action locked. User approval required."}), 403
            
        if not post_content:
            return jsonify({"error": "Post content is required"}), 400
            
        prompts = image_assistant_service.generate_image_prompts(post_content)
        return jsonify({
            "success": True,
            "prompts": prompts
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@image_assistant_bp.route('/api/image-assistant/generate-image', methods=['POST'])
def generate_image():
    """Route for STEP 3: Actual Image Generation"""
    try:
        data = request.json
        image_prompt = data.get('imagePrompt')
        approved = data.get('approved', False)
        
        # Security check: must be approved to generate image
        if not approved:
            return jsonify({"error": "Action locked. Technical approval is REQUIRED before generating images."}), 403
            
        if not image_prompt:
            return jsonify({"error": "Image prompt is required"}), 400
            
        # Call service to generate image synchronously
        image_base64 = image_assistant_service.generate_image(image_prompt)
        
        return jsonify({
            "success": True,
            "image": image_base64
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
