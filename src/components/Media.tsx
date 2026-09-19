import { useState, useEffect } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import Papa from 'papaparse';

const LINKS = {
  spotify: 'https://open.spotify.com/artist/70Z7SWeDPYM31HVXu1w4Aj',
  instagram: 'https://www.instagram.com/mr.boy_pdx/?hl=en',
  appleMusic: 'https://music.apple.com/us/album/something-to-say/1724257121?i=1724257125',
};

const YOUTUBE_VIDEO_ID = 'qMV-MejTizk';

// Published CSV for the "Photos" tab of the Google Sheet.
// Same published sheet as Merchandise.tsx, but with the gid of the Photos tab.
const PHOTOS_GID = '1223639188';
const PHOTOS_CSV_URL = `https://docs.google.com/spreadsheets/d/e/2PACX-1vSFtNoOcfIDYG3PWQBCJan3PjR-JLbuW8HHAjvR_uVc0Ru0la2opZM6S2TdDjUUdUGFMvhmrkriL9el/pub?gid=${PHOTOS_GID}&single=true&output=csv`;

// Sheet columns: id | img | caption | isDisplayed
interface PhotoItem {
  id?: string | number;
  img: string;
  caption?: string;
  isDisplayed: string;
}

type LoadState = 'loading' | 'ready' | 'error';

type TabId = 'photos' | 'videos';

const TABS: { id: TabId; label: string }[] = [
  { id: 'photos', label: 'Photos' },
  { id: 'videos', label: 'Videos' },
];

// Sunken bevel used around the video and photo thumbnails
const sunkenFrame: CSSProperties = {
  border: '2px solid #808080',
  borderRightColor: '#fff',
  borderBottomColor: '#fff',
  background: '#000',
};

// Classic Win95 tab look, styled inline so it doesn't depend on the CSS framework's tab rules
const tablistStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'flex-start',
  padding: '0 4px',
  marginBottom: '-2px',
  position: 'relative',
  zIndex: 2,
};

const tabStyle = (selected: boolean): CSSProperties => ({
  position: 'relative',
  zIndex: selected ? 3 : 1,
  padding: selected ? '5px 16px 4px' : '3px 16px',
  marginBottom: selected ? 0 : '2px',
  marginLeft: selected ? '-2px' : 0,
  marginRight: selected ? '-2px' : 0,
  background: '#c0c0c0',
  borderTop: '2px solid #fff',
  borderLeft: '2px solid #fff',
  borderRight: '2px solid #404040',
  borderBottom: 'none',
  borderRadius: '3px 3px 0 0',
  boxShadow: 'inset -1px 0 #808080, inset 1px 1px #dfdfdf',
  cursor: 'default',
  userSelect: 'none',
});

const panelStyle: CSSProperties = {
  position: 'relative',
  zIndex: 1,
  background: '#c0c0c0',
  padding: '8px',
  borderTop: '2px solid #fff',
  borderLeft: '2px solid #fff',
  borderRight: '2px solid #404040',
  borderBottom: '2px solid #404040',
  boxShadow: 'inset -1px -1px #808080, inset 1px 1px #dfdfdf',
};

function SpotifyIcon() {
  return (
    <svg viewBox="0 0 24 24" width="40" height="40" fill="#1DB954">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141 4.322-1.32 9.662-.66 13.38 1.62.36.181.54.78.36 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.72-.18-.6.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="40" height="40">
      <defs>
        <linearGradient id="igGradientMedia" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFDC80" />
          <stop offset="25%" stopColor="#FCAF45" />
          <stop offset="50%" stopColor="#E1306C" />
          <stop offset="75%" stopColor="#C13584" />
          <stop offset="100%" stopColor="#833AB4" />
        </linearGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#igGradientMedia)" />
      <rect x="6" y="6" width="12" height="12" rx="3.5" fill="none" stroke="#fff" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="3.2" fill="none" stroke="#fff" strokeWidth="1.6" />
      <circle cx="16.2" cy="7.8" r="0.9" fill="#fff" />
    </svg>
  );
}

function AppleMusicIcon() {
  return (
    <svg viewBox="0 0 24 24" width="40" height="40">
      <defs>
        <linearGradient id="amGradientMedia" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FA5D75" />
          <stop offset="100%" stopColor="#FC3C44" />
        </linearGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#amGradientMedia)" />
      <path
        fill="#fff"
        d="M16.5 6.2v7.6c0 .95-.62 1.55-1.6 1.75l-1.02.2c-.72.14-1.23.63-1.23 1.32 0 .78.66 1.31 1.53 1.31 1.05 0 1.87-.66 1.87-1.98V9.85l-4.6.94v5.9c0 .95-.62 1.55-1.6 1.75l-1.02.2c-.72.14-1.23.63-1.23 1.32 0 .78.66 1.31 1.53 1.31 1.05 0 1.87-.66 1.87-1.98V8.3c0-.42.2-.66.62-.75l4.36-.88c.4-.08.62.13.62.53z"
      />
    </svg>
  );
}

