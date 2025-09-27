import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCampaigns } from '../context/CampaignContext'

const validationSchema = Yup.object({
  title: Yup.string().required('Campaign title is required'),
  description: Yup.string().min(10, 'Description must be at least 10 characters').required('Description is required'),
  goal: Yup.number().positive('Goal must be a positive number').required('Funding goal is required'),
  category: Yup.string().required('Category is required')
})

const CreateCampaign = () => {
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

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    if (!user) {
      setStatus('You must be logged in to create a campaign')
      setSubmitting(false)
      return
    }

    const campaignData = {
      title: values.title,
      description: values.description,
      goal: parseFloat(values.goal),
      category: values.category
    }

    try {
      await addCampaign(campaignData)
      navigate('/')
    } catch (err) {
      setStatus(`Failed to create campaign: ${err.message}`)
    } finally {
      setSubmitting(false)
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

        <Formik
          initialValues={{
            title: '',
            description: '',
            goal: '',
            category: 'entrepreneurship'
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, status }) => (
            <Form className="campaign-form">
              {status && <div className="error-message">{status}</div>}
              
              <div className="form-group">
                <label htmlFor="title">Campaign Title *</label>
                <Field
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Enter a compelling title for your campaign"
                />
                <ErrorMessage name="title" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <Field as="select" id="category" name="category">
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="category" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="goal">Funding Goal ($) *</label>
                <Field
                  type="number"
                  id="goal"
                  name="goal"
                  placeholder="Enter your funding goal"
                  min="1"
                  step="0.01"
                />
                <ErrorMessage name="goal" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  placeholder="Describe your campaign, what you're raising funds for, and how the money will be used"
                  rows="6"
                />
                <ErrorMessage name="description" component="div" className="error-message" />
              </div>

              <button type="submit" className="btn btn-primary btn-full" disabled={isSubmitting}>
                {isSubmitting ? 'Creating Campaign...' : 'Create Campaign'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default CreateCampaign