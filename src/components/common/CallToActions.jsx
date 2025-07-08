const CallToActions = () => {
  return (
    <section style={{
      padding: '60px 0',
      background: 'linear-gradient(135deg, #13357B 0%, #0f172a 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative elements */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-50%',
        width: '100%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
        transform: 'rotate(30deg)',
        zIndex: 1
      }}></div>
      
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '30px'
        }}>
          {/* Left Content */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              fontSize: '50px',
              color: '#4f46e5'
            }}>
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            <div>
              <h4 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#ffffff',
                margin: '0 0 8px 0',
                lineHeight: '1.3'
              }}>
                Your Journey Starts Here
              </h4>
              <p style={{
                fontSize: '16px',
                color: 'rgba(255,255,255,0.8)',
                margin: '0',
                lineHeight: '1.5'
              }}>
                Sign up to get the best internship opportunities delivered to you
              </p>
            </div>
          </div>
          
          {/* Right Form */}
          <div style={{
            display: 'flex',
            gap: '15px',
            flexWrap: 'wrap',
            minWidth: '300px',
            maxWidth: '450px',
            width: '100%'
          }}>
            <input
              style={{
                flex: '1',
                minWidth: '200px',
                height: '60px',
                padding: '0 20px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '16px',
                backgroundColor: '#ffffff',
                outline: 'none',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease'
              }}
              type="email"
              placeholder="Your Email"
            />
            
            <button
              style={{
                padding: '0 30px',
                height: '60px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                color: '#ffffff',
                backgroundColor: '#4f46e5',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
                transition: 'all 0.3s ease',
                ':hover': {
                  backgroundColor: '#4338ca',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(79, 70, 229, 0.4)'
                }
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#4338ca';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(79, 70, 229, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#4f46e5';
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.3)';
              }}
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActions;