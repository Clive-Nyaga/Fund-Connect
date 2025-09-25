import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCampaigns } from '../context/CampaignContext'

const CreateCampaign = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal: '',
    category: 'entrepreneurship'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { addCampaign } = useCampaigns()
  const navigate = useNavigate()

  const categories = [
    'entrepreneurship',
    'education',
    'healthcare',
    'charity',
    'animals',
    'wars'
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!user) {
      setError('You must be logged in to create a campaign')
      setLoading(false)
      return
    }

    if (!formData.title || !formData.description || !formData.goal) {
      setError('Please fill in all required fields')
      setLoading(false)
      return
    }

    const goal = parseFloat(formData.goal)
    if (isNaN(goal) || goal <= 0) {
      setError('Please enter a valid goal amount')
      setLoading(false)
      return
    }

    const campaignData = {
      title: formData.title,
      description: formData.description,
      goal: goal,
      category: formData.category
    }

    try {
      await addCampaign(campaignData)
      navigate('/')
    } catch (err) {
      setError(`Failed to create campaign: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (!user || !localStorage.getItem('fundconnect_token')) {
    return (
      <div className="auth-required">
        <h2>Ready to Start Fundraising?</h2>
        <p>Please log in to create a campaign and start raising funds for your cause.</p>
        <div className="auth-actions">
          <Link to="/login" className="btn btn-primary">Sign In</Link>
          <Link to="/register" className="btn btn-secondary">Create Account</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="create-campaign-page">
      <div className="form-container">
        <h2>Create Your Campaign</h2>
        <p>Share your vision and start raising funds for your cause</p>

        <form onSubmit={handleSubmit} className="campaign-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="title">Campaign Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter a compelling title for your campaign"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="goal">Funding Goal ($) *</label>
            <input
              type="number"
              id="goal"
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              placeholder="Enter your funding goal"
              min="1"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your campaign, what you're raising funds for, and how the money will be used"
              rows="6"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Creating Campaign...' : 'Create Campaign'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateCampaign