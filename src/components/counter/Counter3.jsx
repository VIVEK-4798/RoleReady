const Counter3 = () => {
  const blockContent = [
    {
      id: 1,
      number: "10K+",
      meta: "Openings daily",
      hasUnit: "",
      delayAnim: "100",
    },
  ];

  const companies = [
    { id: 1, name: "DECATHLON", logo: "Infosys" },
    { id: 2, name: "Amazon", logo: "Amazon" },
    { id: 3, name: "Practo", logo: "Practo" },
    { id: 4, name: "Microsoft", logo: "Microsoft" },
    { id: 5, name: "Google", logo: "Google" },
    { id: 6, name: "Uber", logo: "Uber" },
  ];

  return (
    <div 
      style={{
        backgroundColor: '#ffffff',
        padding: '60px 0',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
        marginTop: '40px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div className="container">
        <div className="row" style={{ alignItems: 'center' }}>
          {/* Counter Block */}
          <div 
            className="col-xl-3 col-12"
            style={{
              padding: '0 30px',
              borderRight: '1px solid rgba(86, 147, 193, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <div
              data-aos="fade-up"
              data-aos-delay="100"
              style={{
                textAlign: 'center'
              }}
            >
              <div 
                style={{
                  fontSize: '60px',
                  lineHeight: 1,
                  fontWeight: 700,
                  color: '#5693c1',
                  marginBottom: '10px',
                  background: 'linear-gradient(135deg, #5693c1 0%, #7ab3d7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '1px 1px 3px rgba(86, 147, 193, 0.2)'
                }}
              >
                10K+
              </div>
              <div 
                style={{
                  fontSize: '24px',
                  fontWeight: 600,
                  color: '#4a5568',
                  opacity: 0.9
                }}
              >
                Openings daily
              </div>
            </div>
          </div>

          {/* Companies Marquee */}
          <div 
            className="col-xl-9 col-12"
            style={{
              padding: '0 20px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                animation: 'scroll 30s linear infinite',
                width: 'calc(200px * 12)'
              }}
            >
              {/* Double the array to create seamless looping */}
              {[...companies, ...companies].map((company, index) => (
                <div 
                  key={`${company.id}-${index}`}
                  style={{
                    margin: '0 40px',
                    padding: '15px 30px',
                    backgroundColor: 'rgba(86, 147, 193, 0.1)',
                    borderRadius: '8px',
                    minWidth: '160px',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    transform: 'scale(0.95)',
                    opacity: 0.9
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.backgroundColor = 'rgba(86, 147, 193, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(0.95)';
                    e.currentTarget.style.opacity = '0.9';
                    e.currentTarget.style.backgroundColor = 'rgba(86, 147, 193, 0.1)';
                  }}
                >
                  <div 
                    style={{
                      fontSize: '22px',
                      fontWeight: 700,
                      color: '#2d3748',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {company.logo}
                  </div>
                </div>
              ))}
            </div>

            {/* Gradient overlays for smooth edges */}
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: '100px',
                background: 'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
                zIndex: 2
              }}
            />
            <div 
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                width: '100px',
                background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)',
                zIndex: 2
              }}
            />
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-160px * 6));
          }
        }
      `}</style>
    </div>
  );
};

export default Counter3;