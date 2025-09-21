import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Heart, User, LogOut, Plus, Home, Info, Mail } from 'lucide-react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <Heart className="logo-icon" />
          FundConnect
        </Link>
        
        <div className="nav-links">
          <Link to="/" className="nav-link">
            <Home size={16} />
            Home
          </Link>
          <Link to="/about" className="nav-link">
            <Info size={16} />
            About Us
          </Link>
          <Link to="/contact" className="nav-link">
            <Mail size={16} />
            Contact Us
          </Link>
          
          {user ? (
            <>
              <Link to="/create-campaign" className="nav-link">
                <Plus size={16} />
                Create Campaign
              </Link>
              <Link to="/dashboard" className="nav-link">
                <User size={16} />
                Dashboard
              </Link>
              <button onClick={handleLogout} className="nav-link logout-btn">
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/register" className="nav-link register-btn">Get Started</Link>
              <Link to="/login" className="nav-link">Login</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar