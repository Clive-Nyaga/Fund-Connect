import { createContext, useContext, useState, useEffect } from 'react'

const CampaignContext = createContext()

export const useCampaigns = () => {
  const context = useContext(CampaignContext)
  if (!context) {
    throw new Error('useCampaigns must be used within a CampaignProvider')
  }
  return context
}

const sampleCampaigns = [
  {
    id: 1,
    title: "EcoTech Startup: Solar-Powered Water Purifiers",
    description: "We're developing affordable solar-powered water purification systems for rural communities. Our innovative technology combines solar energy with advanced filtration to provide clean drinking water where it's needed most. Help us bring clean water to 10,000 families in our first year.",
    goal: 50000,
    raised: 32500,
    category: "entrepreneurship",
    creatorId: 1001,
    creatorName: "Sarah Chen",
    createdAt: "2024-01-15T10:00:00Z",
    donors: [
      { id: 2001, name: "Michael Rodriguez", email: "michael@email.com", amount: 500, date: "2024-01-20T14:30:00Z" },
      { id: 2002, name: "Emma Thompson", email: "emma@email.com", amount: 250, date: "2024-01-22T09:15:00Z" },
      { id: 2003, name: "David Kim", email: "david@email.com", amount: 1000, date: "2024-01-25T16:45:00Z" },
      { id: 2004, name: "Lisa Johnson", email: "lisa@email.com", amount: 100, date: "2024-01-28T11:20:00Z" }
    ]
  },
  {
    id: 2,
    title: "Community Learning Center for Underprivileged Kids",
    description: "Building a safe space where children from low-income families can access free tutoring, computer skills training, and after-school programs. Our goal is to bridge the educational gap and provide equal opportunities for all children in our community.",
    goal: 25000,
    raised: 18750,
    category: "education",
    creatorId: 1002,
    creatorName: "Marcus Williams",
    createdAt: "2024-01-10T08:00:00Z",
    donors: [
      { id: 2005, name: "Jennifer Davis", email: "jennifer@email.com", amount: 300, date: "2024-01-12T13:00:00Z" },
      { id: 2006, name: "Robert Brown", email: "robert@email.com", amount: 150, date: "2024-01-15T10:30:00Z" },
      { id: 2007, name: "Amanda Wilson", email: "amanda@email.com", amount: 500, date: "2024-01-18T15:45:00Z" }
    ]
  },
  {
    id: 3,
    title: "Mobile Health Clinic for Rural Areas",
    description: "Launching a mobile health clinic to provide basic medical care, health screenings, and preventive services to underserved rural communities. Our equipped van will visit remote areas monthly, bringing healthcare directly to those who need it most.",
    goal: 75000,
    raised: 45000,
    category: "healthcare",
    creatorId: 1003,
    creatorName: "Dr. Priya Patel",
    createdAt: "2024-01-05T12:00:00Z",
    donors: [
      { id: 2008, name: "James Miller", email: "james@email.com", amount: 1500, date: "2024-01-08T09:00:00Z" },
      { id: 2009, name: "Maria Garcia", email: "maria@email.com", amount: 750, date: "2024-01-12T14:20:00Z" },
      { id: 2010, name: "Kevin Lee", email: "kevin@email.com", amount: 200, date: "2024-01-16T11:10:00Z" }
    ]
  }
]

export const CampaignProvider = ({ children }) => {
  const [campaigns, setCampaigns] = useState([])

  useEffect(() => {
    const savedCampaigns = localStorage.getItem('fundconnect_campaigns')
    if (savedCampaigns) {
      setCampaigns(JSON.parse(savedCampaigns))
    } else {
      // Initialize with sample campaigns if no saved data
      setCampaigns(sampleCampaigns)
      localStorage.setItem('fundconnect_campaigns', JSON.stringify(sampleCampaigns))
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