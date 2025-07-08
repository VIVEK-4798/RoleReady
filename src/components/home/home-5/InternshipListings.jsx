import { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '@/utils/apiProvider';
import { Link } from 'react-router-dom';

const InternshipListings = () => {
  const [activeJob, setActiveJob] = useState(0);
  const [internships, setInternships] = useState([]);

  useEffect(() => {
const fetchInternships = async () => {
  try {
    const res = await axios.get(`${api}/api/venue/get-venue`);
    if (res.data?.results) {
      const formatted = res.data.results
        .slice(0, 5) // show only first 5
        .map((item, index) => ({
          id: item.venue_id || index + 1,
          title: item.venue_name || "Untitled Internship",
          company: item.website || "Company",
          location: item.state || "Remote",
          salary: item.stipend ? `₹${item.stipend}` : "Unpaid",
          tags: [
            item.internship_type || "General",
            item.work_detail || null,
            item.duration_months ? `${item.duration_months} Months` : null,
          ].filter(Boolean),
        }));
      setInternships(formatted);
    }
  } catch (error) {
    console.error("Failed to fetch internships:", error);
  }
};


    fetchInternships();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveJob((prev) => (prev + 1) % internships.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [internships.length]);

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
      padding: '40px',
      margin: '40px 0',
      overflow: 'hidden'
    }}>
      <h2 style={{
        fontSize: '22px',
        fontWeight: 600,
        color: '#5693c1',
        marginBottom: '20px'
      }}>
        Internships
      </h2>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        marginBottom: '30px'
      }}>
        {["Remote", "Marketing", "Tech", "Finance", "Design", "Content"].map(tag => (
          <div key={tag} style={{
            padding: '10px 15px',
            borderRadius: '6px',
            backgroundColor: 'rgba(86, 147, 193, 0.08)',
            color: '#4a5568',
            fontSize: '16px',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}>
            {tag}
          </div>
        ))}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '25px'
      }}>
        {internships.map((internship, index) => (
          <div key={internship.id} style={{
            padding: '25px',
            borderRadius: '12px',
            backgroundColor: index === activeJob ? 'rgba(86, 147, 193, 0.05)' : '#fff',
            border: index === activeJob ? '2px solid rgba(86, 147, 193, 0.2)' : '1px solid rgba(86, 147, 193, 0.1)',
            boxShadow: index === activeJob ? '0 5px 20px rgba(86, 147, 193, 0.1)' : '0 3px 10px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: index === activeJob ? 'translateY(-5px)' : 'none',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {index === activeJob && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '4px',
                width: '100%',
                background: 'linear-gradient(90deg, #5693c1 0%, #7ab3d7 100%)',
                animation: 'highlightPulse 2s infinite'
              }} />
            )}

            <div style={{ flexGrow: 1 }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '15px'
              }}>
                <div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#2d3748',
                    marginBottom: '5px'
                  }}>
                    {internship.title}
                  </h3>
                  <p style={{
                    fontSize: '15px',
                    color: '#5693c1',
                    fontWeight: 600
                  }}>
                    {internship.company}
                  </p>
                </div>
                <div style={{
                  backgroundColor: 'rgba(86, 147, 193, 0.1)',
                  color: '#5693c1',
                  fontWeight: 700,
                  padding: '5px 10px',
                  borderRadius: '20px',
                  fontSize: '14px'
                }}>
                  #{internship.id}
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '15px',
                flexWrap: 'wrap',
                marginBottom: '15px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#4a5568',
                  fontSize: '14px'
                }}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}
                    viewBox="0 0 24 24">
                    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {internship.location}
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#4a5568',
                  fontSize: '14px'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                    <path d="M6 9V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
                    <rect x="6" y="9" width="12" height="10" rx="2" />
                    <path d="M10 13h4" />
                  </svg>
                  {internship.salary}
                </div>
              </div>

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: '20px'
              }}>
                {internship.tags.map((tag, i) => (
                  <span key={i} style={{
                    padding: '5px 12px',
                    backgroundColor: 'rgba(86, 147, 193, 0.1)',
                    borderRadius: '20px',
                    fontSize: '13px',
                    color: '#4a5568',
                    maxWidth: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <Link to={`/hotel-single-v1/${internship.id}`} style={{ width: '100%' }}>
              <button
                style={{
                  background: 'transparent',
                  color: '#5693c1',
                  border: '2px solid #5693c1',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  width: '100%',
                  marginTop: 'auto'
                }}
              >
                View details
              </button>
            </Link>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes highlightPulse {
          0% { opacity: 0.8; }
          50% { opacity: 1; }
          100% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

export default InternshipListings;
