import { createContext, useContext, useState, useEffect } from 'react'
import { campaignAPI, donationAPI } from '../services/api'
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
    creatorName: backendCampaign.user?.name || 'Unknown'
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
        // backend returns {campaigns: [...], total, pages, current_page}
        const backendCampaigns = res.data.campaigns || []
        const transformedCampaigns = backendCampaigns.map(transformCampaignFromBackend)
        setCampaigns(transformedCampaigns)
      } catch (err) {
        setError("Failed to load campaigns")
        console.error(err)
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
      const res = await donationAPI.create({
        campaignId,
        amount,
        title: donorInfo.name || 'Anonymous Donation',
        paymentmethod: donorInfo.paymentmethod || 'card'
      })
      // Refresh campaigns to get updated raised amount
      const campaignsRes = await campaignAPI.getAll()
      const backendCampaigns = campaignsRes.data.campaigns || []
      const transformedCampaigns = backendCampaigns.map(transformCampaignFromBackend)
      setCampaigns(transformedCampaigns)
      return res.data
    } catch (err) {
      console.error("Error donating:", err)
      throw err
    }
  }

  const getCampaignById = (id) => {
    return campaigns.find(c => parseInt(c.id) === parseInt(id))
  }

  const value = {
    campaigns,
    loading,
    error,
    addCampaign,
    donateToCampaign,
    getCampaignById
  }

  return (
    <CampaignContext.Provider value={value}>
      {children}
    </CampaignContext.Provider>
  )
}
