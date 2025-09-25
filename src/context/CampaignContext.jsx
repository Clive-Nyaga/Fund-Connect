import { createContext, useContext, useState, useEffect } from 'react'
import { campaignAPI, donationAPI, updatesAPI } from '../services/api'
import { useAuth } from './AuthContext'

const CampaignContext = createContext()

export const useCampaigns = () => {
  const context = useContext(CampaignContext)
  if (!context) {
    throw new Error('useCampaigns must be used within a CampaignProvider')
  }
  return context
}

// Transform backend campaign data to frontend format
const transformCampaignFromBackend = (backendCampaign) => {
  return {
    ...backendCampaign,
    goal: backendCampaign.targetamount,
    raised: backendCampaign.raisedamount || 0,
    title: backendCampaign.description,
    creatorId: backendCampaign.user_id,
    creatorName: backendCampaign.user?.name || 'Unknown',
    supporters: backendCampaign.supporters || 0,
    donors: backendCampaign.donations || []
  }
}

// Transform frontend campaign data to backend format
const transformCampaignToBackend = (frontendCampaign) => {
  return {
    category: frontendCampaign.category,
    description: frontendCampaign.title || frontendCampaign.description,
    targetamount: frontendCampaign.goal
  }
}

export const CampaignProvider = ({ children }) => {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true)
      try {
        const res = await campaignAPI.getAll()
        console.log('Raw API response:', res)
        console.log('Response data:', res.data)
        
        // Handle different response formats
        let backendCampaigns = []
        if (res.data.campaigns) {
          backendCampaigns = res.data.campaigns
        } else if (Array.isArray(res.data)) {
          backendCampaigns = res.data
        }
        
        console.log('Backend campaigns:', backendCampaigns)
        const transformedCampaigns = backendCampaigns.map(transformCampaignFromBackend)
        console.log('Transformed campaigns:', transformedCampaigns)
        setCampaigns(transformedCampaigns)
      } catch (err) {
        setError("Failed to load campaigns")
        console.error('Campaign fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCampaigns()
  }, [])

  // Add new campaign
  const addCampaign = async (campaignData) => {
    try {
      const backendData = transformCampaignToBackend(campaignData)
      const res = await campaignAPI.create(backendData)
      // Refresh campaigns after creation
      const campaignsRes = await campaignAPI.getAll()
      const backendCampaigns = campaignsRes.data.campaigns || []
      const transformedCampaigns = backendCampaigns.map(transformCampaignFromBackend)
      setCampaigns(transformedCampaigns)
      return res.data
    } catch (err) {
      console.error("Error adding campaign:", err)
      throw err
    }
  }

  // Donate to a campaign
  const donateToCampaign = async (campaignId, amount, donorInfo) => {
    try {
      // Create the donation
      const donationRes = await donationAPI.create({
        campaignId,
        amount,
        title: donorInfo.name || 'Anonymous Donation',
        paymentmethod: donorInfo.paymentmethod || 'card'
      })
      
      // Create an update entry for the donation
      const campaign = getCampaignById(campaignId)
      const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount)
      
      await updatesAPI.create({
        campaignId,
        title: `New Donation Received`,
        description: `${donorInfo.name || 'An anonymous donor'} contributed ${formattedAmount} to ${campaign?.title || 'this campaign'}. Thank you for your support!`
      })
      
      // Refresh campaigns to get updated data from backend
      const campaignsRes = await campaignAPI.getAll()
      console.log('Campaigns after donation:', campaignsRes)
      
      let backendCampaigns = []
      if (campaignsRes.data.campaigns) {
        backendCampaigns = campaignsRes.data.campaigns
      } else if (Array.isArray(campaignsRes.data)) {
        backendCampaigns = campaignsRes.data
      }
      
      const transformedCampaigns = backendCampaigns.map(transformCampaignFromBackend)
      console.log('Transformed campaigns after donation:', transformedCampaigns)
      setCampaigns(transformedCampaigns)
      return donationRes.data
    } catch (err) {
      console.error("Error donating:", err)
      throw err
    }
  }

  const deleteCampaign = async (campaignId) => {
    try {
      await campaignAPI.delete(campaignId)
      // Refresh campaigns after deletion
      const campaignsRes = await campaignAPI.getAll()
      const backendCampaigns = campaignsRes.data.campaigns || []
      const transformedCampaigns = backendCampaigns.map(transformCampaignFromBackend)
      setCampaigns(transformedCampaigns)
    } catch (err) {
      console.error("Error deleting campaign:", err)
      throw err
    }
  }

  const getCampaignById = (id) => {
    return campaigns.find(c => parseInt(c.id) === parseInt(id))
  }

  const getUserCampaigns = (userId) => {
    return campaigns.filter(c => parseInt(c.creatorId) === parseInt(userId))
  }

  const value = {
    campaigns,
    loading,
    error,
    addCampaign,
    donateToCampaign,
    deleteCampaign,
    getCampaignById,
    getUserCampaigns
  }

  return (
    <CampaignContext.Provider value={value}>
      {children}
    </CampaignContext.Provider>
  )
}