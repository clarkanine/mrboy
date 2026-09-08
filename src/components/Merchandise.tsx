import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

// 1. Define the item structure data interface for TypeScript
interface MerchItem {
  id: string | number;
  name: string;
  img: string;
  description: string;
  price: string;
  sizes: string | string[]; // Can handle fallback array or inbound comma string safely
  isDisplayed: string;
}

export default function Merchandise() {
  const [merchItems, setMerchItems] = useState<MerchItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // 2. Your specific Google Sheet "Merch" tab CSV URL
    const sheetCsvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSFtNoOcfIDYG3PWQBCJan3PjR-JLbuW8HHAjvR_uVc0Ru0la2opZM6S2TdDjUUdUGFMvhmrkriL9el/pub?gid=1077231365&single=true&output=csv";

    fetch(sheetCsvUrl)
      .then((res) => res.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setMerchItems(results.data as MerchItem[]);
            setLoading(false);
          },
        });
      })
      .catch((err) => {
        console.error("Error loading merchandise inventory payload:", err);
        setLoading(false);
      });
  }, []);

  // 3. Prevent rendering template loops until the data promise resolves
  if (loading) {
    return (
      <div className="window" style={{ width: '100%', maxWidth: '900px' }}>
        <div className="title-bar">
          <div className="title-bar-text" style={{fontSize: '36px'}}>MERCHANDISE.EXE</div>
        </div>
        <div className="window-body" style={{ padding: '24px', textAlign: 'center', color: '#000' }}>
          Querying remote warehouse inventory files...
        </div>
      </div>
    );
  }

  return (
    <div className="window" style={{ width: '100%', maxWidth: '900px' }}>
      <div className="title-bar">
        <div className="title-bar-text large-text">MERCHANDISE.EXE</div>
      </div>
      <div className="window-body">
        <p className="med-text" style={{ margin: '0 0 16px 0' }}>Support the band. Secure the physical goods. Available for purchase at shows, or DM us on IG and we can set something up :)</p>

        {/* --- RESPONSIVE 3-COLUMN RETRO GRID --- */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          width: '100%'
        }}>
          {merchItems.filter(i => i.isDisplayed === 'TRUE').map((item, idx) => {
            // 4. Safe String Normalization: Converts sheet "S, M, L" strings cleanly to dynamic arrays
            const cleanSizesArray = Array.isArray(item.sizes)
              ? item.sizes
              : item.sizes ? item.sizes.split(',').map(s => s.trim()) : [];

            return (
              <div
                key={item.id || idx}
                className="window"
                style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                {/* Card Window Title */}
                <div className="title-bar" style={{
                                               background: '#808080',
                                               padding: '6px 8px', // Added 6px vertical padding to expand the gray box thickness
                                               display: 'flex',
                                               alignItems: 'center'
                                             }}>
                  <div className="title-bar-text med-text">{item.name}</div>
                </div>

                {/* Card Window Content Body */}
                <div className="window-body" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, padding: '8px' }}>

                  {/* 1. IMAGE CONTAINER */}
                  <div style={{
                    background: '#000',
                    border: '2px solid #fff',
                    borderRightColor: '#808080',
                    borderBottomColor: '#808080',
                    boxShadow: 'inset 1px 1px 0px #000',
                    textAlign: 'center',
                    marginBottom: '10px',
                    lineHeight: 0
                  }}>
                    {item.img && (
                      <img
                        src={item.img}
                        alt={item.name}
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                      />
                    )}
                  </div>

                  {/* 2. DESCRIPTION */}
                  <p className="med-text" style={{ margin: '0 0 8px 0', flexGrow: 1, color: '#000' }}>
                    {item.description}
                  </p>

                  {/* 3. PRICE */}
                  <div className="status-bar" style={{ marginBottom: '8px', padding: '4px', background: '#fff', color: '#000', fontWeight: 'bold' }}>
                    <p className="status-bar-field med-text" style={{ margin: 0, boxShadow: 'none' }}>
                      Price: {item.price}
                    </p>
                  </div>

                  {/* 4. SIZES AVAILABLE */}
                  <div style={{ marginBottom: '12px' }}>
                    <span className="small-text" style={{ display: 'block', marginBottom: '4px' }}>
                      Available Sizes:
                    </span>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {cleanSizesArray.map((size, index) => (
                        <span className="small-text"
                          key={index}
                          style={{
                            background: '#e0e0e0',
                            border: '1px solid #808080',
                            padding: '2px 6px',
                            fontFamily: 'monospace',
                            color: '#000'
                          }}
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
        {/* --- END OF GRID --- */}

      </div>
    </div>
  );
}
