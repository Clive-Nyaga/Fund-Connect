import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Heart, User, LogOut, Plus } from 'lucide-react'

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
          {user ? (
            <>
              <Link to="/create-campaign" className="nav-link">
                <Plus size={18} />
                Create Campaign
              </Link>
              <Link to="/dashboard" className="nav-link">
                <User size={18} />
                Dashboard
              </Link>
              <button onClick={handleLogout} className="nav-link logout-btn">
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link register-btn">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar