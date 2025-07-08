import { useEffect } from "react";
import MainFilterSearchBox from "./MainFilterSearchBox";

const Index = () => {
  useEffect(() => {
    // This would be where you initialize any animation libraries
    // For example: AOS.init();
  }, []);

  return (
    <section 
      className="masthead -type-5"
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '120px 0',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        borderRadius: '0 0 20px 20px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Animated background elements */}
      <div 
        className="masthead__bg"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          opacity: 0.3
        }}
      >
        <div 
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
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
      </div>

      <div 
        className="container"
        style={{
          position: 'relative',
          zIndex: 2
        }}
      >
        <div 
          className="row w-100"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div 
            className="col-xl-9 w-50"
            style={{
              paddingRight: '40px'
            }}
          >
            <h1
              className="text-60 lg:text-40 md:text-30"
              data-aos="fade-up"
              data-aos-delay="400"
              style={{
                fontSize: '3.5rem',
                fontWeight: 700,
                lineHeight: 1.2,
                color: '#2d3748',
                marginBottom: '1.5rem',
                textShadow: '1px 1px 2px rgba(0,0,0,0.05)'
              }}
            >
              Connect and grow your {" "}
              <span
                className="text-blue-1 relative"
                style={{
                  color: "#5693c1",
                  display: 'inline-block'
                }}
              >
                Startup Network{" "}
                <span 
                  className="-line"
                  style={{
                    position: 'absolute',
                    bottom: '-10px',
                    left: 0,
                    width: '100%',
                    height: '8px',
                    background: 'linear-gradient(90deg, rgba(86,147,193,0.4) 0%, rgba(86,147,193,0.1) 100%)',
                    borderRadius: '4px',
                    zIndex: -1,
                    transform: 'scaleX(0.9)'
                  }}
                />
              </span>
            </h1>
            
            <p 
              className="mt-20" 
              data-aos="fade-up" 
              data-aos-delay="500"
              style={{
                fontSize: '1.25rem',
                lineHeight: 1.6,
                color: '#4a5568',
                marginBottom: '2.5rem',
                maxWidth: '600px'
              }}
            >
              Startups 24×7 is an Online Social Networking Platform for Startups, 
              <span style={{fontWeight: 600}}> Investors & Advisors to Freely Communicate with each other and to</span> 
              Promote their Products & Services to our Niche Audience.
              <br />
            </p>

            <div data-aos="fade-up" data-aos-delay="600">
              <button
                style={{
                  background: '#5693c1',
                  color: 'white',
                  border: 'none',
                  padding: '15px 30px',
                  borderRadius: '50px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(86, 147, 193, 0.4)',
                  marginRight: '15px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#457fa8';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(86, 147, 193, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#5693c1';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(86, 147, 193, 0.4)';
                }}
              >
                Join Now - It's Free
              </button>
              
              <button
                style={{
                  background: 'transparent',
                  color: '#5693c1',
                  border: '2px solid #5693c1',
                  padding: '15px 30px',
                  borderRadius: '50px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#5693c1';
                  e.target.style.color = 'white';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#5693c1';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Learn More
              </button>
            </div>

            {/* Uncomment when ready */}
            {/* <MainFilterSearchBox /> */}
          </div>

          <div
            className="masthead__image w-50"
            data-aos="fade-left"
            data-aos-delay="700"
            style={{
              position: 'relative',
              animation: 'float 6s ease-in-out infinite'
            }}
          >
            <img
              src="/img/masthead/5/27 - Video chatting.svg"
              alt="Startup Networking Platform"
              className="img-fluid"
              style={{
                maxWidth: '100%',
                height: 'auto',
                filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.1))',
                transition: 'transform 0.5s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            />
            
            {/* Floating animation elements */}
            <div 
              style={{
                position: 'absolute',
                top: '20%',
                left: '-30px',
                width: '60px',
                height: '60px',
                background: 'rgba(255,255,255,0.8)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                animation: 'float 4s ease-in-out infinite 1s'
              }}
            >
              <span style={{fontSize: '1.5rem'}}>🚀</span>
            </div>
            
            <div 
              style={{
                position: 'absolute',
                bottom: '15%',
                right: '-20px',
                width: '80px',
                height: '80px',
                background: 'rgba(255,255,255,0.8)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                animation: 'float 5s ease-in-out infinite 0.5s'
              }}
            >
              <span style={{fontSize: '2rem'}}>💡</span>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.3; }
          100% { transform: scale(1.1); opacity: 0.1; }
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </section>
  );
};

export default Index;