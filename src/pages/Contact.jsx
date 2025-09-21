import { useState } from 'react'
import { Mail, Phone, MapPin, Send } from 'lucide-react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, this would send the message to a backend
    setSubmitted(true)
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="hero-content">
          <h1>Contact Us</h1>
          <p>We're here to help and answer any questions you might have</p>
        </div>
      </section>

      <section className="contact-content">
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p>
            Have questions about FundConnect? Need help with your campaign? 
            Want to report an issue? We'd love to hear from you.
          </p>
          
          <div className="contact-methods">
            <div className="contact-method">
              <Mail className="contact-icon" />
              <div>
                <h4>Email Us</h4>
                <p>support@fundconnect.com</p>
                <p>We typically respond within 24 hours</p>
              </div>
            </div>
            
            <div className="contact-method">
              <Phone className="contact-icon" />
              <div>
                <h4>Call Us</h4>
                <p>+1 (555) 123-4567</p>
                <p>Monday - Friday, 9 AM - 6 PM EST</p>
              </div>
            </div>
            
            <div className="contact-method">
              <MapPin className="contact-icon" />
              <div>
                <h4>Visit Us</h4>
                <p>123 Innovation Drive</p>
                <p>Tech City, TC 12345</p>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form-section">
          <h2>Send us a Message</h2>
          {submitted ? (
            <div className="success-message">
              <h3>Thank you for your message!</h3>
              <p>We've received your inquiry and will get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="campaign-help">Campaign Help</option>
                  <option value="donation-issue">Donation Issue</option>
                  <option value="technical-support">Technical Support</option>
                  <option value="partnership">Partnership Inquiry</option>
                  <option value="general">General Question</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Tell us how we can help you..."
                  required
                />
              </div>
              
              <button type="submit" className="btn btn-primary">
                <Send size={16} />
                Send Message
              </button>
            </form>
          )}
        </div>
      </section>

      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h4>How do I create a campaign?</h4>
            <p>Simply register for an account, click "Create Campaign", and fill out the campaign details including your goal, description, and category.</p>
          </div>
          
          <div className="faq-item">
            <h4>What fees does FundConnect charge?</h4>
            <p>We charge a small platform fee of 5% on successfully funded campaigns to maintain and improve our services.</p>
          </div>
          
          <div className="faq-item">
            <h4>How do I receive my funds?</h4>
            <p>Funds are transferred to your verified bank account within 3-5 business days after your campaign reaches its goal.</p>
          </div>
          
          <div className="faq-item">
            <h4>Can I edit my campaign after publishing?</h4>
            <p>Yes, you can update your campaign description and add progress updates, but the funding goal cannot be changed once published.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact