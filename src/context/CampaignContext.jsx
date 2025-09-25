import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from './AuthContext'

const CampaignContext = createContext()

export const useCampaigns = () => {
  const context = useContext(CampaignContext)
  if (!context) {
    throw new Error('useCampaigns must be used within a CampaignProvider')
  }
  return context
}

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000"

export const CampaignProvider = ({ children }) => {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${API_URL}/campaigns`)
        // backend returns an array of campaigns
        setCampaigns(res.data)
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
      const res = await axios.post(`${API_URL}/campaigns`, campaignData)
      const newCampaign = res.data
      setCampaigns(prev => [...prev, newCampaign])
      return newCampaign
    } catch (err) {
      console.error("Error adding campaign:", err)
      throw err
    }
  }

  // Donate to a campaign (POST /campaigns/:id/donate)
  const donateToCampaign = async (campaignId, amount, donorInfo) => {
    try {
      const res = await axios.post(`${API_URL}/campaigns/${campaignId}/donate`, {
        ...donorInfo,
        amount
      })
      const updatedCampaign = res.data
      setCampaigns(prev => prev.map(c => (c.id === updatedCampaign.id ? updatedCampaign : c)))
      return updatedCampaign
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
