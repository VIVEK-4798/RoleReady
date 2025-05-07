const PropertyHighlights2 = ({ internship }) => {
  console.log(internship);
  
  const {
    city_name,
    region_name,
    duration_months,
    internship_type,
    work_detail,
    stipend,
    perks,
  } = internship;

  const highlightCards = [
    {
      title: "Internship Location(s)",
      value: `${region_name || ""}, ${city_name || ""}`,
      icon: "icon-location",
    },
    {
      title: "Internship Duration",
      value: `${duration_months} months`,
      icon: "icon-calendar",
    },
    {
      title: "Internship Type",
      value: stipend === "0" ? "Unpaid" : "Paid",
      icon: "icon-wallet",
    },
    {
      title: "Work Detail",
      value: work_detail || "Working Days: 5 Days",
      icon: "icon-clipboard",
    },
    {
      title: "Internship Type/Timing",
      value: `Type: Hybrid\nTiming: ${internship_type}`,
      icon: "icon-clock",
    },
    {
      title: "Perks",
      value: perks?.split(",").join("\n") || "None",
      icon: "icon-gift",
    },
  ];

  return (
    <div className="row y-gap-20 pt-30">
      {highlightCards.map((item, index) => (
        <div className="col-md-6 col-lg-4" key={index}>
          <div className="bg-light rounded p-20 h-100 d-flex align-items-start gap-15">
            <i className={`${item.icon} text-24 text-primary mt-5`} />
            <div>
              <div className="fw-bold text-16">{item.title}</div>
              <div className="text-14 mt-5 white-space-pre-line">{item.value}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PropertyHighlights2;
