async function getPaste(id: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/pastes/${id}`, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (err) {
    return null;
  }
}

export default async function PastePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const paste = await getPaste(id);

  if (!paste) {
    return (
      <div style={{ 
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '30px', 
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #f5c6cb',
        maxWidth: '600px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h2 style={{ marginBottom: '15px', color: '#721c24' }}>⚠️ Paste Unavailable</h2>
        <p style={{ marginBottom: '20px' }}>
          This paste may have expired, reached its view limit, or never existed.
        </p>
        <div style={{ 
          backgroundColor: 'white',
          padding: '15px',
          borderRadius: '5px',
          marginBottom: '20px',
          textAlign: 'left'
        }}>
          <strong>Paste ID:</strong>
          <code style={{ 
            display: 'block', 
            backgroundColor: '#f8f9fa',
            padding: '8px',
            marginTop: '5px',
            borderRadius: '3px',
            fontFamily: 'monospace'
          }}>
            {id}
          </code>
        </div>
        <a 
          href="/" 
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#0070f3',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
            fontWeight: 'bold'
          }}
        >
          ← Create New Paste
        </a>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h1>Paste Content</h1>
        <a 
          href="/" 
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px'
          }}
        >
          ← New Paste
        </a>
      </div>

      {/* Stats Bar */}
      <div style={{ 
        display: 'flex', 
        gap: '15px', 
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        <div style={{ 
          flex: 1,
          backgroundColor: 'white',
          padding: '15px',
          borderRadius: '5px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          minWidth: '150px'
        }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>PASTE ID</div>
          <code style={{ 
            backgroundColor: '#f8f9fa',
            padding: '5px 10px',
            borderRadius: '3px',
            fontFamily: 'monospace',
            fontSize: '14px'
          }}>
            {id}
          </code>
        </div>
        
        <div style={{ 
          flex: 1,
          backgroundColor: 'white',
          padding: '15px',
          borderRadius: '5px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          minWidth: '150px'
        }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>VIEWS REMAINING</div>
          <div style={{ 
            fontSize: '18px', 
            fontWeight: 'bold',
            color: paste.remaining_views === 0 ? '#dc3545' : 
                   paste.remaining_views && paste.remaining_views <= 2 ? '#ffc107' : '#28a745'
          }}>
            {paste.remaining_views === null ? '∞' : paste.remaining_views}
          </div>
        </div>
        
        <div style={{ 
          flex: 1,
          backgroundColor: 'white',
          padding: '15px',
          borderRadius: '5px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          minWidth: '150px'
        }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>EXPIRES</div>
          <div style={{ 
            fontSize: '14px', 
            fontWeight: 'bold',
            color: paste.expires_at && new Date(paste.expires_at) < new Date() ? '#dc3545' : '#6c757d'
          }}>
            {paste.expires_at ? new Date(paste.expires_at).toLocaleString() : 'Never'}
          </div>
        </div>
      </div>

      {/* Content Card */}
      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        marginBottom: '20px'
      }}>
        <div style={{ 
          padding: '20px',
          borderBottom: '1px solid #dee2e6',
          backgroundColor: '#f8f9fa',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0 }}>Content</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              id="copy-content-btn"
              style={{
                padding: '8px 16px',
                backgroundColor: '#0070f3',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Copy Content
            </button>
            <button
              id="copy-link-btn"
              style={{
                padding: '8px 16px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Copy Link
            </button>
          </div>
        </div>
        
        <pre style={{
          padding: '20px',
          margin: 0,
          fontFamily: 'monospace',
          fontSize: '14px',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          maxHeight: '60vh',
          overflowY: 'auto',
          backgroundColor: '#f8f9fa'
        }}>
          {paste.content}
        </pre>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '20px',
        flexWrap: 'wrap'
      }}>
        <div style={{ 
          flex: 1,
          backgroundColor: '#d1ecf1',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #bee5eb',
          minWidth: '250px'
        }}>
          <h4 style={{ color: '#0c5460', marginBottom: '10px' }}>About This Paste</h4>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#0c5460' }}>
            <li>Each view decrements remaining views</li>
            <li>Paste becomes unavailable when views reach 0</li>
            <li>Expired pastes are automatically deleted</li>
            <li>Data is stored in persistent database</li>
          </ul>
        </div>
        
        <div style={{ 
          flex: 1,
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #dee2e6',
          minWidth: '250px'
        }}>
          <h4 style={{ marginBottom: '10px' }}>Share This Paste</h4>
          <div style={{ display: 'flex', marginBottom: '10px' }}>
            <input
              type="text"
              readOnly
              value={`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/p/${id}`}
              style={{
                flexGrow: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '5px 0 0 5px',
                fontSize: '14px'
              }}
            />
            <button
              id="copy-url-btn"
              style={{
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '0 5px 5px 0',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Copy
            </button>
          </div>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('DOMContentLoaded', function() {
            // Copy content button
            document.getElementById('copy-content-btn')?.addEventListener('click', function() {
              navigator.clipboard.writeText(\`${paste.content.replace(/`/g, '\\`')}\`);
              this.textContent = 'Copied!';
              this.style.backgroundColor = '#28a745';
              setTimeout(() => {
                this.textContent = 'Copy Content';
                this.style.backgroundColor = '#0070f3';
              }, 2000);
            });
            
            // Copy link button
            document.getElementById('copy-link-btn')?.addEventListener('click', function() {
              navigator.clipboard.writeText(window.location.href);
              this.textContent = 'Copied!';
              this.style.backgroundColor = '#28a745';
              setTimeout(() => {
                this.textContent = 'Copy Link';
                this.style.backgroundColor = '#6c757d';
              }, 2000);
            });
            
            // Copy URL button
            document.getElementById('copy-url-btn')?.addEventListener('click', function() {
              const url = \`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/p/${id}\`;
              navigator.clipboard.writeText(url);
              this.textContent = 'Copied!';
              this.style.backgroundColor = '#28a745';
              setTimeout(() => {
                this.textContent = 'Copy';
                this.style.backgroundColor = '#28a745';
              }, 2000);
            });
          });
        `
      }} />
    </div>
  );
}