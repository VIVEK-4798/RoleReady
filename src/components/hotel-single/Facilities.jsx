import React from 'react';

const Facilities = ({ internship }) => {
  const defaultResponsibilities = [
    { 
      id: 1, 
      icon: "bi-lightbulb", 
      title: "Creative thinking and problem-solving ability" 
    },
    { id: 2, icon: "bi-chat", title: "Excellent communication skills" },
  ];

  const responsibilitiesFromDb = internship?.responsibilities
    ? internship.responsibilities.split(",").map((item, index) => ({
        id: index + 3,
        icon: "icon-check", 
        title: item.trim(),
      }))
    : [];

  const allResponsibilities = [ ...responsibilitiesFromDb, ...defaultResponsibilities,];

  return (
    <>
      <section className="mt-40" id="facilities">
        <div className="container">
          <div className="row x-gap-40 y-gap-40">
            <div className="col-12">
              <div className="row x-gap-40 ">
                {/* Displaying responsibilities */}
                {allResponsibilities.map((responsibility) => (
                  <div className="col-xl-4" key={responsibility.id}>
                    <div className="row ">
                      <div className="col-12">
                        <div>
                          <div className="d-flex items-center text-16 fw-500">
                            <i className={`${responsibility.icon} text-20 mr-10`} />
                            {responsibility.title}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* End .row */}
            </div>
            {/* End .col-12 */}
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </section>
      {/* End facilities section */}
    </>
  );
};

export default Facilities;
