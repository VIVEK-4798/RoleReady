const WhyChooseUs = () => {
  const expertContent = [
    {
      id: 1,
      icon: "/img/featureIcons/1/1.svg",
      title: "Check Your Eligibility",
      text: `A startup must meet certain criteria to be considered eligible for DPIIT Recognition.`,
    },
    {
      id: 2,
      icon: "/img/featureIcons/1/2.svg",
      title: "Get Recognised",
      text: `Click here to know more about the recognition process & apply as a Startup.`,
    },
    {
      id: 3,
      icon: "/img/featureIcons/1/3.svg",
      title: "Notifications",
      text: `Stay on top of Recognition & Tax Exemption updates.`,
    },
    {
      id: 4,
      icon: "/img/featureIcons/1/3.svg",
      title: "Validate Certificate",
      text: `Click here to verify your Recognition/Tax Exemption certificates.`,
    },
  ];

  return (
    <div style={{
      position: 'relative',
      backgroundColor: '#f8f9ff',
      padding: '80px 0',
      overflow: 'hidden'
    }}>
      {/* Right side image with decorative elements */}
      <div style={{
        position: 'absolute',
        right: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        width: '40%',
        height: '100%',
        backgroundImage: 'linear-gradient(135deg, rgba(13,110,253,0.1) 0%, rgba(255,255,255,0) 50%)',
        borderRadius: '30px 0 0 30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px'
      }}>
        <img 
          src="/img/masthead/11/dpiitimg.png" 
          alt="DPIIT Recognition" 
          style={{
            maxWidth: '100%',
            height: 'auto',
            borderRadius: '20px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            border: '1px solid rgba(255,255,255,0.3)'
          }}
        />
        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(13,110,253,0.1) 0%, rgba(255,255,255,0) 70%)',
          right: '-100px',
          top: '-100px',
          zIndex: -1
        }}></div>
        <div style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(220,53,69,0.1) 0%, rgba(255,255,255,0) 70%)',
          left: '-50px',
          bottom: '-50px',
          zIndex: -1
        }}></div>
      </div>

      {/* Main content container */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          width: '55%',
          paddingRight: '40px'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#0d6efd',
            marginBottom: '20px',
            lineHeight: 1.2,
            position: 'relative',
            display: 'inline-block'
          }}>
            DPIIT Recognition
            <span style={{
              position: 'absolute',
              bottom: '-10px',
              left: 0,
              width: '80px',
              height: '4px',
              background: 'linear-gradient(90deg, #0d6efd, #6f42c1)',
              borderRadius: '2px'
            }}></span>
          </h2>
          <p style={{
            fontSize: '1.1rem',
            color: '#495057',
            lineHeight: 1.6,
            marginBottom: '40px',
            maxWidth: '500px'
          }}>
            Support Network for Indian Startups
          </p>

          {/* Features grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '30px',
            marginTop: '60px'
          }}>
            {expertContent.map((item) => (
              <div 
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  padding: '25px',
                  backgroundColor: 'white',
                  borderRadius: '15px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease',
                  borderLeft: '4px solid #0d6efd',
                  ':hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  minWidth: '60px',
                  backgroundColor: 'rgba(13,110,253,0.1)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '20px'
                }}>
                  <img 
                    src={item.icon} 
                    alt={item.title} 
                    style={{
                      width: '30px',
                      height: '30px'
                    }} 
                  />
                </div>
                <div>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: '#212529',
                    marginBottom: '10px'
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    fontSize: '1rem',
                    color: '#6c757d',
                    lineHeight: 1.6,
                    margin: 0
                  }}>
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust badges (optional) */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '30px',
        marginTop: '80px',
        flexWrap: 'wrap'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '15px 25px',
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
        }}>
          <span style={{
            fontWeight: 600,
            color: '#212529',
            marginLeft: '10px'
          }}>Government Recognized</span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '15px 25px',
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
        }}>
          <span style={{
            fontWeight: 600,
            color: '#212529',
            marginLeft: '10px'
          }}>100% Secure Process</span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '15px 25px',
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
        }}>
          <span style={{
            fontWeight: 600,
            color: '#212529',
            marginLeft: '10px'
          }}>Trusted by 10,000+ Startups</span>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;