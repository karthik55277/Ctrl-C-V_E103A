import React, { useState, useRef, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import '../../content.css'

const Content = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: "👋 Hi! I'm your AI Business Growth Assistant. I help small business owners like you grow with simple, realistic actions you can do yourself. What would you like help with today?"
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const chatWindowRef = useRef(null)
  const inputRef = useRef(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight
    }
  }, [messages])

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleSend = async () => {
    const message = inputValue.trim()
    
    if (!message || isLoading) return

    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: message
    }
    
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)
    setError(null)

    try {
      // Call backend API
      const response = await fetch('http://localhost:5000/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to generate content')
      }

      // Add AI response to chat
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: data.content || data.message
      }
      
      setMessages(prev => [...prev, aiMessage])
    } catch (err) {
      console.error('Error:', err)
      setError(err.message || 'Failed to generate content. Please try again.')
      
      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: `❌ Sorry, I encountered an error: ${err.message || 'Unable to generate content at this time. Please check your API configuration and try again.'}`
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      // Refocus input after sending
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatMessage = (text) => {
    // Split by newlines and create paragraphs
    const lines = text.split('\n')
    return lines.map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < lines.length - 1 && <br />}
      </React.Fragment>
    ))
  }

  return (
    <>
      <Navbar />
      <div className="content-container">
        <Sidebar showTitle={true} />
        <main className="content-main">
          <section className="content-header">
            <h1>AI Business Growth Assistant</h1>
            <p>
              Get simple, realistic advice to grow your business - no complex strategies or expensive tools required.
            </p>
          </section>

          <section className="chat-wrapper">
            <div className="chat-window" ref={chatWindowRef}>
              {messages.map((message) => (
                <div key={message.id} className={`message ${message.type}`}>
                  <p>{formatMessage(message.text)}</p>
                </div>
              ))}
              
              {isLoading && (
                <div className="message ai">
                  <p>
                    <span className="typing-indicator">🤔 Thinking...</span>
                  </p>
                </div>
              )}
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="chat-input">
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask for simple marketing ideas, content suggestions, customer tips..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !inputValue.trim()}
                className={isLoading ? 'loading' : ''}
              >
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}

export default Content
