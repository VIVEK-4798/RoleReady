import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Subscribe = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubscribed(true);
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your Email"
        required
        style={{
          width: '100%',
          padding: '15px 120px 15px 20px',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: 'rgba(255,255,255,0.9)',
          fontSize: '15px',
          transition: 'all 0.3s ease',
          ':focus': {
            outline: 'none',
            boxShadow: '0 0 0 3px rgba(86, 147, 193, 0.5)'
          }
        }}
      />
      <button
        type="submit"
        style={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          padding: '5px 15px',
          borderRadius: '6px',
          backgroundColor: '#5693c1',
          color: 'white',
          fontWeight: '500',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          ':hover': {
            backgroundColor: '#457fa8'
          }
        }}
      >
        {isSubscribed ? '✓ Subscribed!' : 'Subscribe'}
      </button>
    </form>
  );
};
export default Subscribe;