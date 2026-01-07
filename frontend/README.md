# AI Growth Assistant - Frontend

## Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or the next available port)

### 3. Make Sure Backend is Running

The frontend expects the backend API to be running on `http://localhost:5000`

If your backend is on a different port, update the API URL in `Content.jsx`:

```javascript
const response = await fetch('http://localhost:5000/api/generate-content', {
  // ...
})
```

## Content Assistant Page

The Content Assistant page (`/content`) is now fully functional with:

- ✅ Real-time chat interface
- ✅ Gemini AI integration
- ✅ Loading states
- ✅ Error handling
- ✅ Auto-scrolling chat
- ✅ Keyboard shortcuts (Enter to send)
- ✅ Message history

## Features

- **Chat Interface**: Interactive chat with AI assistant
- **Content Generation**: Generate captions, ideas, hashtags, and stories
- **Responsive Design**: Works on desktop and mobile
- **Dark Theme**: Modern dark UI matching the design

## Troubleshooting

### API Connection Issues

If you see errors about API connection:
1. Make sure the backend server is running
2. Check that the backend is on the correct port (default: 5000)
3. Verify CORS is enabled in the backend
4. Check browser console for detailed error messages

### Gemini API Errors

If you see "Gemini API key not configured":
1. Make sure you've created a `.env` file in the `backend` directory
2. Verify your API key is correct
3. Restart the backend server after adding the API key
