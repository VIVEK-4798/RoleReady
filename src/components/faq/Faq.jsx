import { useState } from 'react';

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqContent = [
    {
      id: 1,
      title: "What qualifications are required to apply for an internship?",
      content: `Most internships are open to students or recent graduates. Specific qualifications vary depending on the role and company, but basic communication and learning attitude are usually expected.`,
    },
    {
      id: 2,
      title: "Are internships paid or unpaid?",
      content: `Internships can be either paid or unpaid depending on the company policy. Paid internships will mention the stipend in the description, while unpaid ones may offer other benefits like experience or certifications.`,
    },
    {
      id: 3,
      title: "Can I do an internship while studying full-time?",
      content: `Yes, many internships are designed to be part-time or remote, allowing students to manage both their academics and work experience simultaneously.`,
    },
    {
      id: 4,
      title: "How long does an internship usually last?",
      content: `Internship durations vary but typically range from 1 to 6 months. Some programs may offer extensions based on performance or company requirements.`,
    },
    {
      id: 5,
      title: "Will I receive a certificate or letter of recommendation?",
      content: `Most companies provide an internship completion certificate. A letter of recommendation may be given based on performance and at the discretion of the mentor or HR.`,
    },
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      {faqContent.map((item, index) => (
        <div className="faq-item" key={item.id}>
          <div 
            className={`faq-header ${activeIndex === index ? 'active' : ''}`}
            onClick={() => toggleAccordion(index)}
          >
            <div className="faq-icon">
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 16 16" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d={activeIndex === index ? "M4 8H12" : "M8 4V12M4 8H12"} 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                />
              </svg>
            </div>
            <h3 className="faq-title">{item.title}</h3>
          </div>
          <div 
            className={`faq-content ${activeIndex === index ? 'open' : ''}`}
            style={{
              maxHeight: activeIndex === index ? '500px' : '0'
            }}
          >
            <div className="faq-answer">{item.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Faq;