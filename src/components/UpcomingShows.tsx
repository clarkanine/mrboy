import React, { useState, useEffect } from "react";
import Papa from "papaparse";

// 1. Tell TypeScript what data fields each Google Sheet row will have
interface Gig {
  date: string;
  venue: string;
  city: string;
  status: string;
  ticketLink?: string;
  defaultImg: string;
  hoverImg: string;
  isDisplayed: boolean;
}

export default function UpcomingShows() {
  const [gigs, setGigs] = useState<Gig[]>([]);      // Explicitly typed state array
  const [loading, setLoading] = useState<boolean>(true);
  const [hoveredIndex, setHoveredIndex] = useState<number>(-1);

  useEffect(() => {
    // 2. Paste your Google Sheet "Publish to Web" CSV URL here
    const sheetCsvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSFtNoOcfIDYG3PWQBCJan3PjR-JLbuW8HHAjvR_uVc0Ru0la2opZM6S2TdDjUUdUGFMvhmrkriL9el/pub?output=csv ";

    fetch(sheetCsvUrl)
      .then((res) => res.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            // Cast the parsed rows as our Gig interface type
            setGigs(results.data as Gig[]);
            setLoading(false);
          },
        });
      })
      .catch((err) => {
        console.error("Error loading shows via SHOWS.EXE:", err);
        setLoading(false);
      });
  }, []);

  // 3. Prevent runtime errors while the network request is processing
  if (loading) {
    return (
      <div className="window" style={{ width: '100%', maxWidth: '100%' }}>
        <div className="title-bar">
          <div className="title-bar-text large-text">SHOWS.EXE - Tour Dates</div>
        </div>
        <div className="window-body" style={{ padding: '24px', textAlign: 'center', color: '#000' }}>
          Loading show database...
        </div>
      </div>
    );
  }

  // 4. Safely handle image parsing logic
  const activePoster = hoveredIndex !== -1
    ? gigs[hoveredIndex]?.hoverImg
    : gigs[0]?.defaultImg || ""; // Safe fallback string if sheet is completely empty

  return (
    <div className="window" style={{ width: '100%', maxWidth: '100%' }}>
      <div className="title-bar">
        <div className="title-bar-text large-text">SHOWS.EXE - Tour Dates</div>
      </div>
      <div className="window-body" style={{ padding: '12px' }}>

        <div style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '20px',
          alignItems: 'flex-start'
        }}>

          {/* TOUR POSTER DISPLAY FRAME */}
          <div style={{
            flex: '1 1 280px',
            maxWidth: '350px',
            margin: '0 auto',
            background: '#000',
            border: '2px solid #fff',
            borderRightColor: '#808080',
            borderBottomColor: '#808080',
            boxShadow: 'inset 1px 1px 0px #000',
            lineHeight: 0,
            padding: '4px'
          }}>
            {activePoster && (
              <img
                src={activePoster}
                alt="Band Tour Poster"
                referrerPolicy="no-referrer" /* ADD THIS LINE */
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />

            )}
          </div>

          {/* TOUR DATES TABLE */}
          <div style={{ flex: '2 1 400px', width: '100%' }}>
            <div style={{ overflowX: 'auto', width: '100%', background: '#fff' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  minWidth: '450px',
                }}
                className="interactive"
              >
                <thead>
                  <tr style={{ background: '#e0e0e0', color: '#000' }}>
                    <th style={{ textAlign: 'left', padding: '6px' }}>Date</th>
                    <th style={{ textAlign: 'left', padding: '6px' }}>Venue</th>
                    <th style={{ textAlign: 'left', padding: '6px' }}>Location</th>
                    <th style={{ textAlign: 'right', padding: '6px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {gigs.filter(g => g.isDisplayed === 'TRUE').map((gig, idx) => {
                    const isHovered = hoveredIndex === idx;

                    return (
                      <tr
                        key={idx}
                        onMouseEnter={() => setHoveredIndex(idx)}
                        onMouseLeave={() => setHoveredIndex(-1)}
                        style={{
                          borderBottom: '1px solid #e0e0e0',
                          cursor: 'pointer',
                          backgroundColor: isHovered ? '#000080' : 'transparent',
                          color: isHovered ? '#ffffff' : '#000000',
                        }}
                      >
                        <td style={{ padding: '10px 6px' }}>{gig.date}</td>
                        <td style={{ padding: '10px 6px' }}>{gig.venue}</td>
                        <td style={{ padding: '10px 6px' }}>{gig.city}</td>
                        <td style={{ padding: '10px 6px', textAlign: 'right' }}>
                          <button
                            onClick={() => gig.ticketLink && window.open(gig.ticketLink, '_blank')}
                            disabled={gig.status === 'Sold Out'}
                            style={{
                              padding: '4px 12px',
                              cursor: 'pointer',
                              border: isHovered ? '2px solid #fff' : undefined
                            }}
                          >
                            {gig.status}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Preload images securely via data-driven array maps */}
        {gigs.map((gig, idx) => (
          gig.hoverImg && <img key={idx} src={gig.hoverImg} style={{ display: 'none' }} alt="preload" />
        ))}

      </div>
    </div>
  );
}
