import React, { useState, useRef } from 'react'
import html2canvas from 'html2canvas'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import '../../fundraising.css'

const Fundraising = () => {
  const [showForm, setShowForm] = useState(false)
  const [pitches, setPitches] = useState([])
  const [previewPitch, setPreviewPitch] = useState(null)

  const previewRef = useRef()

  const [form, setForm] = useState({
    title: '',
    description: '',
    budget: '',
    needs: []
  })

  const toggleNeed = (need) => {
    setForm(prev => ({
      ...prev,
      needs: prev.needs.includes(need)
        ? prev.needs.filter(n => n !== need)
        : [...prev.needs, need]
    }))
  }

  const addPitch = () => {
    if (!form.title || !form.description || !form.budget) return
    setPitches([...pitches, form])
    setForm({ title: '', description: '', budget: '', needs: [] })
    setShowForm(false)
  }

  const deletePitch = (index) => {
    setPitches(pitches.filter((_, i) => i !== index))
  }

  const exportAsImage = async () => {
    if (!previewRef.current) return

    const canvas = await html2canvas(previewRef.current, {
      backgroundColor: '#020617',
      scale: 2
    })

    const link = document.createElement('a')
    link.download = 'fundraising-pitch.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <>
      <Navbar />
      <div className="fundraising-container">
        <Sidebar showTitle={false} />

        <main className="fundraising-main">
          <div className="fundraising-header">
            <h1>Fundraising & Collaboration</h1>
            <button className="btn primary" onClick={() => setShowForm(true)}>
              + Add Pitch
            </button>
          </div>

          {/* ADD PITCH FORM */}
          {showForm && (
            <div className="pitch-form">
              <h3>Create New Pitch</h3>

              <input
                placeholder="Pitch Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />

              <textarea
                placeholder="Describe your idea"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />

              <input
                placeholder="Budget Required (eg: ₹50,000)"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
              />

              <div className="needs">
                {['Investor', 'Delivery Partner', 'Supplier', 'Marketing Help'].map(n => (
                  <span
                    key={n}
                    className={`tag ${form.needs.includes(n) ? 'active' : ''}`}
                    onClick={() => toggleNeed(n)}
                  >
                    {n}
                  </span>
                ))}
              </div>

              <div className="form-actions">
                <button className="btn primary" onClick={addPitch}>Add</button>
                <button className="btn ghost" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </div>
          )}

          {/* PITCH LIST */}
          <div className="pitch-list">
            {pitches.map((p, i) => (
              <div key={i} className="pitch-card">
                <h3>{p.title}</h3>
                <p>{p.description}</p>

                <strong>Budget:</strong> {p.budget}

                <div className="needs">
                  {p.needs.map(n => <span key={n} className="tag">{n}</span>)}
                </div>

                <div className="card-actions">
                  <button className="btn primary" onClick={() => setPreviewPitch(p)}>
                    Publish Pitch
                  </button>
                  <button className="btn danger" onClick={() => deletePitch(i)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* SOCIAL MEDIA PREVIEW */}
          {previewPitch && (
            <div className="social-preview">
              <h3>Social Media Post Preview</h3>

              <div className="social-card" ref={previewRef}>
                <h2>{previewPitch.title}</h2>
                <p>{previewPitch.description}</p>

                <p><strong>Budget Needed:</strong> {previewPitch.budget}</p>

                <div className="needs">
                  {previewPitch.needs.map(n => <span key={n} className="tag">{n}</span>)}
                </div>

                <p className="cta">DM us to collaborate 🤝</p>
              </div>

              <div className="card-actions">
                <button className="btn primary" onClick={exportAsImage}>
                  Download as Image
                </button>
                <button className="btn ghost" onClick={() => setPreviewPitch(null)}>
                  Close Preview
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  )
}

export default Fundraising
