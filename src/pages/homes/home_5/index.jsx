import Header5 from "@/components/header/header-5";
import Hero5 from "@/components/hero/hero-5";
import { Link } from "react-router-dom";
import Footer4 from "@/components/footer/footer-4";
import DefaultCallToActions from "@/components/common/CallToActions";
import GuestCallToActions from "@/components/home/home-5/CallToActions";
import Counter3 from "@/components/counter/Counter3";
import WhyChooseUs from "@/components/home/home-5/WhyChooseUs";
import BenefitsBar from "@/components/home/home-5/BenefitsBar";
import JobListings from "@/components/home/home-5/JobListings";
import InternshipListings from "@/components/home/home-5/InternshipListings";
import JoinOurBusiness from "@/components/home/home-5/JoinOurBusiness";
import DefaultHeader from "@/components/header/default-header";
import MetaComponent from "@/components/common/MetaComponent";
import { useEffect, useState } from "react";
import College from "@/components/home/home-5/College";

const metadata = {
  title: "Startups24x7",
  description: "Startups24x7 - All-in-One Platform for Startup Services"
};

const Home_5 = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Update this logic if you store user info differently
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  return (
    <>
      <MetaComponent meta={metadata} />

      <DefaultHeader />
      <Hero5 />

      <section className="layout-pt-md layout-pb-lg">
        <div className="container">
          <div className="row justify-center text-center">
            <Counter3 />
          </div>
        </div>
      </section>

      <section className="-lg md:pt-0 md:pb-60 sm:pb-40  bg-blue-1-05">
        <BenefitsBar />
      </section>

      <section className="-lg md:pt-0 md:pb-60 sm:pb-40  bg-blue-1-05">
        <JobListings />
      </section>

      <section className="-lg md:pt-0 md:pb-60 sm:pb-40  bg-blue-1-05">
        <InternshipListings />
      </section>

      {/* <section className="-lg md:pt-0 md:pb-60 sm:pb-40  bg-blue-1-05">
        <WhyChooseUs />
      </section> */}

      <section className="section-bg layout-pt-lg md:pt-0 md:pb-60 sm:pb-40 layout-pb-lg">
        <JoinOurBusiness />
      </section>
      
        <section className="layout-pt-lg layout-pb-lg bg-light" style={{ backgroundColor: "#f0f8ff" }}>
          <College/>
        </section>


      {/* ✅ Conditional CallToActions based on login status */}
      {isLoggedIn ? <DefaultCallToActions /> : <GuestCallToActions />}

      <Footer4 />
    </>
  );
};

export default Home_5;
