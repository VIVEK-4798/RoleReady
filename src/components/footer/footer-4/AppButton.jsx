import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AppButton = () => {
  const appContent = [
    {
      id: 1,
      icon: "icon-apple",
      link: "https://www.apple.com/app-store/",
      text: "Download on the",
      market: "Apple Store",
      color: '#A2AAAD'
    },
    {
      id: 2,
      icon: "icon-play-market",
      link: "https://play.google.com/store/apps/?hl=en&gl=US",
      text: "Get in on",
      market: "Google Play",
      color: '#00E676'
    },
  ];

  return (
    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
      {appContent.map((item) => (
        <a 
          key={item.id} 
          href={item.link}
          style={{
            flex: '1',
            minWidth: '180px',
            display: 'flex',
            alignItems: 'center',
            padding: '12px 20px',
            borderRadius: '8px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            transition: 'all 0.3s ease',
            textDecoration: 'none',
            ':hover': {
              backgroundColor: 'rgba(255,255,255,0.2)',
              transform: 'translateY(-3px)'
            }
          }}
        >
          <i 
            className={item.icon} 
            style={{ 
              fontSize: '24px',
              color: item.color
            }} 
          />
          <div style={{ marginLeft: '15px' }}>
            <div style={{ 
              fontSize: '12px', 
              color: 'rgba(255,255,255,0.8)',
              lineHeight: '1.2'
            }}>
              {item.text}
            </div>
            <div style={{ 
              fontSize: '14px', 
              fontWeight: '500',
              color: 'white',
              lineHeight: '1.2'
            }}>
              {item.market}
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};

export default AppButton;