interface LogoLinkProps {
  href: string;
  label: string;
  children: ReactNode;
}

function LogoLink({ href, label, children }: LogoLinkProps) {
  return (
    <button
      type="button"
      title={label}
      onClick={() => window.open(href, '_blank', 'noopener,noreferrer')}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '56px',
        height: '56px',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}

interface PhotosPanelProps {
  photos: PhotoItem[];
  status: LoadState;
}

function PhotosPanel({ photos, status }: PhotosPanelProps) {
  if (status === 'loading') {
    return (
      <p style={{ margin: 0, textAlign: 'center' }}>
        Developing photos...
      </p>
    );
  }

  if (status === 'error') {
    return (
      <p style={{ margin: 0, textAlign: 'center' }}>
        Couldn&apos;t load photos. Refresh the page to try again.
      </p>
    );
  }

  if (photos.length === 0) {
    return (
      <p style={{ margin: 0, textAlign: 'center' }}>
        Photos are still developing in the darkroom.
      </p>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: '12px',
      }}
    >
      {photos.map((photo, idx) => (
        <div key={photo.id || idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <a
            href={photo.img}
            target="_blank"
            rel="noopener noreferrer"
            title={photo.caption}
            style={{ ...sunkenFrame, display: 'block', aspectRatio: '1 / 1', overflow: 'hidden' }}
          >
            <img
              src={photo.img}
              alt={photo.caption || 'Photo'}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </a>
          {photo.caption && (
            <p
              className="small-text"
              style={{ margin: 0, textAlign: 'center', color: '#000', overflowWrap: 'anywhere' }}
            >
              {photo.caption}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function VideosPanel() {
  return (
    <div
      style={{
        ...sunkenFrame,
        position: 'relative',
        width: '100%',
        paddingBottom: '56.25%', // 16:9 aspect ratio
        height: 0,
      }}
    >
      <iframe
        src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}`}
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 'none',
        }}
      />
    </div>
  );
}

export default function Media() {
  const [activeTab, setActiveTab] = useState<TabId>('photos');
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [photosStatus, setPhotosStatus] = useState<LoadState>('loading');

  // Fetch once when Media mounts (not when the Photos tab opens), so switching tabs never refetches.
  useEffect(() => {
    let cancelled = false;

    fetch(PHOTOS_CSV_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((csvText) => {
        Papa.parse<PhotoItem>(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (cancelled) return;
            const visible = results.data.filter(
              (p) => p.img && p.isDisplayed?.trim().toUpperCase() === 'TRUE'
            ).reverse();
            setPhotos(visible);
            setPhotosStatus('ready');
          },
        });
      })
      .catch((err) => {
        console.error('Error loading photos from sheet:', err);
        if (!cancelled) setPhotosStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="window" style={{ width: '100%' }}>
      <div className="title-bar">
        <div className="title-bar-text large-text">Media.EXE</div>
      </div>
      <div className="window-body">

        {/* PLATFORM LOGO LINKS */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            padding: '12px 0 16px 0',
          }}
        >
          <LogoLink href={LINKS.spotify} label="Listen on Spotify">
            <SpotifyIcon />
          </LogoLink>
          <LogoLink href={LINKS.instagram} label="Follow on Instagram">
            <InstagramIcon />
          </LogoLink>
          <LogoLink href={LINKS.appleMusic} label="Listen on Apple Music">
            <AppleMusicIcon />
          </LogoLink>
        </div>

        {/* TABS */}
        <style>{`.media-tab:focus-visible { outline: 1px dotted #000; outline-offset: -6px; }`}</style>
        <div role="tablist" aria-label="Media" style={tablistStyle}>
          {TABS.map((tab) => (
            <div
              key={tab.id}
              role="tab"
              className="media-tab"
              id={`media-tab-${tab.id}`}
              aria-selected={activeTab === tab.id}
              aria-controls="media-panel"
              tabIndex={activeTab === tab.id ? 0 : -1}
              style={tabStyle(activeTab === tab.id)}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveTab(tab.id);
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                  e.preventDefault();
                  setActiveTab(tab.id === 'photos' ? 'videos' : 'photos');
                }
              }}
            >
              {tab.label}
            </div>
          ))}
        </div>

        <div
          role="tabpanel"
          id="media-panel"
          aria-labelledby={`media-tab-${activeTab}`}
          style={panelStyle}
        >
          {activeTab === 'photos' ? (
            <PhotosPanel photos={photos} status={photosStatus} />
          ) : (
            <VideosPanel />
          )}
        </div>

      </div>
    </div>
  );
}