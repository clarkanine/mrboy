import { useState } from 'react';
import UpcomingShows from './components/UpcomingShows';
import Merchandise from './components/Merchandise';
import Media from './components/Media';
import About from './components/About';
import MailingList from './components/MailingList';

type PageView = 'shows' | 'merch' | 'media' | 'about';

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
              className={`status-bar-field ${currentView === 'about' ? 'active' : ''}`}
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
