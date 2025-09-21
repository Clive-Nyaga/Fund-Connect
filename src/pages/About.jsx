import { Link } from 'react-router-dom'
import { Target, Users, Shield, Heart } from 'lucide-react'

const About = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="hero-content">
          <h1>About FundConnect</h1>
          <p>Empowering dreams and connecting communities through crowdfunding</p>
        </div>
      </section>

      <section className="about-content">
        <div className="about-section">
          <h2>Our Mission</h2>
          <p>
            FundConnect bridges the funding gap for aspiring entrepreneurs and social changemakers 
            who often face difficulties accessing traditional financing options. We provide a secure, 
            transparent, and user-friendly platform where campaign creators can share their vision 
            and receive financial support from a community of donors.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <Target className="feature-icon" />
            <h3>Empower Entrepreneurs</h3>
            <p>Provide a platform for entrepreneurs and changemakers to showcase their vision and raise funds for their projects.</p>
          </div>
          
          <div className="feature-card">
            <Shield className="feature-icon" />
            <h3>Promote Transparency</h3>
            <p>Allow donors to track how their contributions are being used through regular campaign updates and progress reports.</p>
          </div>
          
          <div className="feature-card">
            <Users className="feature-icon" />
            <h3>Build Community</h3>
            <p>Create connections between supporters and creators, fostering a community of people passionate about positive change.</p>
          </div>
          
          <div className="feature-card">
            <Heart className="feature-icon" />
            <h3>Ensure Trust</h3>
            <p>Implement fraud prevention measures and campaign verification to maintain accountability and donor confidence.</p>
          </div>
        </div>

        <div className="about-section">
          <h2>Who We Serve</h2>
          <div className="served-groups">
            <div className="group">
              <h4>Campaign Creators</h4>
              <ul>
                <li>Entrepreneurs with innovative business ideas</li>
                <li>Individuals raising funds for noble causes</li>
                <li>NGOs and community organizations</li>
                <li>Students with impactful projects</li>
              </ul>
            </div>
            
            <div className="group">
              <h4>Supporters & Donors</h4>
              <ul>
                <li>Individuals wanting to contribute to meaningful causes</li>
                <li>Organizations seeking to support vetted initiatives</li>
                <li>Philanthropists looking for transparent giving opportunities</li>
                <li>Community members supporting local projects</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="cta-section">
          <h2>Ready to Make a Difference?</h2>
          <p>Join thousands of creators and supporters who are changing the world, one campaign at a time.</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary">Start Your Campaign</Link>
            <Link to="/" className="btn btn-secondary">Explore Campaigns</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About