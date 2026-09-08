import { useState } from 'react';
import UpcomingShows from './components/UpcomingShows';
import Merchandise from './components/Merchandise';
import Media from './components/Media';
import About from './components/About';
import MailingList from './components/MailingList';

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

      {/* RETRO UNDER CONSTRUCTION BANNER */}
      <div style={{
        background: 'repeating-linear-gradient(45deg, #fdd835, #fdd835 10px, #212121 10px, #212121 20px)',
        padding: '6px',
        marginBottom: '15px',
        boxShadow: 'inset -1px -1px #ffffff, inset 1px 1px #0a0a0a, inset -2px -2px #dfdfdf, inset 2px 2px #808080',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <div style={{
          backgroundColor: '#dfdfdf',
          padding: '8px 20px',
          fontFamily: '"MS Sans Serif", Geneva, sans-serif',
          fontSize: '13px',
          fontWeight: 'bold',
          color: '#000000',
          border: '2px solid #808080',
          boxShadow: '1px 1px 0px #fff',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          letterSpacing: '0.5px'
        }}>
          <span>🚧</span>
          <span style={{ textTransform: 'uppercase' }}>
            ⚠️ SITE UNDER CONSTRUCTION • PLEASE PARDON OUR DUST ⚠️
          </span>
          <span>🚧</span>
        </div>
      </div>

      {/* BRAND LOGO BANNER (Always stays above the sticky menu) */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: '20px 0',
        marginBottom: '10px'
      }}>
        <img
          src="/bandPhotos/attentionBanner.jpg" // Put your logo file in your /public folder and link it here
          alt="Band Logo"
          style={{
            maxWidth: '100%',    // Controls the maximum width of the banner
            width: '100%',
            height: 'auto',
            imageRendering: 'pixelated' // Optional: Gives your logo sharp pixelated retro styling if it's pixel art!
          }}
        />
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

    </div>
  );

}

export default App;
