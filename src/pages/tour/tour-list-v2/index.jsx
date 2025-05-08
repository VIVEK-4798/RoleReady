import CallToActions from "@/components/common/CallToActions";
import Header11 from "@/components/header/header-11";
import DefaultFooter from "@/components/footer/default";
import TopHeaderFilter from "@/components/tour-list/tour-list-v2/TopHeaderFilter";
import TourProperties from "@/components/tour-list/tour-list-v2/TourProperties";
import MainFilterSearchBox from "@/components/hotel-list/hotel-list-v4/MainFilterSearchBox";
import Pagination from "@/components/tour-list/common/Pagination";
import Sidebar from "@/components/tour-list/tour-list-v2/Sidebar";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Tour List v2 || GoTrip - Travel & Tour ReactJs Template",
  description: "GoTrip - Travel & Tour ReactJs Template",
};

const TourListPage2 = () => {
  return (
    <>
      <MetaComponent meta={metadata} />
      {/* End Page Title */}

      <div className="header-margin"></div>
      {/* header top margin */}

      <section className="pt-40 pb-40 bg-blue-2">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="text-center">
              <h1 className="text-30 fw-600">Explore Top Jobs Opportunities</h1>
              </div>
              {/* End text-center */}
              <MainFilterSearchBox />
            </div>
            {/* End col-12 */}
          </div>
        </div>
      </section>
      {/* Top SearchBanner */}

      <Header11 />
      {/* End Header 1 */}

      <section className="layout-pt-md layout-pb-lg">
        <div className="container">
          <div className="row y-gap-30">
            {/* Sidebar removed, so no col-xl-3 here */}

            <div className="col-xl-12">
              <TopHeaderFilter />
              <div className="mt-30"></div>
              {/* End mt--30 */}
              <div className="row y-gap-30">
                <TourProperties />
              </div>
              {/* End .row */}
              <Pagination />
            </div>
            {/* End .col for right content */}
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </section>

      <CallToActions />
      {/* End Call To Actions Section */}

      <DefaultFooter />
    </>
  );
};

export default TourListPage2;
