import React, { useState } from 'react';

// ---------------------------------------------------------------------------
// SETUP: Get these two values from your Google Form's "Get pre-filled link"
// (Form menu -> ⋮ -> Get pre-filled link -> fill a test email -> Get link).
// The URL will look like:
//   https://docs.google.com/forms/d/e/1FAIpQLSc.../viewform?usp=pp_url&entry.123456789=test%40example.com
// FORM_ID is the long string after "/d/e/".
// EMAIL_ENTRY_ID is the "entry.123456789" part (numbers only, no "entry.").
// ---------------------------------------------------------------------------
const FORM_ID = '1FAIpQLSeElI3fXRmu-K_9-1pUJTsNS7hK973s5DRfExqWw_iYjx90mA';
const EMAIL_ENTRY_ID = '658337695';

const FORM_ACTION_URL = `https://docs.google.com/forms/d/e/${FORM_ID}/formResponse`;

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('submitting');

    // Google Forms' response endpoint doesn't allow reading the response
    // (opaque, no-cors), so we submit via a hidden iframe and just assume
    // success once the request has gone out — there's no reliable way to
    // confirm it landed from the browser side.
    const body = new URLSearchParams();
    body.append(`entry.${EMAIL_ENTRY_ID}`, email);

    fetch(FORM_ACTION_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    })
      .catch(() => {
        // no-cors responses are opaque, so this only fires on a real
        // network-level failure (offline, blocked, etc.), not on
        // Google-side validation errors.
      })
      .finally(() => {
        setStatus('done');
        setEmail('');
      });
  };

  return (
    <div className="window" style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
      <div className="title-bar">
        <div className="title-bar-text large-text">NEWSLETTER.EXE</div>
      </div>
      <div className="window-body" style={{ padding: '16px' }}>
        {status === 'done' ? (
          <p className="med-text" style={{ margin: 0 }}>
            You're on the list. Thanks for signing up!
          </p>
        ) : (
          <>
            <p className="med-text" style={{ margin: '0 0 12px 0' }}>
              Get updates on shows, releases, and merch drops.
            </p>
            <form
              onSubmit={handleSubmit}
              style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                style={{ flex: '1 1 180px', padding: '4px 6px' }}
              />
              <button type="submit" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Submitting...' : 'Sign Up'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
