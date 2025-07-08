import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const FooterContent = () => {
  const footerDataContent = [
    {
      id: 1,
      title: "Company",
      menuList: [
        { name: "About Us", routerPath: "/about" },
        { name: "Careers", routerPath: "/careers" },
        { name: "Blog", routerPath: "/blog" },
        { name: "Press", routerPath: "/press" }
      ]
    },
    {
      id: 2,
      title: "Support",
      menuList: [
        { name: "Contact Us", routerPath: "/contact" },
        { name: "Help Center", routerPath: "/help" },
        { name: "Privacy Policy", routerPath: "/privacy" },
        { name: "Terms of Service", routerPath: "/terms" }
      ]
    },
    {
      id: 3,
      title: "Resources",
      menuList: [
        { name: "Documentation", routerPath: "/docs" },
        { name: "API Status", routerPath: "/status" },
        { name: "Guides", routerPath: "/guides" },
        { name: "Webinars", routerPath: "/webinars" }
      ]
    }
  ];

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
      {footerDataContent.map((item) => (
        <div key={item.id} style={{ minWidth: '150px' }}>
          <h5 style={{ 
            fontSize: '16px',
            fontWeight: '500',
            color: 'white',
            marginBottom: '20px',
            position: 'relative',
            display: 'inline-block',
            ':after': {
              content: '""',
              position: 'absolute',
              bottom: '-5px',
              left: 0,
              width: '40px',
              height: '2px',
              backgroundColor: '#7ab3d7'
            }
          }}>
            {item.title}
          </h5>
          <div style={{ display: 'grid', gap: '12px' }}>
            {item.menuList.map((menu, i) => (
              <Link 
                to={menu.routerPath} 
                key={i}
                style={{
                  color: 'rgba(255,255,255,0.7)',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  ':hover': {
                    color: 'white',
                    transform: 'translateX(5px)'
                  }
                }}
              >
                {menu.name}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FooterContent;