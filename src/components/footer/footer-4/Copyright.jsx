import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Copyright = () => {
  const [currentYear] = useState(new Date().getFullYear());

  return (
    <div style={{ 
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '20px',
      padding: '20px 0',
      borderTop: '1px solid rgba(255,255,255,0.15)'
    }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ 
          color: 'rgba(255,255,255,0.8)',
          fontSize: '14px'
        }}>
          © {currentYear} All Rights Reserved | Made with ❤️ by Psyber Inc
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <a 
            href="#" 
            style={{
              color: 'rgba(255,255,255,0.8)',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              ':hover': {
                color: 'white',
                textDecoration: 'underline'
              }
            }}
          >
            Privacy
          </a>
          <a 
            href="#" 
            style={{
              color: 'rgba(255,255,255,0.8)',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              ':hover': {
                color: 'white',
                textDecoration: 'underline'
              }
            }}
          >
            Terms
          </a>
          <a 
            href="#" 
            style={{
              color: 'rgba(255,255,255,0.8)',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              ':hover': {
                color: 'white',
                textDecoration: 'underline'
              }
            }}
          >
            Site Map
          </a>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.8)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          ':hover': {
            color: 'white'
          }
        }}>
          <i className="icon-globe" style={{ marginRight: '8px' }} />
          English (US)
        </button>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.8)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          ':hover': {
            color: 'white'
          }
        }}>
          <i className="icon-usd" style={{ marginRight: '8px' }} />
          USD
        </button>
      </div>
    </div>
  );
};
export default Copyright;