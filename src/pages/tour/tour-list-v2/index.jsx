import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom"; // ✅ NEW
import CallToActions from "@/components/common/CallToActions";
import Header11 from "@/components/header/header-11";
import DefaultFooter from "@/components/footer/default";
import TopHeaderFilter from "@/components/tour-list/tour-list-v2/TopHeaderFilter";
import TourProperties from "@/components/tour-list/tour-list-v2/TourProperties";
import MainFilterSearchBox from "@/components/hotel-list/hotel-list-v4/MainFilterSearchBox";
import Pagination from "@/components/tour-list/common/Pagination";
import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Tour List v2 || GoTrip - Travel & Tour ReactJs Template",
  description: "GoTrip - Travel & Tour ReactJs Template",
};

const TourListPage2 = () => {
  const [filters, setFilters] = useState({ city: null, category: "" });
  const [searchParams] = useSearchParams(); // ✅ read from URL

  useEffect(() => {
    const cityNameFromQuery = searchParams.get("city_name");
    const categoryFromQuery = searchParams.get("category");

    setFilters({
      city: cityNameFromQuery ? { city_name: cityNameFromQuery } : null,
      category: categoryFromQuery || "",
    });
  }, [searchParams]);

  const handleSearch = (data) => {
    setFilters(data);
  };

  return (
    <>
      <MetaComponent meta={metadata} />
      <div className="header-margin"></div>

      <section style={{ padding: '80px 0', background: 'linear-gradient(135deg, #E5F0FD 0%, #9DC6F5 100%)', position: 'relative', overflow: 'visible', zIndex: 1000 }}>
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '100%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          transform: 'rotate(30deg)',
          zIndex: 10
        }}></div>

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          position: 'relative',
          zIndex: 20
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px' }}>
            <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
              <h1 style={{ fontSize: '48px', fontWeight: 700, color: '#13357B', margin: 0, lineHeight: 1.2, textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                Explore Top Job Opportunities
              </h1>
              <p style={{ fontSize: '18px', color: '#13357B', marginTop: '16px', lineHeight: 1.5 }}>
                Discover exciting job openings to elevate your career
              </p>
            </div>

            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '12px',
              marginTop: '30px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
              zIndex: 100,
              position: 'relative',
              width: '100%',
              maxWidth: '1000px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              <MainFilterSearchBox onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </section>

      <Header11 />

      <section className="layout-pt-md layout-pb-lg">
        <div className="container">
          <div className="row y-gap-30">
            <div className="col-xl-12">
              <TopHeaderFilter />
              <div className="mt-30"></div>
              <div className="row y-gap-30">
                <TourProperties filters={filters} />
              </div>
              <Pagination />
            </div>
          </div>
        </div>
      </section>

      <CallToActions />
      <DefaultFooter />
    </>
  );
};

export default TourListPage2;
