import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCampaigns } from '../context/CampaignContext'
import { Plus, Target, DollarSign, Users, Trash2, Calendar } from 'lucide-react'
import ConfirmModal from '../components/ConfirmModal'

const Dashboard = () => {
  const { user } = useAuth()
  const { campaigns, getUserCampaigns, deleteCampaign } = useCampaigns()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [campaignToDelete, setCampaignToDelete] = useState(null)
  const [showAllFeatured, setShowAllFeatured] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState('')
  const [priceRange, setPriceRange] = useState('')
  
  const handleDeleteClick = (campaign) => {
    if (campaign.raised > 0) {
      alert('Cannot delete campaigns that have received contributions')
      return
    }
    setCampaignToDelete(campaign)
    setShowDeleteModal(true)
  }
  
  const handleConfirmDelete = async () => {
    try {
      await deleteCampaign(campaignToDelete.id)
      setShowDeleteModal(false)
      setCampaignToDelete(null)
    } catch (err) {
      alert('Failed to delete campaign')
    }
  }
  
  const handleCancelDelete = () => {
    setShowDeleteModal(false)
    setCampaignToDelete(null)
  }

  if (!user) {
    return (
      <div className="auth-required">
        <h2>Your Fundraising Dashboard</h2>
        <p>Track your campaigns, monitor donations, and manage your fundraising efforts all in one place.</p>
        <div className="auth-actions">
          <Link to="/register" className="btn btn-primary">Create Account</Link>
          <Link to="/login" className="btn btn-secondary">Sign In</Link>
        </div>
      </div>
    )
  }

  const userCampaigns = user ? getUserCampaigns(user.id) : []
  const totalRaised = userCampaigns.reduce((sum, campaign) => sum + (campaign.raised || 0), 0)
  const totalDonors = userCampaigns.reduce((sum, campaign) => sum + (campaign.supporters || 0), 0)

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
    const images = {
      entrepreneurship: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=250&fit=crop',
      education: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=250&fit=crop',
      healthcare: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop',
      charity: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=250&fit=crop',
      animals: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=250&fit=crop',
      wars: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=250&fit=crop'
    }
    return images[category] || images.charity
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user.name}!</h1>
        <Link to="/create-campaign" className="btn btn-primary">
          <Plus size={18} />
          Create New Campaign
        </Link>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <Target className="stat-icon" />
          <div className="stat-content">
            <h3>{userCampaigns.length}</h3>
            <p>Active Campaigns</p>
          </div>
        </div>
        <div className="stat-card">
          <DollarSign className="stat-icon" />
          <div className="stat-content">
            <h3>{formatCurrency(totalRaised)}</h3>
            <p>Total Raised</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <h2>Your Campaigns</h2>
        {userCampaigns.length === 0 ? (
          <div className="no-campaigns">
            <p>You haven't created any campaigns yet.</p>
            <Link to="/create-campaign" className="btn btn-primary">
              Create Your First Campaign
            </Link>
          </div>
        ) : (
          <div className="campaigns-grid">
            {userCampaigns.map(campaign => (
              <div key={campaign.id} className="campaign-card">
                <div className="campaign-image">
                  <img src={getCategoryImage(campaign.category)} alt={campaign.category} />
                </div>
                <div className="campaign-content">
                  <div className="campaign-header">
                    <h3>
                      <Link to={`/campaign/${campaign.id}`} state={{ from: 'dashboard' }}>
                        {campaign.title.length > 25 ? campaign.title.substring(0, 25) + '...' : campaign.title}
                      </Link>
                    </h3>
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
                  
                  {campaign.raised === 0 && (
                    <div className="campaign-meta">
                      <button 
                        onClick={() => handleDeleteClick(campaign)}
                        className="delete-btn"
                        title="Delete campaign"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}

                  <div className="meta-item">
                    <Calendar size={16} />
                    <span>{new Date(campaign.createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>

                  <div className="campaign-actions">
                    <Link to={`/campaign/${campaign.id}`} state={{ from: 'dashboard' }} className="btn btn-primary">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {(() => {
          const featuredCampaigns = campaigns.filter(c => parseInt(c.creatorId || 0) !== parseInt(user?.id || 0))
          const filteredFeatured = featuredCampaigns.filter(campaign => {
            const matchesCategory = !categoryFilter || campaign.category?.toLowerCase() === categoryFilter.toLowerCase()
            const matchesPrice = !priceRange || (
              (priceRange === 'under1000' && campaign.goal < 1000) ||
              (priceRange === '1000-5000' && campaign.goal >= 1000 && campaign.goal <= 5000) ||
              (priceRange === '5000-10000' && campaign.goal >= 5000 && campaign.goal <= 10000) ||
              (priceRange === 'over10000' && campaign.goal > 10000)
            )
            return matchesCategory && matchesPrice
          })
          
          return filteredFeatured.length > 0 && (
            <>
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
              
              <div className="campaigns-grid">
                {filteredFeatured.slice(0, showAllFeatured ? undefined : 4).map(campaign => (
                <div key={campaign.id} className="campaign-card">
                  <div className="campaign-image">
                    <img src={getCategoryImage(campaign.category)} alt={campaign.category} />
                  </div>
                  <div className="campaign-content">
                    <div className="campaign-header">
                      <h3>
                        <Link to={`/campaign/${campaign.id}`} state={{ from: 'dashboard' }}>
                          {campaign.title.length > 25 ? campaign.title.substring(0, 25) + '...' : campaign.title}
                        </Link>
                      </h3>
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
                    
                    <div className="meta-item">
                      <Calendar size={16} />
                      <span>{new Date(campaign.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>

                    <div className="campaign-actions">
                      <Link to={`/campaign/${campaign.id}`} state={{ from: 'dashboard' }} className="btn btn-secondary">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
                {filteredFeatured.length > 4 && (
                  <div className="view-more-section">
                    <button 
                      onClick={() => setShowAllFeatured(!showAllFeatured)} 
                      className="btn btn-secondary"
                    >
                      {showAllFeatured ? 'View Less' : `View More (${filteredFeatured.length - 4} more)`}
                    </button>
                  </div>
                )}
              </>
            )
        })()}
      </div>
      
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Campaign"
        message={`Are you sure you want to delete "${campaignToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}

export default Dashboard