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
  const totalDonors = userCampaigns.reduce((sum, campaign) => sum + (campaign.donors?.length || 0), 0)

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
        <div className="stat-card">
          <Users className="stat-icon" />
          <div className="stat-content">
            <h3>{totalDonors}</h3>
            <p>Total Supporters</p>
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
                      <Link to={`/campaign/${campaign.id}`}>
                        {campaign.title}
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
                  
                  <div className="campaign-meta">
                    <div className="meta-item">
                      <Users size={16} />
                      <span>{campaign.donors?.length || 0} donors</span>
                    </div>
                    <div className="meta-item">
                      <Calendar size={16} />
                      <span>{new Date(campaign.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                    {campaign.raised === 0 && (
                      <button 
                        onClick={() => handleDeleteClick(campaign)}
                        className="delete-btn"
                        title="Delete campaign"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <div className="campaign-actions">
                    <Link to={`/campaign/${campaign.id}`} className="btn btn-secondary">
                      View Details
                    </Link>
                    <Link to={`/campaign/${campaign.id}`} className="btn btn-primary">
                      Manage
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {campaigns.filter(c => parseInt(c.creatorId || 0) !== parseInt(user?.id || 0)).length > 0 && (
          <>
            <h2>Featured Campaigns</h2>
            <div className="campaigns-grid">
              {campaigns.filter(c => parseInt(c.creatorId || 0) !== parseInt(user?.id || 0)).slice(0, 3).map(campaign => (
                <div key={campaign.id} className="campaign-card">
                  <div className="campaign-image">
                    <img src={getCategoryImage(campaign.category)} alt={campaign.category} />
                  </div>
                  <div className="campaign-content">
                    <div className="campaign-header">
                      <h3>
                        <Link to={`/campaign/${campaign.id}`}>
                          {campaign.title}
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
                </div>
              ))}
            </div>
          </>
        )}
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