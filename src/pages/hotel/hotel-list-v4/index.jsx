import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import CallToActions from "@/components/common/CallToActions";
import Header11 from "@/components/header/header-11";
import DefaultFooter from "@/components/footer/default";
import TopHeaderFilter from "@/components/hotel-list/hotel-list-v4/TopHeaderFilter";
import Pagination from "@/components/hotel-list/common/Pagination";
import HotelProperties from "@/components/hotel-list/hotel-list-v4/HotelProperties";
import LocationSearch from "@/components/hotel-list/hotel-list-v4/LocationSearch";
import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Internship Opportunities",
  description: "Startup24x7",
};

const HotelListPage4 = () => {
  const [filters, setFilters] = useState({ city: null, category: "" });
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const cityNameFromQuery = searchParams.get("city_name");
    const categoryFromQuery = searchParams.get("category");

    setFilters({
      city: cityNameFromQuery ? { city_name: cityNameFromQuery } : null,
      category: categoryFromQuery || "",
    });
  }, [searchParams]);

  return (
    <>
      <MetaComponent meta={metadata} />

      <div className="header-margin"></div>
      <Header11 />

      <section style={{
        padding: '80px 0',
        background: 'linear-gradient(135deg, #E5F0FD 0%, #9DC6F5 100%)',
        position: 'relative',
        overflow: 'visible',
        zIndex: 1000,
      }}>
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '100%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          transform: 'rotate(30deg)',
          zIndex: 10,
        }}></div>

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          position: 'relative',
          zIndex: 20,
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '40px'
          }}>
            <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
              <h1 style={{ fontSize: '48px', fontWeight: 700, color: '#13357B' }}>
                Explore Internship Opportunities
              </h1>
              <p style={{ fontSize: '18px', color: '#13357B', marginTop: '16px' }}>
                Find the perfect internship to kickstart your career
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
              maxWidth: '1200px',
            }}>
              <LocationSearch onChange={setFilters} />
            </div>
          </div>
        </div>
      </section>

      <section className="layout-pt-md layout-pb-lg">
        <div className="container">
          <div className="row y-gap-30">
            <div className="col-12">
              <TopHeaderFilter />
              <div className="mt-30"></div>
              <div className="row y-gap-30">
                <HotelProperties filters={filters} />
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

export default HotelListPage4;
