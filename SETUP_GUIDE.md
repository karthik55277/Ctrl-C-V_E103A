# Setup Guide - AI Content Assistant

## Quick Start

### Step 1: Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Create `.env` file:**
   Create a file named `.env` in the `backend` directory with the following content:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=5000
   ```

4. **Get your Gemini API Key:**
   - Visit: https://makersuite.google.com/app/apikey
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the key and paste it in your `.env` file (replace `your_gemini_api_key_here`)

5. **Start the backend server:**
   ```bash
   python app.py
   ```
   
   You should see: `Running on http://0.0.0.0:5000`

### Step 2: Frontend Setup

1. **Open a new terminal and navigate to frontend:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to the URL shown (usually `http://localhost:5173`)

5. **Go to Content Assistant:**
   Click on "Content Assistant" in the sidebar or navigate to `/content`

## Testing the Integration

1. Once both servers are running, go to the Content Assistant page
2. You should see the welcome message from the AI
3. Type a message like: "I want an Instagram caption for my bakery's new chocolate cake"
4. Click "Send" or press Enter
5. Wait for the AI response (should appear in a few seconds)

## Troubleshooting

### Backend Issues

**Problem:** `ModuleNotFoundError: No module named 'flask'`
- **Solution:** Make sure you've installed requirements: `pip install -r requirements.txt`

**Problem:** `GEMINI_API_KEY not found`
- **Solution:** 
  1. Make sure you created a `.env` file in the `backend` directory
  2. Check that the file contains: `GEMINI_API_KEY=your_actual_key`
  3. Restart the backend server

**Problem:** `Port 5000 already in use`
- **Solution:** Change the PORT in `.env` to a different number (e.g., `PORT=5001`)

### Frontend Issues

**Problem:** `Cannot connect to API` or CORS errors
- **Solution:** 
  1. Make sure the backend is running on port 5000
  2. Check the browser console for detailed error messages
  3. Verify the API URL in `Content.jsx` matches your backend port

**Problem:** `Failed to generate content`
- **Solution:**
  1. Check that your Gemini API key is valid
  2. Verify the key is correctly set in the `.env` file
  3. Check backend console for error messages

## File Structure

```
Hacktide/
├── backend/
│   ├── app.py              # Flask API server
│   ├── requirements.txt    # Python dependencies
│   ├── .env               # Your API key (create this)
│   └── README.md          # Backend documentation
├── frontend/
│   ├── src/
│   │   └── pages/
│   │       └── Content.jsx # Content Assistant page
│   ├── content.css        # Styling for Content page
│   └── README.md          # Frontend documentation
└── SETUP_GUIDE.md         # This file
```

## Next Steps

Once everything is working:
- Try different types of content requests (captions, hashtags, ideas)
- The AI will adapt to your requests
- All messages are stored in the chat history during the session

## Security Note

⚠️ **Important:** Never commit your `.env` file to version control. It contains your API key!

The `.gitignore` file is already configured to exclude `.env` files.
