'use client';

import { useState } from 'react';

export default function Home() {
  const [content, setContent] = useState('');
  const [ttlSeconds, setTtlSeconds] = useState('');
  const [maxViews, setMaxViews] = useState('');
  const [createdPaste, setCreatedPaste] = useState<{id: string, url: string} | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCreatedPaste(null);
    setLoading(true);

    const pasteData: any = {
      content: content.trim(),
    };

    if (ttlSeconds.trim()) {
      const ttl = parseInt(ttlSeconds, 10);
      if (!isNaN(ttl) && ttl > 0) {
        pasteData.ttl_seconds = ttl;
      }
    }

    if (maxViews.trim()) {
      const max = parseInt(maxViews, 10);
      if (!isNaN(max) && max > 0) {
        pasteData.max_views = max;
      }
    }

    try {
      const response = await fetch('/api/pastes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pasteData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create paste');
        return;
      }

      setCreatedPaste(data);
      setContent('');
      setTtlSeconds('');
      setMaxViews('');
    } catch (err) {
      setError('Failed to create paste. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2>Create and Share Text Pastes</h2>
        <p>Create pastes with optional expiration (TTL) and view limits</p>
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div style={{ 
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginBottom: '20px' }}>Create New Paste</h3>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Content *
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste your text here..."
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '16px',
                    fontFamily: 'monospace',
                    minHeight: '200px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Time to Live (seconds)
                  </label>
                  <input
                    type="number"
                    value={ttlSeconds}
                    onChange={(e) => setTtlSeconds(e.target.value)}
                    placeholder="e.g., 60"
                    min="1"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      fontSize: '16px'
                    }}
                  />
                  <small style={{ color: '#666', fontSize: '0.85rem', display: 'block', marginTop: '5px' }}>
                    Optional. Paste expires after X seconds
                  </small>
                </div>

                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Maximum Views
                  </label>
                  <input
                    type="number"
                    value={maxViews}
                    onChange={(e) => setMaxViews(e.target.value)}
                    placeholder="e.g., 5"
                    min="1"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      fontSize: '16px'
                    }}
                  />
                  <small style={{ color: '#666', fontSize: '0.85rem', display: 'block', marginTop: '5px' }}>
                    Optional. Max views before paste becomes unavailable
                  </small>
                </div>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: loading || !content.trim() ? '#ccc' : '#0070f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '16px',
                  cursor: loading || !content.trim() ? 'not-allowed' : 'pointer'
                }}
                disabled={loading || !content.trim()}
              >
                {loading ? 'Creating...' : 'Create Paste'}
              </button>
            </form>

            {error && (
              <div style={{ 
                backgroundColor: '#f8d7da',
                color: '#721c24',
                padding: '16px',
                borderRadius: '5px',
                marginTop: '20px',
                border: '1px solid #f5c6cb'
              }}>
                <strong>Error:</strong> {error}
              </div>
            )}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: '300px' }}>
          {createdPaste ? (
            <div style={{ 
              backgroundColor: '#d4edda',
              color: '#155724',
              padding: '20px', 
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #c3e6cb'
            }}>
              <h3 style={{ marginBottom: '20px' }}>✓ Paste Created Successfully!</h3>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Paste ID:
                </label>
                <div style={{ display: 'flex' }}>
                  <code style={{ 
                    flexGrow: 1, 
                    backgroundColor: 'white',
                    padding: '8px',
                    borderRadius: '5px',
                    fontFamily: 'monospace',
                    border: '1px solid #28a745'
                  }}>
                    {createdPaste.id}
                  </code>
                  <button
                    onClick={() => navigator.clipboard.writeText(createdPaste.id)}
                    style={{
                      marginLeft: '8px',
                      padding: '8px 16px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Shareable URL:
                </label>
                <div style={{ display: 'flex' }}>
                  <input
                    type="text"
                    readOnly
                    value={createdPaste.url}
                    style={{
                      flexGrow: 1,
                      padding: '8px',
                      border: '1px solid #28a745',
                      borderRadius: '5px',
                      backgroundColor: 'white'
                    }}
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(createdPaste.url)}
                    style={{
                      marginLeft: '8px',
                      padding: '8px 16px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    Copy
                  </button>
                </div>
              </div>

              <a 
                href={createdPaste.url}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '12px',
                  backgroundColor: '#0070f3',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '5px',
                  marginBottom: '10px',
                  fontWeight: 'bold'
                }}
              >
                🔗 View Paste
              </a>
              
              <button
                onClick={() => setCreatedPaste(null)}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Create Another Paste
              </button>
            </div>
          ) : (
            <div style={{ 
              backgroundColor: 'white', 
              padding: '20px', 
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ marginBottom: '15px' }}>How to Use</h3>
              <ol style={{ marginBottom: '20px', paddingLeft: '20px' }}>
                <li style={{ marginBottom: '8px' }}>Enter text in the content area (required)</li>
                <li style={{ marginBottom: '8px' }}>Optionally set expiration time (TTL) or view limits</li>
                <li style={{ marginBottom: '8px' }}>Click "Create Paste" to generate shareable link</li>
                <li style={{ marginBottom: '8px' }}>Share the link - each view counts toward the limit</li>
              </ol>
              
              <div style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '15px', 
                borderRadius: '5px',
                marginBottom: '15px',
                borderLeft: '4px solid #0070f3'
              }}>
                <h4 style={{ marginBottom: '10px', color: '#0070f3' }}>API Endpoints</h4>
                <div style={{ marginBottom: '10px' }}>
                  <code style={{ 
                    backgroundColor: '#e9ecef', 
                    padding: '4px 8px', 
                    borderRadius: '3px',
                    display: 'block',
                    marginBottom: '5px'
                  }}>
                    POST /api/pastes
                  </code>
                  <small style={{ color: '#666', display: 'block', marginLeft: '10px' }}>
                    Create a new paste with optional constraints
                  </small>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <code style={{ 
                    backgroundColor: '#e9ecef', 
                    padding: '4px 8px', 
                    borderRadius: '3px',
                    display: 'block',
                    marginBottom: '5px'
                  }}>
                    GET /api/pastes/:id
                  </code>
                  <small style={{ color: '#666', display: 'block', marginLeft: '10px' }}>
                    Retrieve paste (JSON) - counts as a view
                  </small>
                </div>
                <div>
                  <code style={{ 
                    backgroundColor: '#e9ecef', 
                    padding: '4px 8px', 
                    borderRadius: '3px',
                    display: 'block',
                    marginBottom: '5px'
                  }}>
                    GET /p/:id
                  </code>
                  <small style={{ color: '#666', display: 'block', marginLeft: '10px' }}>
                    View paste (HTML) - counts as a view
                  </small>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}