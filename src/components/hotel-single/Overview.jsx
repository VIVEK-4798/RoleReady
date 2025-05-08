const Overview = ({ internship }) => {
  return (
    <>
      <h3 className="text-22 fw-500 pt-40 border-top-light">Overview</h3>

      {/* Render venue_overview from the database if available */}
      {internship?.venue_overview && (
        <div
          className="text-dark-1 text-15 mt-20"
          dangerouslySetInnerHTML={{ __html: internship.venue_overview }}
        />
      )}

      {/* Default overview content (always shown) */}
      <p className="text-dark-1 text-15 mt-20">
        Discover exciting internship opportunities designed to help you gain real-world experience and 
        develop industry-relevant skills. Whether you're a student or a recent graduate, our internships 
        offer hands-on learning, mentorship, and exposure to dynamic work environments across various domains.
        <br />
        <br />
        Interns will work closely with experienced professionals, contribute to live projects, and gain 
        insights into workplace culture. All positions listed on our platform are verified, with clear 
        roles, duration, stipend details, and application deadlines to help you make informed decisions.
        <br />
        <br />
        Apply now to kickstart your career journey and take a meaningful step towards your professional goals.
      </p>

      <a
        href="#"
        className="d-block text-14 text-blue-1 fw-500 underline mt-10"
      >
        Show More
      </a>
    </>
  );
};

export default Overview;
