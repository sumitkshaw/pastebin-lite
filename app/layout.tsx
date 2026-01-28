import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pastebin Lite',
  description: 'A simple pastebin-like application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ 
        margin: 0, 
        padding: 20, 
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f5f5f5'
      }}>
        <header style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          marginBottom: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ margin: 0 }}>Pastebin Lite</h1>
        </header>
        <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {children}
        </main>
      </body>
    </html>
  );
}