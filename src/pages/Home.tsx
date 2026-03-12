import React from "react"
import { Link } from "react-router-dom"

const Home = () => {
  return (
    <div style={{ fontFamily: "Arial", minHeight: "100vh", background: "#f0f4f8" }}>

      {/* Header */}
      <header style={{
        background: "#1a2a4a",
        color: "white",
        padding: "20px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src="/afm-logo.png" alt="AFM Logo" style={{ width: 40 }} />
          <h2>Apostolic Faith Mission</h2>
        </div>

        <Link to="/login" style={{
          background: "#f0a500",
          padding: "10px 16px",
          borderRadius: "6px",
          textDecoration: "none",
          color: "black",
          fontWeight: "bold"
        }}>
          Staff Login
        </Link>
      </header>

      {/* Hero */}
      <section style={{ textAlign: "center", padding: "80px 20px" }}>
        <h1 style={{ fontSize: "40px", color: "#1a2a4a" }}>
          Welcome to AFM Church
        </h1>
        <p style={{ color: "#6b7280", fontSize: "18px" }}>
          A place of worship, faith, and community.
        </p>
      </section>

      {/* Services */}
      <section style={{ padding: "40px", textAlign: "center" }}>
        <h2 style={{ color: "#1a2a4a" }}>Service Times</h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "20px",
          marginTop: "30px"
        }}>

          <div style={{ background: "white", padding: "20px", borderRadius: "10px" }}>
            <h3>Sunday Service</h3>
            <p>09:00 AM</p>
          </div>

          <div style={{ background: "white", padding: "20px", borderRadius: "10px" }}>
            <h3>Bible Study</h3>
            <p>Wednesday 18:00</p>
          </div>

          <div style={{ background: "white", padding: "20px", borderRadius: "10px" }}>
            <h3>Prayer Meeting</h3>
            <p>Friday 17:30</p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: "#1a2a4a",
        color: "white",
        padding: "30px",
        textAlign: "center"
      }}>
        © {new Date().getFullYear()} Apostolic Faith Mission
      </footer>

    </div>
  )
}

export default Home