
export default function About() {
  return (
    <div className="window" style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
      <div className="title-bar">
        <div className="title-bar-text large-text">About.EXE</div>
      </div>
      <div className="window-body">
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: '16px',
            alignItems: 'flex-start',
            padding: '8px 0',
          }}
        >
          {/* PHOTO FRAME */}
          <div
            style={{
              flex: '1 1 200px',
              maxWidth: '220px',
              margin: '0 auto',
              background: '#000',
              border: '2px solid #fff',
              borderRightColor: '#808080',
              borderBottomColor: '#808080',
              boxShadow: 'inset 1px 1px 0px #000',
              lineHeight: 0,
              padding: '4px',
            }}
          >
            <img
              src="/bandPhotos/denim-family.jpg"
              alt="Artist"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          {/* BLURB */}
          <div style={{ flex: '2 1 200px', minWidth: '0' }}>
            <p className='small-text' style={{ margin: 0 }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
              in reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
