import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCampaigns } from '../context/CampaignContext'
import { useAuth } from '../context/AuthContext'
import { Target, Users, Calendar } from 'lucide-react'

const Home = () => {
  const { campaigns, loading, error } = useCampaigns()
  const { user } = useAuth()
  const [showAll, setShowAll] = useState(false)
  
  console.log('Home page - campaigns:', campaigns, 'loading:', loading, 'error:', error)
  
  const displayedCampaigns = showAll ? campaigns : campaigns.slice(0, 4)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getProgressPercentage = (raised, goal) => {
    return Math.min((raised / goal) * 100, 100)
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Empower Dreams, Fund the Future</h1>
          <p>Connect with entrepreneurs and changemakers. Support causes that matter.</p>
          <div className="hero-actions">
            {!user ? (
              <>
                <Link to="/register" className="btn btn-primary">Get Started</Link>
                <Link to="/login" className="btn btn-secondary">Sign In</Link>
              </>
            ) : (
              <Link to="/create-campaign" className="btn btn-primary">Create Campaign</Link>
            )}
          </div>
        </div>
      </section>

      <section className="campaigns-section">
        <h2>Featured Campaigns</h2>
        {loading ? (
          <div className="loading-campaigns">
            <p>Loading campaigns...</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="no-campaigns">
            <p>No campaigns yet. {user ? 'Be the first to create one!' : 'Sign up to create the first campaign!'}</p>
            <Link to={user ? "/create-campaign" : "/register"} className="btn btn-primary">
              {user ? 'Create Campaign' : 'Get Started'}
            </Link>
          </div>
        ) : (
          <>
            <div className="campaigns-grid">
              {displayedCampaigns.map(campaign => (
                <div key={campaign.id} className="campaign-card">
                  <div className="campaign-header">
                    <h3>{campaign.title}</h3>
                    <span className="campaign-category">{campaign.category}</span>
                  </div>
                  <p className="campaign-description">{campaign.description}</p>
                  
                  <div className="campaign-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${getProgressPercentage(campaign.raised, campaign.goal)}%` }}
                      ></div>
                    </div>
                    <div className="progress-stats">
                      <span className="raised">{formatCurrency(campaign.raised)}</span>
                      <span className="goal">of {formatCurrency(campaign.goal)}</span>
                    </div>
                  </div>

                  <div className="campaign-meta">
                    <div className="meta-item">
                      <Users size={16} />
                      <span>{campaign.donors?.length || 0} donors</span>
                    </div>
                    <div className="meta-item">
                      <Calendar size={16} />
                      <span>{new Date(campaign.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="campaign-actions">
                    <Link to={`/campaign/${campaign.id}`} className="btn btn-secondary">
                      View Details
                    </Link>
                    <Link to={`/campaign/${campaign.id}`} className="btn btn-primary">
                      Contribute
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            {campaigns.length > 4 && (
              <div className="view-more-section">
                <button 
                  onClick={() => setShowAll(!showAll)} 
                  className="btn btn-secondary"
                >
                  {showAll ? 'View Less' : `View More (${campaigns.length - 4} more)`}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}

export default Home