import { createContext, useContext, useState, useEffect } from 'react'

const CampaignContext = createContext()

export const useCampaigns = () => {
  const context = useContext(CampaignContext)
  if (!context) {
    throw new Error('useCampaigns must be used within a CampaignProvider')
  }
  return context
}

export const CampaignProvider = ({ children }) => {
  const [campaigns, setCampaigns] = useState([])

  useEffect(() => {
    const savedCampaigns = localStorage.getItem('fundconnect_campaigns')
    if (savedCampaigns) {
      setCampaigns(JSON.parse(savedCampaigns))
    }
  }, [])

  const addCampaign = (campaignData) => {
    const newCampaign = {
      ...campaignData,
      id: Date.now(),
      raised: 0,
      donors: [],
      createdAt: new Date().toISOString()
    }
    const updatedCampaigns = [...campaigns, newCampaign]
    setCampaigns(updatedCampaigns)
    localStorage.setItem('fundconnect_campaigns', JSON.stringify(updatedCampaigns))
    return newCampaign
  }

  const donateToCampaign = (campaignId, amount, donorInfo) => {
    const updatedCampaigns = campaigns.map(campaign => {
      if (campaign.id === campaignId) {
        return {
          ...campaign,
          raised: campaign.raised + amount,
          donors: [...campaign.donors, { ...donorInfo, amount, date: new Date().toISOString() }]
        }
      }
      return campaign
    })
    setCampaigns(updatedCampaigns)
    localStorage.setItem('fundconnect_campaigns', JSON.stringify(updatedCampaigns))
  }

  const getCampaignById = (id) => {
    return campaigns.find(campaign => campaign.id === parseInt(id))
  }

  const value = {
    campaigns,
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