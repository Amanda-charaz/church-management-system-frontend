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
  const [verse, setVerse] = useState<any>(null)
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
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: 'rgba(255,255,255,0.97)',
        boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
        padding: '0 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '70px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/afm-logo.png" alt="AFM" style={{ height: '45px' }} onError={(e: any) => e.target.style.display = 'none'} />
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#1a2a4a', letterSpacing: '1px' }}>APOSTOLIC FAITH MISSION</div>
            <div style={{ fontSize: '11px', color: '#e67e22', letterSpacing: '2px' }}>ZIMBABWE</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {['home', 'about', 'events', 'announcements', 'services', 'visit'].map(section => (
            <button key={section} onClick={() => scrollTo(section)} style={{
              border: 'none', cursor: 'pointer',
              padding: '8px 16px', borderRadius: '20px', fontSize: '14px',
              color: activeSection === section ? 'white' : '#1a2a4a',
              background: activeSection === section ? '#e67e22' : 'transparent',
              fontWeight: activeSection === section ? 'bold' : 'normal',
              textTransform: 'capitalize', transition: 'all 0.2s'
            }}>{section === 'visit' ? 'Plan a Visit' : section.charAt(0).toUpperCase() + section.slice(1)}</button>
          ))}
          <button onClick={() => navigate('/login')} style={{
            padding: '8px 20px', background: '#1a2a4a', color: 'white',
            border: 'none', borderRadius: '20px', cursor: 'pointer',
            fontSize: '14px', fontWeight: 'bold', marginLeft: '8px'
          }}>Staff Login</button>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" style={{
        marginTop: '70px',
        background: 'linear-gradient(135deg, #1a2a4a 0%, #2d4a7a 40%, #e67e22 100%)',
        minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden', padding: '60px 40px'
      }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: '-150px', left: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(230,126,34,0.15)' }} />
        <div style={{ textAlign: 'center', color: 'white', position: 'relative', zIndex: 1, maxWidth: '800px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>✝️</div>
          <h1 style={{ fontSize: '52px', fontWeight: 'bold', margin: '0 0 8px', letterSpacing: '3px', lineHeight: 1.1 }}>
            APOSTOLIC FAITH<br />
            <span style={{ color: '#f0a500' }}>MISSION</span>
          </h1>
          <p style={{ fontSize: '18px', color: '#aac4e0', marginBottom: '40px', letterSpacing: '3px' }}>
            WELCOME TO OUR CHURCH FAMILY
          </p>
          {verse && (
            <div style={{
              background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
              borderRadius: '16px', padding: '24px 32px', marginBottom: '40px',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <div style={{ fontSize: '13px', color: '#f0a500', marginBottom: '8px', letterSpacing: '2px' }}>📖 DAILY VERSE</div>
              <p style={{ fontStyle: 'italic', fontSize: '18px', margin: '0 0 8px', lineHeight: 1.6 }}>"{verse.text}"</p>
              <p style={{ color: '#f0a500', margin: 0, fontWeight: 'bold' }}>— {verse.reference}</p>
            </div>
          )}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => scrollTo('visit')} style={{
              padding: '16px 32px', background: '#e67e22', color: 'white',
              border: 'none', borderRadius: '30px', cursor: 'pointer',
              fontSize: '16px', fontWeight: 'bold', letterSpacing: '1px'
            }}>Plan Your Visit 🙏</button>
            <button onClick={() => scrollTo('announcements')} style={{
              padding: '16px 32px', background: 'transparent', color: 'white',
              border: '2px solid white', borderRadius: '30px', cursor: 'pointer',
              fontSize: '16px', fontWeight: 'bold'
            }}>View Announcements</button>
            <button onClick={() => navigate('/prayer-request')} style={{
              padding: '16px 32px', background: 'transparent', color: '#f0a500',
              border: '2px solid #f0a500', borderRadius: '30px', cursor: 'pointer',
              fontSize: '16px', fontWeight: 'bold'
            }}>🙏 Prayer Request</button>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding: '80px 40px', background: 'white' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{ color: '#e67e22', fontSize: '13px', letterSpacing: '3px', marginBottom: '8px' }}>WHO WE ARE</div>
            <h2 style={{ fontSize: '40px', color: '#1a2a4a', margin: 0 }}>About Our Church</h2>
            <div style={{ width: '60px', height: '4px', background: '#e67e22', margin: '16px auto 0', borderRadius: '2px' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            {[
              { icon: '🙏', title: 'Our Mission', text: 'To evangelise the world, plant churches, and make disciples of all nations through the power of the Holy Spirit as commanded by our Lord Jesus Christ.' },
              { icon: '👁️', title: 'Our Vision', text: 'A Spirit-filled church transforming Zimbabwe and beyond — reaching every community with the Gospel and raising up a holy generation for God.' },
              { icon: '❤️', title: 'Our Values', text: 'Founded in Zimbabwe, AFM stands on the foundation of Holiness, Prayer, Evangelism, Fellowship and the Word of God as our guiding pillars.' }
            ].map((item, i) => (
              <div key={i} style={{
                background: '#fffaf5', borderRadius: '16px', padding: '32px',
                textAlign: 'center', border: '1px solid #ffe0c0',
                boxShadow: '0 4px 20px rgba(230,126,34,0.08)'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>{item.icon}</div>
                <h3 style={{ color: '#1a2a4a', fontSize: '22px', marginBottom: '12px' }}>{item.title}</h3>
                <p style={{ color: '#666', lineHeight: 1.7, margin: 0 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section id="events" style={{ padding: '80px 40px', background: '#fffaf5' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{ color: '#e67e22', fontSize: '13px', letterSpacing: '3px', marginBottom: '8px' }}>WHAT'S COMING</div>
            <h2 style={{ fontSize: '40px', color: '#1a2a4a', margin: 0 }}>Upcoming Events</h2>
            <div style={{ width: '60px', height: '4px', background: '#e67e22', margin: '16px auto 0', borderRadius: '2px' }} />
          </div>
          {events.filter(e => new Date(e.date) >= new Date()).length === 0 ? (
            <div style={{ textAlign: 'center', color: '#999', padding: '40px' }}>No upcoming events at the moment.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
              {events.filter(e => new Date(e.date) >= new Date()).map((event, i) => (
                <div key={event.id} style={{
                  background: 'white', borderRadius: '16px', padding: '28px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                  borderLeft: `4px solid ${i % 2 === 0 ? '#e67e22' : '#1a2a4a'}`
                }}>
                  <h3 style={{ color: '#1a2a4a', fontSize: '20px', margin: '0 0 12px' }}>{event.title}</h3>
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span style={{ color: '#e67e22', fontSize: '14px', fontWeight: 'bold' }}>
                      📅 {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    {event.time && <span style={{ color: '#6b7280', fontSize: '14px' }}>🕐 {event.time}</span>}
                    {event.location && <span style={{ color: '#6b7280', fontSize: '14px' }}>📍 {event.location}</span>}
                  </div>
                  {event.description && <p style={{ color: '#666', lineHeight: 1.7, margin: 0 }}>{event.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SERVICE TIMES */}
      <section id="services" style={{ padding: '80px 40px', background: 'linear-gradient(135deg, #1a2a4a, #2d4a7a)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ color: '#f0a500', fontSize: '13px', letterSpacing: '3px', marginBottom: '8px' }}>JOIN US</div>
          <h2 style={{ fontSize: '40px', color: 'white', marginBottom: '48px' }}>Service Times</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {[
              { day: 'Sunday', time: '09:00 AM', service: 'Morning Service', icon: '☀️' },
              { day: 'Wednesday', time: '06:00 PM', service: 'Bible Study', icon: '📖' },
              { day: 'Friday', time: '06:00 PM', service: 'Prayer Meeting', icon: '🙏' }
            ].map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '16px', padding: '32px', border: '1px solid rgba(255,255,255,0.2)' }}>
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>{s.icon}</div>
                <div style={{ color: '#f0a500', fontWeight: 'bold', fontSize: '18px', marginBottom: '8px' }}>{s.day}</div>
                <div style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>{s.time}</div>
                <div style={{ color: '#aac4e0' }}>{s.service}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ANNOUNCEMENTS */}
      <section id="announcements" style={{ padding: '80px 40px', background: 'white' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{ color: '#e67e22', fontSize: '13px', letterSpacing: '3px', marginBottom: '8px' }}>LATEST NEWS</div>
            <h2 style={{ fontSize: '40px', color: '#1a2a4a', margin: 0 }}>Announcements</h2>
            <div style={{ width: '60px', height: '4px', background: '#e67e22', margin: '16px auto 0', borderRadius: '2px' }} />
          </div>
          {announcements.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#999', padding: '40px' }}>No announcements at the moment.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
              {announcements.slice(0, 4).map((a, i) => (
                <div key={a.id} style={{
                  background: '#fffaf5', borderRadius: '16px', padding: '28px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                  borderLeft: `4px solid ${i % 2 === 0 ? '#e67e22' : '#1a2a4a'}`
                }}>
                  <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>
                    📅 {new Date(a.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <h3 style={{ color: '#1a2a4a', fontSize: '20px', margin: '0 0 12px' }}>{a.title}</h3>
                  <p style={{ color: '#666', lineHeight: 1.7, margin: 0 }}>{a.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* VISITOR REGISTRATION */}
      <section id="visit" style={{ padding: '80px 40px', background: '#fffaf5' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ color: '#e67e22', fontSize: '13px', letterSpacing: '3px', marginBottom: '8px' }}>FIRST TIME?</div>
            <h2 style={{ fontSize: '40px', color: '#1a2a4a', margin: 0 }}>Plan Your Visit</h2>
            <div style={{ width: '60px', height: '4px', background: '#e67e22', margin: '16px auto 0', borderRadius: '2px' }} />
            <p style={{ color: '#666', marginTop: '16px' }}>We'd love to meet you! Fill in your details and we'll be in touch.</p>
          </div>
          {submitted ? (
            <div style={{ background: 'linear-gradient(135deg, #1a2a4a, #2d4a7a)', borderRadius: '16px', padding: '48px', textAlign: 'center', color: 'white' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
              <h3 style={{ fontSize: '24px', marginBottom: '12px' }}>Thank you for registering!</h3>
              <p style={{ color: '#aac4e0' }}>We look forward to welcoming you to our church family. God bless you!</p>
              <button onClick={() => setSubmitted(false)} style={{ marginTop: '24px', padding: '12px 24px', background: '#e67e22', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Register Another</button>
            </div>
          ) : (
            <div style={{ background: 'white', borderRadius: '16px', padding: '40px', boxShadow: '0 4px 30px rgba(230,126,34,0.1)', border: '1px solid #ffe0c0' }}>
              <form onSubmit={handleVisitorSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px', fontWeight: 'bold' }}>First Name *</label>
                    <input type="text" required value={visitorForm.firstName}
                      onChange={e => setVisitorForm({ ...visitorForm, firstName: e.target.value })}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px', fontWeight: 'bold' }}>Last Name *</label>
                    <input type="text" required value={visitorForm.lastName}
                      onChange={e => setVisitorForm({ ...visitorForm, lastName: e.target.value })}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' }} />
                  </div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px', fontWeight: 'bold' }}>Email</label>
                  <input type="email" value={visitorForm.email}
                    onChange={e => setVisitorForm({ ...visitorForm, email: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px', fontWeight: 'bold' }}>Phone</label>
                  <input type="tel" value={visitorForm.phone}
                    onChange={e => setVisitorForm({ ...visitorForm, phone: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
                <button type="submit" style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #e67e22, #f0a500)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', letterSpacing: '1px' }}>Register as Visitor 🙏</button>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#1a2a4a', color: 'white', padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>✝️</div>
        <div style={{ fontWeight: 'bold', fontSize: '18px', letterSpacing: '2px', marginBottom: '4px' }}>APOSTOLIC FAITH MISSION</div>
        <div style={{ color: '#aac4e0', marginBottom: '16px' }}>Spreading the Gospel of Jesus Christ</div>
        <div style={{ color: '#666', fontSize: '13px' }}>© {new Date().getFullYear()} Apostolic Faith Mission. All rights reserved.</div>
      </footer>

    </div>
  )
}

export default Home