import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { api } from '@/utils/apiProvider';

const JobListings = () => {
  const [activeJob, setActiveJob] = useState(0);
  const [jobListings, setJobListings] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${api}/api/vendor/get-vendors`);
        
        if (res.data?.results) {
          const formatted = res.data.results.map((item, index) => ({
            id: item.service_reg_id || index + 1,
            title: item.vendor_name || "Untitled Job",
            company: item.vendor_address || "Company",
            location: item.city_name || "Unknown Location",
            salary: item.job_salary ? `₹${item.job_salary} / month` : "₹0 / month",
            tags: [
              item.job_type || "General",
              item.work_detail ? `${item.work_detail} Months` : null,
              item.website || null
            ].filter(Boolean),
          }));
          setJobListings(formatted);
        }
      } catch (error) {
        console.error("Failed to fetch job listings:", error);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveJob((prev) => (prev + 1) % jobListings.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [jobListings.length]);

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
      padding: '40px',
      margin: '40px 0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <h1 style={{
        fontSize: '32px',
        fontWeight: 700,
        color: '#2d3748',
        marginBottom: '30px',
        position: 'relative',
        paddingBottom: '15px'
      }}>
        What are you looking for today?
        <span style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '80px',
          height: '4px',
          background: 'linear-gradient(90deg, #5693c1 0%, #7ab3d7 100%)',
          borderRadius: '2px'
        }} />
      </h1>

      <div style={{ marginBottom: '30px' }}>
        <h2 style={{
          fontSize: '22px',
          fontWeight: 600,
          color: '#5693c1',
          marginBottom: '15px'
        }}>
          Fresher Jobs
        </h2>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          {["Work from home", "Part-time", "MBA", "Engineering", "Media", "Design", "Data Science"].map((tag) => (
            <div
              key={tag}
              style={{
                padding: '10px 15px',
                borderRadius: '6px',
                backgroundColor: 'rgba(86, 147, 193, 0.08)',
                color: '#4a5568',
                fontSize: '16px',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '25px'
      }}>
        {jobListings.map((job, index) => (
          <div
            key={job.id}
            style={{
              padding: '25px',
              borderRadius: '12px',
              backgroundColor: index === activeJob ? 'rgba(86, 147, 193, 0.05)' : '#fff',
              border: index === activeJob ? '2px solid rgba(86, 147, 193, 0.2)' : '1px solid rgba(86, 147, 193, 0.1)',
              boxShadow: index === activeJob ? '0 5px 20px rgba(86, 147, 193, 0.1)' : '0 3px 10px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: index === activeJob ? 'translateY(-5px)' : 'none',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}
          >
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
                    {job.title}
                  </h3>
                  <p style={{
                    fontSize: '15px',
                    color: '#5693c1',
                    fontWeight: 600,
                    marginBottom: '5px'
                  }}>
                    {job.company}
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
                  #{job.id}
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
                  {job.location}
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#4a5568',
                  fontSize: '14px'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                    <path d="M2 7h20v10H2z" />
                    <path d="M16 3H4a2 2 0 0 0-2 2v2" />
                    <circle cx="18" cy="12" r="1" />
                  </svg>
                  {job.salary}
                </div>
              </div>

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: '20px'
              }}>
                {job.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      padding: '5px 12px',
                      backgroundColor: 'rgba(86, 147, 193, 0.1)',
                      borderRadius: '20px',
                      fontSize: '13px',
                      color: '#4a5568',
                      maxWidth: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* ✅ Link just around the button */}
            <Link to={`/tour-single/${job.id}`} style={{ width: '100%' }}>
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

export default JobListings;
