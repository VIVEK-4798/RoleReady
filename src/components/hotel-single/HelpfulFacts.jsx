const HelpfulFacts = () => {
  return (
    <>
      <div className="col-lg-4 col-md-6">
        <div className="">
          <div className="d-flex items-center">
            <i className="icon-calendar text-20 mr-10"></i>
            <div className="text-16 fw-500">Check-in/Check-out</div>
          </div>
        </div>

        <div className="mt-30">
          <div className="d-flex items-center">
            <i className="icon-location-pin text-20 mr-10"></i>
            <div className="text-16 fw-500">Getting around</div>
          </div>
        </div>
      </div>

      <div className="col-lg-4 col-md-6">
        <div className="">
          <div className="d-flex items-center">
            <i className="icon-ticket text-20 mr-10"></i>
            <div className="text-16 fw-500">Extras</div>
          </div>
        </div>

        <div className="mt-30">
          <div className="d-flex items-center">
            <i className="icon-parking text-20 mr-10"></i>
            <div className="text-16 fw-500">Parking</div>
          </div>
        </div>
      </div>

      <div className="col-lg-4 col-md-6">
        <div className="">
          <div className="d-flex items-center">
            <i className="icon-plans text-20 mr-10"></i>
            <div className="text-16 fw-500">The property</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HelpfulFacts;
