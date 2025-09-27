import { useState, useEffect } from 'react'
import { useParams, Navigate, Link, useLocation, useNavigate } from 'react-router-dom'
import { useCampaigns } from '../context/CampaignContext'
import { useAuth } from '../context/AuthContext'
import { Target, Users, Calendar, DollarSign, ArrowLeft } from 'lucide-react'

const CampaignDetail = () => {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { getCampaignById, donateToCampaign } = useCampaigns()
  const { user } = useAuth()
  const [donationAmount, setDonationAmount] = useState('')
  const [showDonationForm, setShowDonationForm] = useState(false)
  const [message, setMessage] = useState('')
  const [backPath, setBackPath] = useState('/')
  
  useEffect(() => {
    // Determine where to go back based on referrer or state
    if (location.state?.from === 'dashboard') {
      setBackPath('/dashboard')
    } else if (document.referrer.includes('/dashboard')) {
      setBackPath('/dashboard')
    }
  }, [location])

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

  const getCategoryImage = (category) => {
    const images = {
      entrepreneurship: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=400&fit=crop',
      education: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop',
      healthcare: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
      community: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=400&fit=crop',
      environment: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop',
      technology: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop',
      arts: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=400&fit=crop',
      sports: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop'
    }
    return images[category] || images.community
  }

  const handleDonate = async (e) => {
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

    // Check if donation would exceed target amount
    const remainingAmount = campaign.goal - campaign.raised
    if (amount > remainingAmount) {
      setMessage(`Donation amount cannot exceed the remaining target of ${formatCurrency(remainingAmount)}`)
      return
    }

    try {
      const donorInfo = {
        id: user.id,
        name: user.name,
        email: user.email
      }

      await donateToCampaign(campaign.id, amount, donorInfo)
      setMessage(`Thank you for your donation of ${formatCurrency(amount)}!`)
      
      // Redirect to dashboard after successful donation
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
      
      setDonationAmount('')
      setShowDonationForm(false)
    } catch (error) {
      console.error('Donation error:', error)
      setMessage('Failed to process donation. Please try again.')
    }
  }

  return (
    <div className="campaign-detail">
      <div className="campaign-back">
        <Link to={backPath} className="back-link">
          <ArrowLeft size={20} />
          {backPath === '/dashboard' ? 'Back to Dashboard' : 'Back to Campaigns'}
        </Link>
      </div>
      
      <div className="campaign-hero">
        <img src={getCategoryImage(campaign.category)} alt={campaign.category} className="campaign-hero-image" />
        <div className="campaign-hero-overlay">
          <span className="category">{campaign.category}</span>
          <h1>{campaign.title}</h1>
          <div className="campaign-meta">
            <span className="creator">by {campaign.creatorName}</span>
            <span className="date">
              <Calendar size={16} />
              {new Date(campaign.createdAt || Date.now()).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="campaign-content">
        <div className="campaign-main">
          <div className="campaign-description">
            <h3>About This Campaign</h3>
            <p>{campaign.description}</p>
          </div>

          <div className="campaign-creator">
            <h3>Campaign Creator</h3>
            <div className="creator-info">
              <div className="creator-details">
                <h4>{campaign.creatorName}</h4>
                <p className="creator-designation">{campaign.creatorDesignation || 'Individual'}</p>
              </div>
            </div>
          </div>

          {campaign.donors && campaign.donors.length > 0 && (
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
                    max={campaign.goal - campaign.raised}
                    step="0.01"
                    required
                  />
                  <small style={{ color: '#64748b', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                    Maximum: {formatCurrency(campaign.goal - campaign.raised)}
                  </small>
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