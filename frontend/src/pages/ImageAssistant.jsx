import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import '../styles/image-assistant.css';

const ImageAssistant = () => {
    const [businessDetails, setBusinessDetails] = useState('');
    const [isGeneratingContent, setIsGeneratingContent] = useState(false);
    const [generatedContent, setGeneratedContent] = useState(null);

    const [isApproved, setIsApproved] = useState(false);
    const [isGeneratingPrompts, setIsGeneratingPrompts] = useState(false);
    const [generatedPrompts, setGeneratedPrompts] = useState(null);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [generatedImage, setGeneratedImage] = useState(null);
    const [error, setError] = useState(null);

    // STEP 1: Generate Post Content
    const handleGenerateContent = async () => {
        if (!businessDetails.trim()) return;

        setIsGeneratingContent(true);
        setError(null);
        setGeneratedContent(null);
        setIsApproved(false);
        setGeneratedPrompts(null);

        try {
            const response = await fetch('http://localhost:5000/api/image-assistant/generate-text', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ businessDetails })
            });

            const data = await response.json();
            if (data.success) {
                setGeneratedContent(data.content);
            } else {
                setError(data.error || 'Failed to generate content');
            }
        } catch (err) {
            setError('Connection error: Make sure the backend is running.');
        } finally {
            setIsGeneratingContent(false);
        }
    };

    // STEP 2: Generate Image Prompts (Requires Approval)
    const handleApprove = async () => {
        setIsApproved(true);
        setIsGeneratingPrompts(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:5000/api/image-assistant/generate-prompts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    postContent: generatedContent,
                    approved: true
                })
            });

            const data = await response.json();
            if (data.success) {
                setGeneratedPrompts(data.prompts);
            } else {
                setError(data.error || 'Failed to generate prompts');
                setIsApproved(false);
            }
        } catch (err) {
            setError('Connection error: Failed to generate prompts.');
            setIsApproved(false);
        } finally {
            setIsGeneratingPrompts(false);
        }
    };

    // STEP 3: Generate Actual Image
    const handleGenerateImage = async () => {
        if (!isApproved || !generatedPrompts) return;

        setIsGeneratingImage(true);
        setError(null);

        try {
            // Extract the image prompt part
            const imagePrompt = generatedPrompts.split('NEGATIVE PROMPT:')[0].replace('IMAGE PROMPT:', '').trim();

            const response = await fetch('http://localhost:5000/api/image-assistant/generate-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    imagePrompt,
                    approved: true
                })
            });

            const data = await response.json();
            if (data.success) {
                setGeneratedImage(data.image);
            } else {
                setError(data.error || 'Failed to generate image');
            }
        } catch (err) {
            setError('Connection error: Failed to generate image.');
        } finally {
            setIsGeneratingImage(false);
        }
    };

    const handleEdit = () => {
        // Simply scroll back to input or allow re-editing business details
        const inputElement = document.querySelector('.business-input');
        if (inputElement) {
            inputElement.focus();
        }
    };

    const handleReject = () => {
        setGeneratedContent(null);
        setIsApproved(false);
        setGeneratedPrompts(null);
        setGeneratedImage(null);
    };

    return (
        <div className="dashboard-layout">
            <Navbar />
            <div className="container" style={{ display: 'flex' }}>
                <Sidebar title="AI Image Assistant" />
                <main className="image-assistant-page">
                    <header className="assistant-header">
                        <h1>AI Image Content Assistant</h1>
                        <p>Generate high-converting social media content and photorealistic AI image prompts in one workflow.</p>
                    </header>

                    <div className="step-container">
                        {/* STEP 1: INPUT SECTION */}
                        <section className="module-card input-section">
                            <h2>1. Define Your Goal</h2>
                            <textarea
                                className="business-input"
                                placeholder="Example: I'm launching a new line of sourdough bread. I want to highlight the crispy crust and soft inside. Target: Bread lovers."
                                value={businessDetails}
                                onChange={(e) => setBusinessDetails(e.target.value)}
                                disabled={isGeneratingContent}
                            />
                            <button
                                className="action-btn"
                                onClick={handleGenerateContent}
                                disabled={isGeneratingContent || !businessDetails.trim()}
                            >
                                {isGeneratingContent ? 'AI is thinking...' : 'Generate Post Content'}
                            </button>
                        </section>

                        {/* ERROR DISPLAY */}
                        {error && (
                            <div className="error-card" style={{ color: '#ef4444', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '1rem', border: '1px solid #ef4444' }}>
                                {error}
                            </div>
                        )}

                        {/* PREVIEW SECTION */}
                        {generatedContent && (
                            <section className="module-card fade-in">
                                <h2>2. Review Content</h2>
                                <div className="content-preview">
                                    {generatedContent}
                                </div>
                                {!isApproved && (
                                    <div className="approval-actions">
                                        <button className="action-btn btn-approve" onClick={handleApprove}>Approve & Generate Prompts</button>
                                        <button className="action-btn btn-edit" onClick={handleEdit}>Refine Details</button>
                                        <button className="action-btn btn-reject" onClick={handleReject}>Reject</button>
                                    </div>
                                )}
                                {isApproved && (
                                    <div style={{ color: '#22c55e', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span>✓ Content Approved</span>
                                    </div>
                                )}
                            </section>
                        )}

                        {/* STEP 2: PROMPT SECTION (LOCKED/UNLOCKED) */}
                        <section className={`module-card prompt-section ${isApproved ? 'unlocked' : 'locked-section'}`}>
                            {!isApproved && (
                                <div className="lock-overlay">
                                    <span>🔒 Approve content to unlock prompts</span>
                                </div>
                            )}
                            <h2>3. AI Image Prompts</h2>
                            <p style={{ opacity: 0.7, marginBottom: '1.5rem' }}>Use these prompts with Midjourney, DALL-E 3, or Stable Diffusion for the best results.</p>

                            {isGeneratingPrompts ? (
                                <div className="loading-prompts">Generating photorealistic prompts...</div>
                            ) : generatedPrompts ? (
                                <>
                                    <div className="prompt-output">
                                        <div className="prompt-box">
                                            <h4>Primary Image Prompt</h4>
                                            <div className="prompt-text">{generatedPrompts.split('NEGATIVE PROMPT:')[0].replace('IMAGE PROMPT:', '').trim()}</div>
                                        </div>
                                        <div className="prompt-box" style={{ borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                                            <h4>Negative Prompt</h4>
                                            <div className="prompt-text" style={{ color: '#9ca3af' }}>{generatedPrompts.split('NEGATIVE PROMPT:')[1]?.trim() || 'N/A'}</div>
                                        </div>
                                    </div>

                                    {/* NEW STEP 3: GENERATE IMAGE BUTTON */}
                                    <div className="image-generation-action" style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
                                        <button
                                            className="action-btn"
                                            style={{ width: '100%', background: '#38bdf8', color: '#020617' }}
                                            onClick={handleGenerateImage}
                                            disabled={isGeneratingImage}
                                        >
                                            {isGeneratingImage ? 'Generating High-Quality Image...' : '🎨 Generate Final Image'}
                                        </button>

                                        {generatedImage && (
                                            <div className="image-preview-container fade-in" style={{ marginTop: '2rem' }}>
                                                <h3>4. Final Generated Content</h3>
                                                <div className="image-card" style={{ background: '#020617', padding: '10px', borderRadius: '1rem', border: '1px solid #38bdf8' }}>
                                                    <img
                                                        src={`data:image/png;base64,${generatedImage}`}
                                                        alt="AI Generated Content"
                                                        style={{ width: '100%', borderRadius: '0.75rem', display: 'block' }}
                                                    />
                                                    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                                                        <a
                                                            href={`data:image/png;base64,${generatedImage}`}
                                                            download="ai-content.png"
                                                            className="action-btn"
                                                            style={{ textDecoration: 'none', display: 'inline-block', fontSize: '0.875rem' }}
                                                        >
                                                            ⬇ Download Image
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div style={{ opacity: 0.5 }}>Waiting for content approval...</div>
                            )}
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ImageAssistant;
