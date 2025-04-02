import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <div className="welcome-page">
      <div className="hero-section">
        <div className="hero-content">
          <div className="logo-container">
            <i className="fas fa-globe-americas fa-4x logo-icon"></i>
          </div>
          <h1 className="hero-title">GeoVista</h1>
          <p className="hero-subtitle">Interactive World Explorer</p>
          <p className="hero-description">
            Embark on a journey around the world with our interactive map. Discover fascinating facts about countries,
            explore different regions, and expand your geographical knowledge.
          </p>
          <div className="hero-buttons">
            <Link href="/explore" className="primary-button">
              <i className="fas fa-compass"></i> Start Exploring
            </Link>
            <Link href="/auth/login" className="secondary-button">
              <i className="fas fa-user"></i> Sign In
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="globe-container">
            <Image
              src="/Map.jpg?height=500&width=500"
              alt="World Map"
              width={500}
              height={500}
              className="globe-image"
              priority
            />
            <div className="globe-shadow"></div>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2 className="section-title">Discover the World</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-map-marked-alt"></i>
            </div>
            <h3>Interactive Maps</h3>
            <p>Explore countries with our interactive map interface. Click on any country to learn more about it.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-info-circle"></i>
            </div>
            <h3>Detailed Information</h3>
            <p>Get comprehensive information about countries including population, capital, languages, and more.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-search"></i>
            </div>
            <h3>Easy Search</h3>
            <p>Quickly find any country with our intuitive search functionality and get instant results.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-moon"></i>
            </div>
            <h3>Dark Mode</h3>
            <p>Switch between light and dark modes for comfortable viewing in any environment.</p>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <div className="cta-content">
          <h2>Ready to explore the world?</h2>
          <p>Create an account to save your favorite countries and track your exploration progress.</p>
          <div className="cta-buttons">
            <Link href="/auth/signup" className="primary-button">
              <i className="fas fa-user-plus"></i> Sign Up Now
            </Link>
            <Link href="/explore" className="outline-button">
              <i className="fas fa-globe"></i> Explore as Guest
            </Link>
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <i className="fas fa-globe-americas logo-icon-small"></i>
            <span>GeoVista</span>
          </div>
          <div className="footer-links">
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
          <div className="footer-copyright">
            <p>© Created by Tuan Khang Phan</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

