import { Mail, Phone, MapPin, Clock, Users, Heart } from 'lucide-react'

const Contact = () => {
  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="hero-content">
          <h1>Contact Us</h1>
          <p>We're here to help and answer any questions you might have about FundConnect</p>
        </div>
      </section>

      <section className="contact-content">
        <div className="contact-info-centered">
          <h2>Get in Touch</h2>
          <p>
            Whether you're starting your first campaign, need technical support, or want to learn more about our platform, 
            our dedicated team is ready to assist you every step of the way.
          </p>
          
          <div className="contact-methods">
            <div className="contact-method">
              <Mail className="contact-icon" />
              <h4>Email Support</h4>
              <p>support@fundconnect.com</p>
              <p>Get detailed help with campaigns, donations, and technical issues. We respond within 24 hours.</p>
            </div>
            
            <div className="contact-method">
              <Phone className="contact-icon" />
              <h4>Phone Support</h4>
              <p>+1 (555) 123-4567</p>
              <p>Speak directly with our support team Monday through Friday, 9 AM - 6 PM EST.</p>
            </div>
            
            <div className="contact-method">
              <MapPin className="contact-icon" />
              <h4>Visit Our Office</h4>
              <p>123 Innovation Drive, Tech City, TC 12345</p>
              <p>Schedule an appointment to meet our team and learn about partnership opportunities.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-cta">
        <h3>Ready to Start Your Campaign?</h3>
        <p>Join thousands of successful fundraisers who have raised millions for causes that matter.</p>
        
        <div className="contact-stats">
          <div className="contact-stat">
            <h4>10K+</h4>
            <p>Active Campaigns</p>
          </div>
          <div className="contact-stat">
            <h4>$2M+</h4>
            <p>Funds Raised</p>
          </div>
          <div className="contact-stat">
            <h4>50K+</h4>
            <p>Happy Donors</p>
          </div>
          <div className="contact-stat">
            <h4>24/7</h4>
            <p>Platform Uptime</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact