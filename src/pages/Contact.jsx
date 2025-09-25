import { Mail, Phone, MapPin } from 'lucide-react'

const Contact = () => {
  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="hero-content">
          <h1>Contact Us</h1>
          <p>We're here to help and answer any questions you might have</p>
        </div>
      </section>

      <section className="contact-content">
        <div className="contact-info-centered">
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
      </section>
    </div>
  )
}

export default Contact