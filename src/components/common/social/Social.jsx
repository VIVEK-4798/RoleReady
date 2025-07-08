import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Social = () => {
  const socialContent = [
    { id: 1, icon: "icon-facebook", link: "https://facebook.com/", color: '#1877F2' },
    { id: 2, icon: "icon-twitter", link: "https://twitter.com/", color: '#1DA1F2' },
    { id: 3, icon: "icon-instagram", link: "https://instagram.com/", color: '#E4405F' },
    { id: 4, icon: "icon-linkedin", link: "https://linkedin.com/", color: '#0A66C2' },
  ];

  return (
    <div style={{ display: 'flex', gap: '15px' }}>
      {socialContent.map((item) => (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          key={item.id}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            ':hover': {
              backgroundColor: item.color,
              transform: 'translateY(-3px) scale(1.1)'
            }
          }}
        >
          <i 
            className={item.icon} 
            style={{ 
              fontSize: '16px',
              color: 'white'
            }} 
          />
        </a>
      ))}
    </div>
  );
};

export default Social;