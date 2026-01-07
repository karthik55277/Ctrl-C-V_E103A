# Backend API for AI Content Assistant

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Gemini API Key

Create a `.env` file in the `backend` directory:

```bash
# Copy the example file
cp .env.example .env
```

Then edit `.env` and add your Gemini API key:

```
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=5000
```

### 3. Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key
5. Paste it into your `.env` file

### 4. Run the Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### Health Check
```
GET /api/health
```

Returns:
```json
{
  "status": "ok",
  "gemini_configured": true
}
```

### Generate Content
```
POST /api/generate-content
Content-Type: application/json

{
  "message": "I want an Instagram caption for my bakery's new chocolate cake"
}
```

Returns:
```json
{
  "success": true,
  "content": "Generated content here...",
  "message": "Generated content here..."
}
```

## Error Handling

If the API key is not configured, you'll receive:
```json
{
  "error": "Gemini API key not configured",
  "message": "Please configure GEMINI_API_KEY in your .env file"
}
```

## Notes

- The API uses CORS to allow requests from the frontend
- Make sure to keep your `.env` file secure and never commit it to version control
- The `.gitignore` file is already configured to exclude `.env`
