import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCampaigns } from '../context/CampaignContext'
import { Plus, Target, DollarSign, Users, Trash2 } from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()
  const { campaigns, getUserCampaigns, deleteCampaign } = useCampaigns()
  
  const handleDeleteCampaign = async (campaignId, campaignRaised) => {
    if (campaignRaised > 0) {
      alert('Cannot delete campaigns that have received contributions')
      return
    }
    
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        await deleteCampaign(campaignId)
      } catch (err) {
        alert('Failed to delete campaign')
      }
    }
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
          <div className="campaigns-list">
            {userCampaigns.map(campaign => (
              <div key={campaign.id} className="campaign-item">
                <div className="campaign-info">
                  <h3>
                    <Link to={`/campaign/${campaign.id}`}>
                      {campaign.title}
                    </Link>
                  </h3>
                  <p className="campaign-category">{campaign.category}</p>
                  <p className="campaign-description">{campaign.description}</p>
                </div>
                
                <div className="campaign-stats">
                  <div className="progress-section">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${getProgressPercentage(campaign.raised, campaign.goal)}%` }}
                      ></div>
                    </div>
                    <div className="progress-text">
                      {formatCurrency(campaign.raised)} of {formatCurrency(campaign.goal)}
                      ({getProgressPercentage(campaign.raised, campaign.goal).toFixed(1)}%)
                    </div>
                  </div>
                  
                  <div className="campaign-meta">
                    <span>{campaign.donors?.length || 0} donors</span>
                    <span>Created {new Date(campaign.createdAt || Date.now()).toLocaleDateString()}</span>
                    {campaign.raised === 0 && (
                      <button 
                        onClick={() => handleDeleteCampaign(campaign.id, campaign.raised)}
                        className="delete-btn"
                        title="Delete campaign"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {campaigns.filter(c => parseInt(c.creatorId || 0) !== parseInt(user?.id || 0)).length > 0 && (
          <>
            <h2>Featured Campaigns</h2>
            <div className="campaigns-list">
              {campaigns.filter(c => parseInt(c.creatorId || 0) !== parseInt(user?.id || 0)).slice(0, 3).map(campaign => (
            <div key={campaign.id} className="campaign-item">
              <div className="campaign-info">
                <h3>
                  <Link to={`/campaign/${campaign.id}`}>
                    {campaign.title}
                  </Link>
                </h3>
                <p className="campaign-category">{campaign.category}</p>
                <p className="campaign-description">{campaign.description}</p>
              </div>
              
              <div className="campaign-stats">
                <div className="progress-section">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${getProgressPercentage(campaign.raised, campaign.goal)}%` }}
                    ></div>
                  </div>
                  <div className="progress-text">
                    {formatCurrency(campaign.raised)} of {formatCurrency(campaign.goal)}
                    ({getProgressPercentage(campaign.raised, campaign.goal).toFixed(1)}%)
                  </div>
                </div>
                
                <div className="campaign-meta">
                  <span>{campaign.donors?.length || 0} donors</span>
                  <span>Created {new Date(campaign.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard