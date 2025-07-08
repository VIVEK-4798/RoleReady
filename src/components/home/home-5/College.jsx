import React from 'react';
import { Link } from 'react-router-dom';

const College = () => {
  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '80px 20px',
      fontFamily: '"Inter", sans-serif',
      backgroundColor: '#ffffff'
    }}>
      {/* Hero Section */}
      <div style={{
        textAlign: 'center',
        marginBottom: '80px',
        animation: 'fadeIn 0.8s ease-out'
      }}>
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: '800',
          color: '#1a365d',
          marginBottom: '20px',
          lineHeight: '1.2',
          background: 'linear-gradient(90deg, #3182ce, #63b3ed)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'inline-block'
        }}>
          College Registration Contest
        </h2>
        <p style={{
          fontSize: '1.25rem',
          color: '#4a5568',
          maxWidth: '700px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Unlock exclusive benefits for your college by registering today and give your students a competitive edge!
        </p>
      </div>

      {/* Benefits Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '40px',
        marginBottom: '80px'
      }}>
        {[
          {
            icon: '/img/icons/dashboard.svg',
            title: 'Personalized College Dashboard',
            description: 'Monitor your students\' internship activity with real-time analytics and insights through our comprehensive dashboard.',
            color: '#3182ce'
          },
          {
            icon: '/img/icons/student.svg',
            title: 'Free Student Registration',
            description: 'All your students receive free premium accounts when you register your college with us.',
            color: '#38a169'
          },
          {
            icon: '/img/icons/opportunities.png',
            title: 'Boost Student Opportunities',
            description: 'Help your students secure better internships and job offers through our extensive network of recruiters.',
            color: '#d53f8c'
          }
        ].map((benefit, index) => (
          <div 
            key={index}
            style={{
              backgroundColor: '#f8fafc',
              borderRadius: '16px',
              padding: '40px 30px',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
              ':hover': {
                transform: 'translateY(-10px)',
                boxShadow: '0 15px 30px rgba(0,0,0,0.1)'
              }
            }}
          >
            <div style={{
              width: '100px',
              height: '100px',
              backgroundColor: `${benefit.color}10`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 25px',
              transition: 'all 0.3s ease'
            }}>
              <img 
                src={benefit.icon} 
                alt={benefit.title} 
                style={{ 
                  width: '50px', 
                  height: '50px',
                  filter: `drop-shadow(0 4px 6px ${benefit.color}40)`
                }} 
              />
            </div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#2d3748',
              marginBottom: '15px'
            }}>
              {benefit.title}
            </h3>
            <p style={{
              fontSize: '1rem',
              color: '#718096',
              lineHeight: '1.6'
            }}>
              {benefit.description}
            </p>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        backgroundColor: '#ebf8ff',
        borderRadius: '16px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(49,130,206,0.1) 0%, rgba(49,130,206,0) 70%)',
          zIndex: 0
        }} />
        <div style={{
          position: 'relative',
          zIndex: 1
        }}>
          <h3 style={{
            fontSize: '1.75rem',
            fontWeight: '700',
            color: '#2b6cb0',
            marginBottom: '20px'
          }}>
            Ready to transform your students' careers?
          </h3>
          <p style={{
            fontSize: '1.125rem',
            color: '#4a5568',
            maxWidth: '600px',
            margin: '0 auto 30px',
            lineHeight: '1.6'
          }}>
            Register your college today and unlock premium benefits for your placement cell and students.
          </p>
          <Link
            to="/collegeTPO"
            style={{
              display: 'inline-block',
              backgroundColor: '#3182ce',
              color: '#ffffff',
              padding: '16px 40px',
              fontWeight: '600',
              fontSize: '1rem',
              borderRadius: '8px',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 6px rgba(49,130,206,0.3)',
              ':hover': {
                backgroundColor: '#2c5282',
                transform: 'translateY(-3px)',
                boxShadow: '0 6px 12px rgba(49,130,206,0.4)'
              }
            }}
          >
            Register Your College Now
          </Link>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default College;