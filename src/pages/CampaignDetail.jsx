import { useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useCampaigns } from '../context/CampaignContext'
import { useAuth } from '../context/AuthContext'
import { Target, Users, Calendar, DollarSign } from 'lucide-react'

const CampaignDetail = () => {
  const { id } = useParams()
  const { getCampaignById, donateToCampaign } = useCampaigns()
  const { user } = useAuth()
  const [donationAmount, setDonationAmount] = useState('')
  const [showDonationForm, setShowDonationForm] = useState(false)
  const [message, setMessage] = useState('')

  const campaign = getCampaignById(id)

  if (!campaign) {
    return <Navigate to="/" replace />
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getProgressPercentage = () => {
    return Math.min((campaign.raised / campaign.goal) * 100, 100)
  }

  const handleDonate = (e) => {
    e.preventDefault()
    
    if (!user) {
      setMessage('Please log in to make a donation')
      setShowDonationForm(false)
      return
    }

    const amount = parseFloat(donationAmount)
    if (isNaN(amount) || amount <= 0) {
      setMessage('Please enter a valid donation amount')
      return
    }

    const donorInfo = {
      id: user.id,
      name: user.name,
      email: user.email
    }

    donateToCampaign(campaign.id, amount, donorInfo)
    setMessage(`Thank you for your donation of ${formatCurrency(amount)}!`)
    setDonationAmount('')
    setShowDonationForm(false)
  }

  return (
    <div className="campaign-detail">
      <div className="campaign-header">
        <h1>{campaign.title}</h1>
        <div className="campaign-meta">
          <span className="category">{campaign.category}</span>
          <span className="creator">by {campaign.creatorName}</span>
          <span className="date">
            <Calendar size={16} />
            {new Date(campaign.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="campaign-content">
        <div className="campaign-main">
          <div className="campaign-description">
            <h3>About This Campaign</h3>
            <p>{campaign.description}</p>
          </div>

          {campaign.donors.length > 0 && (
            <div className="donors-section">
              <h3>Recent Donors</h3>
              <div className="donors-list">
                {campaign.donors.slice(-5).reverse().map((donor, index) => (
                  <div key={index} className="donor-item">
                    <span className="donor-name">{donor.name}</span>
                    <span className="donor-amount">{formatCurrency(donor.amount)}</span>
                    <span className="donor-date">
                      {new Date(donor.date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="campaign-sidebar">
          <div className="funding-card">
            <div className="funding-stats">
              <div className="raised-amount">
                <DollarSign size={24} />
                <span className="amount">{formatCurrency(campaign.raised)}</span>
                <span className="label">raised</span>
              </div>
              <div className="goal-amount">
                <Target size={20} />
                <span>of {formatCurrency(campaign.goal)} goal</span>
              </div>
              <div className="donors-count">
                <Users size={20} />
                <span>{campaign.donors.length} donors</span>
              </div>
            </div>

            <div className="progress-section">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
              <span className="progress-text">
                {getProgressPercentage().toFixed(1)}% funded
              </span>
            </div>

            {message && (
              <div className={`message ${message.includes('Thank you') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}

            {!showDonationForm ? (
              <button 
                onClick={() => {
                  if (!user) {
                    setMessage('Please log in to make a donation')
                    return
                  }
                  setShowDonationForm(true)
                }}
                className="btn btn-primary btn-full"
              >
                {user ? 'Donate Now' : 'Login to Donate'}
              </button>
            ) : (
              <form onSubmit={handleDonate} className="donation-form">
                <div className="form-group">
                  <label htmlFor="amount">Donation Amount ($)</label>
                  <input
                    type="number"
                    id="amount"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    placeholder="Enter amount"
                    min="1"
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    Donate
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowDonationForm(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignDetail