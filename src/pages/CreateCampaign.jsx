import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  const { user } = useAuth()
  const { addCampaign } = useCampaigns()
  const navigate = useNavigate()

  const categories = [
    'entrepreneurship',
    'education',
    'healthcare',
    'community',
    'environment',
    'technology',
    'arts',
    'sports'
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!user) {
      setError('You must be logged in to create a campaign')
      return
    }

    if (!formData.title || !formData.description || !formData.goal) {
      setError('Please fill in all required fields')
      return
    }

    const goal = parseFloat(formData.goal)
    if (isNaN(goal) || goal <= 0) {
      setError('Please enter a valid goal amount')
      return
    }

    const campaignData = {
      ...formData,
      goal: goal,
      creatorId: user.id,
      creatorName: user.name
    }

    const newCampaign = addCampaign(campaignData)
    navigate(`/campaign/${newCampaign.id}`)
  }

  if (!user) {
    return (
      <div className="auth-required">
        <h2>Authentication Required</h2>
        <p>Please log in to create a campaign.</p>
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

          <button type="submit" className="btn btn-primary btn-full">
            Create Campaign
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateCampaign