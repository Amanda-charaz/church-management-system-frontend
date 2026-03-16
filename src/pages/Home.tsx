import React, { useEffect, useState } from 'react'
import API from '../api/axios'
import { useNavigate } from 'react-router-dom'

interface Announcement {
  id: string
  title: string
  content: string
  createdAt: string
}

const Home = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [verse, setVerse] = useState<{ text: string; reference: string } | null>(null)
  const [visitorForm, setVisitorForm] = useState({ firstName: '', lastName: '', email: '', phone: '' })
  const [submitted, setSubmitted] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [events, setEvents] = useState<any[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchAnnouncements()
    fetchVerse()
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const res = await API.get('/events')
      setEvents(res.data.events || [])
    } catch (err) {
      console.error('Error fetching events:', err)
    }
  }

  const fetchAnnouncements = async () => {
    try {
      const res = await API.get('/announcements')
      setAnnouncements(res.data.announcements || [])
    } catch (err) {
      console.error('Error fetching announcements:', err)
    }
  }

  const fetchVerse = async () => {
    try {
      const res = await API.get('/verse')
      setVerse(res.data.verse)
    } catch (err) {
      console.error('Error fetching verse:', err)
    }
  }

  const handleVisitorSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await API.post('/visitors', visitorForm)
      setSubmitted(true)
      setVisitorForm({ firstName: '', lastName: '', email: '', phone: '' })
    } catch (err) {
      console.error('Error submitting visitor form:', err)
    }
  }

  const scrollTo = (id: string) => {
    setActiveSection(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: '#fffaf5', minHeight: '100vh' }}>

      {/* NAV */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: 'rgba(255,255,255,0.97)',
          boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
          padding: '0 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '70px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src="/afm-logo.png"
            alt="AFM"
            style={{ height: '45px' }}
            onError={(e: any) => (e.target.style.display = 'none')}
          />

          <div>
            <div
              style={{
                fontWeight: 'bold',
                fontSize: '16px',
                color: '#1a2a4a',
                letterSpacing: '1px'
              }}
            >
              APOSTOLIC FAITH MISSION
            </div>

            <div
              style={{
                fontSize: '11px',
                color: '#e67e22',
                letterSpacing: '2px'
              }}
            >
              ZIMBABWE
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {['home', 'about', 'events', 'announcements', 'services', 'visit'].map(section => (
            <button
              key={section}
              onClick={() => scrollTo(section)}
              style={{
                border: 'none',
                cursor: 'pointer',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                color: activeSection === section ? 'white' : '#1a2a4a',
                background: activeSection === section ? '#e67e22' : 'transparent',
                fontWeight: activeSection === section ? 'bold' : 'normal',
                textTransform: 'capitalize',
                transition: 'all 0.2s'
              }}
            >
              {section === 'visit'
                ? 'Plan a Visit'
                : section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}

          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '8px 20px',
              background: '#1a2a4a',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              marginLeft: '8px'
            }}
          >
            Staff Login
          </button>

          <button
            onClick={() => navigate('/join-church')}
            style={{
              padding: '8px 20px',
              background: '#e67e22',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              marginLeft: '8px'
            }}
          >
            Join Church
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section
        id="home"
        style={{
          marginTop: '70px',
          background: 'linear-gradient(135deg, #1a2a4a 0%, #2d4a7a 40%, #e67e22 100%)',
          minHeight: '90vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          padding: '60px 40px'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)'
          }}
        />

        <div
          style={{
            position: 'absolute',
            bottom: '-150px',
            left: '-100px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'rgba(230,126,34,0.15)'
          }}
        />

        <div
          style={{
            textAlign: 'center',
            color: 'white',
            position: 'relative',
            zIndex: 1,
            maxWidth: '800px'
          }}
        >
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>✝️</div>

          <h1
            style={{
              fontSize: '52px',
              fontWeight: 'bold',
              margin: '0 0 8px',
              letterSpacing: '3px',
              lineHeight: 1.1
            }}
          >
            APOSTOLIC FAITH
            <br />
            <span style={{ color: '#f0a500' }}>MISSION</span>
          </h1>

          <p
            style={{
              fontSize: '18px',
              color: '#aac4e0',
              marginBottom: '40px',
              letterSpacing: '3px'
            }}
          >
            WELCOME TO OUR CHURCH FAMILY
          </p>

          {verse && (
            <div
              style={{
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px 32px',
                marginBottom: '40px',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
            >
              <div
                style={{
                  fontSize: '13px',
                  color: '#f0a500',
                  marginBottom: '8px',
                  letterSpacing: '2px'
                }}
              >
                📖 DAILY VERSE
              </div>

              <p
                style={{
                  fontStyle: 'italic',
                  fontSize: '18px',
                  margin: '0 0 8px',
                  lineHeight: 1.6
                }}
              >
                "{verse.text}"
              </p>

              <p style={{ color: '#f0a500', margin: 0, fontWeight: 'bold' }}>
                — {verse.reference}
              </p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => scrollTo('visit')}
              style={{
                padding: '16px 32px',
                background: '#e67e22',
                color: 'white',
                border: 'none',
                borderRadius: '30px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                letterSpacing: '1px'
              }}
            >
              Plan Your Visit 🙏
            </button>

            <button
              onClick={() => scrollTo('announcements')}
              style={{
                padding: '16px 32px',
                background: 'transparent',
                color: 'white',
                border: '2px solid white',
                borderRadius: '30px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              View Announcements
            </button>

            <button
              onClick={() => navigate('/prayer-request')}
              style={{
                padding: '16px 32px',
                background: 'transparent',
                color: '#f0a500',
                border: '2px solid #f0a500',
                borderRadius: '30px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              🙏 Prayer Request
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#1a2a4a', color: 'white', padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>✝️</div>
        <div style={{ fontWeight: 'bold', fontSize: '18px', letterSpacing: '2px', marginBottom: '4px' }}>
          APOSTOLIC FAITH MISSION
        </div>
        <div style={{ color: '#aac4e0', marginBottom: '16px' }}>
          Spreading the Gospel of Jesus Christ
        </div>
        <div style={{ color: '#666', fontSize: '13px' }}>
          © {new Date().getFullYear()} Apostolic Faith Mission. All rights reserved.
        </div>
      </footer>

    </div>
  )
}

export default Home