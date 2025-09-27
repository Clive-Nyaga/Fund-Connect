import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCampaigns } from '../context/CampaignContext'
import { useAuth } from '../context/AuthContext'
import { Target, Users, Calendar } from 'lucide-react'

const Home = () => {
  const { campaigns, loading, error } = useCampaigns()
  const { user } = useAuth()
  const [showAll, setShowAll] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState('')
  const [priceRange, setPriceRange] = useState('')
  
  console.log('Home page - campaigns:', campaigns, 'loading:', loading, 'error:', error)
  
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesCategory = !categoryFilter || campaign.category === categoryFilter
    const matchesPrice = !priceRange || (
      priceRange === 'under1000' && campaign.goal < 1000 ||
      priceRange === '1000-5000' && campaign.goal >= 1000 && campaign.goal <= 5000 ||
      priceRange === '5000-10000' && campaign.goal >= 5000 && campaign.goal <= 10000 ||
      priceRange === 'over10000' && campaign.goal > 10000
    )
    return matchesCategory && matchesPrice
  })
  
  const displayedCampaigns = showAll ? filteredCampaigns : filteredCampaigns.slice(0, 4)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getProgressPercentage = (raised, goal) => {
    return Math.min((raised / goal) * 100, 100)
  }

  const getCategoryImage = (category) => {
    console.log('Category for image:', category)
    const images = {
      entrepreneurship: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=250&fit=crop',
      education: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=250&fit=crop',
      healthcare: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop',
      charity: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=250&fit=crop',
      animals: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=250&fit=crop',
      wars: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=250&fit=crop'
    }
    const selectedImage = images[category] || images.charity
    console.log('Selected image:', selectedImage)
    return selectedImage
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
              <Link to="/create-campaign" className="btn btn-success">Create Campaign</Link>
            )}
          </div>
        </div>
      </section>

      <section className="campaigns-section">
        <h2>Featured Campaigns</h2>
        
        <div className="search-filters">
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            <option value="entrepreneurship">Entrepreneurship</option>
            <option value="education">Education</option>
            <option value="healthcare">Healthcare</option>
            <option value="charity">Charity</option>
            <option value="animals">Animals</option>
            <option value="wars">Wars</option>
          </select>
          
          <select 
            value={priceRange} 
            onChange={(e) => setPriceRange(e.target.value)}
            className="filter-select"
          >
            <option value="">All Price Ranges</option>
            <option value="under1000">Under $1,000</option>
            <option value="1000-5000">$1,000 - $5,000</option>
            <option value="5000-10000">$5,000 - $10,000</option>
            <option value="over10000">Over $10,000</option>
          </select>
        </div>
        {loading ? (
          <div className="loading-campaigns">
            <p>Loading campaigns...</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="no-campaigns">
            <p>No campaigns yet. {user ? 'Be the first to create one!' : 'Sign up to create the first campaign!'}</p>
            <Link to={user ? "/create-campaign" : "/register"} className={user ? "btn btn-success" : "btn btn-primary"}>
              {user ? 'Create Campaign' : 'Get Started'}
            </Link>
          </div>
        ) : (
          <>
            <div className="campaigns-grid">
              {displayedCampaigns.map(campaign => (
                <div key={campaign.id} className="campaign-card">
                  <div className="campaign-image">
                    <img src={getCategoryImage(campaign.category)} alt={campaign.category} />
                  </div>
                  <div className="campaign-content">
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
                      <Calendar size={16} />
                      <span>{new Date(campaign.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                  </div>

                    <div className="campaign-actions">
                      <Link to={`/campaign/${campaign.id}`} className="btn btn-primary">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {filteredCampaigns.length > 4 && (
              <div className="view-more-section">
                <button 
                  onClick={() => setShowAll(!showAll)} 
                  className="btn btn-secondary"
                >
                  {showAll ? 'View Less' : `View More (${filteredCampaigns.length - 4} more)`}
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