const PopularFacilities = ({ internship }) => {
  const defaultResponsibilities = [
    {
      text: "Collaborate effectively with team members",
      icon: "bi-people"
    },
    {
      text: "Demonstrate strong time management skills",
      icon: "bi-clock"
    },
    {
      text: "Maintain professionalism in all tasks",
      icon: "bi-briefcase"
    },
    {
      text: "Adapt quickly to project requirements",
      icon: "bi-arrow-repeat"
    }
  ];

  const customResponsibilities = internship?.responsibilities
    ? internship.responsibilities.split(',').map((item) => item.trim())
    : [];

  return (
    <>
      {customResponsibilities.map((item, index) => (
        <div className="col-md-5" key={`custom-${index}`}>
          <div className="d-flex x-gap-15 y-gap-15 items-center">
            <i className="bi bi-check-circle"></i>
            <div className="text-15">{item}</div>
          </div>
        </div>
      ))}

      {defaultResponsibilities.map((item, index) => (
        <div className="col-md-5" key={`default-${index}`}>
          <div className="d-flex x-gap-15 y-gap-15 items-center">
            <i className={`bi ${item.icon}`}></i>
            <div className="text-15">{item.text}</div>
          </div>
        </div>
      ))}
    </>
  );
};

export default PopularFacilities;
