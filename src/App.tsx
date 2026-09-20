import { useState } from 'react';
import UpcomingShows from './components/UpcomingShows';
import Merchandise from './components/Merchandise';
import Media from './components/Media';
import About from './components/About';
import MailingList from './components/MailingList';
import BlinkableImage from './components/BlinkableImage';

type PageView = 'shows' | 'merch' | 'media' | 'about' | 'mailing-list';

function App() {
  const [currentView, setCurrentView] = useState<PageView>('shows');

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#008080',
      display: 'flex',
      flexDirection: 'column',
      padding: '12px',
      boxSizing: 'border-box'
    }}>
      {/* BRAND LOGO BANNER (Always stays above the sticky menu) */}
      <div>
        <button disabled
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                padding: '20px 0',
                marginBottom: '10px'
              }}>
          <img
            src="/bannerPhotos/mrboylogo.png"
            alt="Mr. Boy"
            style={{
              display: 'block',
              width: 'clamp(160px, 60vw, 400px)',
              height: 'auto',
              margin: '0 auto',
            }}
          />
          </button>
      <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: '20px 0',
        marginBottom: '10px'
      }}>
        <div className="sunken-frame"
          style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '33%%',
                }}>
            <BlinkableImage
              originalSrc="/bannerPhotos/aaron_cartoon.png"
              blinkSrc="/bannerPhotos/aaron_cartoon_blink.png"
              bgColor="#eb7a34"
              altText=""
            />
        </div>
        <div className="sunken-frame"
          style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '33%%',
                }}>
            <BlinkableImage
              originalSrc="/bannerPhotos/bri_cartoon.png"
              blinkSrc="/bannerPhotos/bri_cartoon_blink.png"
              bgColor="#eb7a34"
              altText=""
            />
        </div>
        <div className="sunken-frame"

          style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '33%%',
                }}>
            <BlinkableImage
              originalSrc="/bannerPhotos/chloe_cartoon.png"
              blinkSrc="/bannerPhotos/chloe_cartoon_blink.png"
              bgColor="#eb7a34"
              altText=""
            />
        </div>
      </div>
      </div>

      {/* 1. TOP NAV MENUBAR: Locked to the top of the viewport when scrolling */}
      <header className="window" style={{
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        padding: '6px',
        marginBottom: '20px',
        zIndex: 9999, /* Guarantees it floats over everything else */
        borderRadius: 0
      }}>
        <button
          className={`status-bar-field ${currentView === 'shows' ? 'active' : ''}`}
          style={{ flexGrow: 1, textAlign: 'center', padding: '6px 12px', cursor: 'pointer' }}
          onClick={() => setCurrentView('shows')}
        >
          📅 Shows
        </button>
        <button
          className={`status-bar-field ${currentView === 'merch' ? 'active' : ''}`}
          style={{ flexGrow: 1, textAlign: 'center', padding: '6px 12px', cursor: 'pointer' }}
          onClick={() => setCurrentView('merch')}
        >
          💿 Merch
        </button>
        <button
          className={`status-bar-field ${currentView === 'media' ? 'active' : ''}`}
          style={{ flexGrow: 1, textAlign: 'center', padding: '6px 12px', cursor: 'pointer' }}
          onClick={() => setCurrentView('media')}
        >
          🔊 Media
        </button>
        <button
          className={`status-bar-field ${currentView === 'about' ? 'active' : ''}`}
          style={{ flexGrow: 1, textAlign: 'center', padding: '6px 12px', cursor: 'pointer' }}
          onClick={() => setCurrentView('about')}
        >
          💾 About
        </button>
        <button
              className={`status-bar-field ${currentView === 'mailing-list' ? 'active' : ''}`} // Fix: Corrected active class check
              style={{ flexGrow: 1, textAlign: 'center', padding: '6px 12px', cursor: 'pointer' }}
              onClick={() => setCurrentView('mailing-list')}
        >
          📰 Newsletter
        </button>
      </header>

      {/* 2. MAIN DISPLAY CONTENT: Flows naturally beneath the navbar */}
      <main style={{
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '100%'
      }}>
        {currentView === 'shows' && <UpcomingShows />}
        {currentView === 'merch' && <Merchandise />}
        {currentView === 'media' && <Media />}
        {currentView === 'about' && <About />}
        {currentView === 'mailing-list' && <MailingList />}
      </main>

      {/* FOOTER */}
      <footer className="window" style={{
        marginTop: '20px',
        padding: '8px',
        textAlign: 'center',
        borderRadius: 0
      }}>
        <span className="med-text" style={{ color: '#000' }}>
          Contact: <a href="mailto:contact@mrboy.org">contact@mrboy.org</a>
        </span>
      </footer>

    </div>
  );

}

export default App;
