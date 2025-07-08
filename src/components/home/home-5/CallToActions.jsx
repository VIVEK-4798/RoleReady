import { useState, useEffect } from 'react';

const CallToActions = () => {
  const [activeText, setActiveText] = useState(0);
  const phrases = ["Empower career with", "Boost your skills with", "Achieve more with"];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveText((prev) => (prev + 1) % phrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [phrases.length]);

  return (
    <section 
      style={{
        padding: '80px 0',
        background: 'linear-gradient(135deg, #f5f9fc 0%, #e1ecf4 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Animated background elements */}
      <div 
        style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(86,147,193,0.1) 0%, rgba(86,147,193,0) 70%)',
          animation: 'pulse 8s infinite alternate'
        }}
      />
      <div 
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '10%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(86,147,193,0.1) 0%, rgba(86,147,193,0) 70%)',
          animation: 'pulse 6s infinite alternate 2s'
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <h2 
            style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              lineHeight: 1.2,
              color: '#2d3748',
              marginBottom: '1.5rem',
              maxWidth: '800px'
            }}
          >
            <span 
              style={{
                display: 'inline-block',
                width: '380px',
                textAlign: 'left',
                verticalAlign: 'middle',
                height: '60px',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              {phrases.map((phrase, index) => (
                <span
                  key={index}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    opacity: index === activeText ? 1 : 0,
                    transform: `translateY(${index === activeText ? 0 : '20px'})`,
                    transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {phrase}
                </span>
              ))}
            </span>
            <span 
              style={{
                color: '#5693c1',
                display: 'inline-block',
                position: 'relative',
                marginLeft: '10px'
              }}
            >
              Startups24X7
              <span 
                style={{
                  position: 'absolute',
                  bottom: '-5px',
                  left: 0,
                  width: '100%',
                  height: '3px',
                  background: 'linear-gradient(90deg, rgba(86,147,193,0.4) 0%, rgba(86,147,193,0.1) 100%)',
                  borderRadius: '2px'
                }}
              />
            </span>
          </h2>

          <p 
            style={{
              color: '#4a5568',
              fontSize: '1rem',
              marginBottom: '2.5rem',
              maxWidth: '600px'
            }}
          >
            By continuing, you agree to our T&C.
          </p>

          <div 
            style={{
              display: 'flex',
              gap: '20px',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}
          >
            <button
              style={{
                background: '#5693c1',
                color: 'white',
                border: 'none',
                padding: '18px 40px',
                borderRadius: '50px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(86, 147, 193, 0.4)',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#457fa8';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(86, 147, 193, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#5693c1';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(86, 147, 193, 0.4)';
              }}
            >
              Sign In
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                style={{ marginLeft: '8px', transition: 'transform 0.3s ease' }}
              >
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
              <span 
                style={{
                  position: 'absolute',
                  top: '-50%',
                  left: '-50%',
                  width: '200%',
                  height: '200%',
                  background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)',
                  transform: 'translateX(-100%) rotate(30deg)',
                  transition: 'transform 0.6s ease'
                }}
              />
            </button>

            <button
              style={{
                background: 'transparent',
                color: '#5693c1',
                border: '2px solid #5693c1',
                padding: '18px 40px',
                borderRadius: '50px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(86, 147, 193, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Register
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                style={{ marginLeft: '8px', transition: 'transform 0.3s ease' }}
              >
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.3; }
          100% { transform: scale(1.1); opacity: 0.1; }
        }
        
        button:hover svg {
          transform: translateX(3px);
        }
        
        button:hover span {
          transform: translateX(100%) rotate(30deg);
        }
      `}</style>
    </section>
  );
};

export default CallToActions;