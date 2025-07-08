import "photoswipe/dist/photoswipe.css";
import toursData from "@/data/tours";
import Header11 from "@/components/header/header-11";
import TopBreadCrumb from "@/components/tour-single/TopBreadCrumb";
import ReviewProgress2 from "@/components/tour-single/guest-reviews/ReviewProgress2";
import DetailsReview2 from "@/components/tour-single/guest-reviews/DetailsReview2";
import ReplyForm from "@/components/tour-single/ReplyForm";
import ReplyFormReview2 from "@/components/tour-single/ReplyFormReview2";
import CallToActions from "@/components/common/CallToActions";
import DefaultFooter from "@/components/footer/default";
import Tours from "@/components/tours/Tours";
import Faq from "@/components/faq/Faq";
import { Link, useParams } from "react-router-dom";
import Itinerary from "@/components/tour-single/itinerary";
import ImportantInfo from "@/components/tour-single/ImportantInfo";
import TourGallery from "@/components/tour-single/TourGallery";
import axios from "axios";
import { useEffect, useState } from "react";
import { api } from "@/utils/apiProvider";

import MetaComponent from "@/components/common/MetaComponent";
import Facilities from "@/components/hotel-single/Facilities";
import HelpfulFacts from "@/components/hotel-single/HelpfulFacts";

const metadata = {
  title: "Job Single || GoHire - Job Listing & Recruitment React Template",
  description: "Explore detailed job listings on GoHire.",
};

const TourSingleV1Dynamic = () => {
  let params = useParams();
  const id = params.id;
  const tour = toursData.find((item) => item.id == id) || toursData[0];

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  

  const fetchInternship = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${api}/api/vendor/get-vendor/${id}`);
      console.log("response.data.result", response.data.result);
      setJob(response.data.result || []);
    } catch (err) {
      setError("An error occurred while fetching job data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchInternship();
  }, [id]);

  return (
    <>
      <MetaComponent meta={metadata} />
      {/* End Page Title */}

      <div className="header-margin"></div>
      {/* header top margin */}

      <Header11 />
      {/* End Header 1 */}
      {job && Object.keys(job).length > 0 && (
          <TopBreadCrumb job={job}/>
        )}
      {/* End top breadcrumb */}

      <TourGallery job={job}/>

      {/* End single page content */}

      <section className="pt-40">
        <div className="container">
          <div className="pt-40 border-top-light">
            <div className="row x-gap-40 y-gap-40">
            </div>
            {/* End row */}
            <ImportantInfo />
          </div>
          {/* End pt-40 */}
        </div>
        {/* End .container */}
      </section>
      {/* End important info */}

       <section className="mt-40" id="facilities">
        <div className="container">
          <div className="row x-gap-40 y-gap-40">
            <div className="col-12">
              <div className="row x-gap-40 y-gap-40 pt-20">
              {job && Object.keys(job).length > 0 && (
                  <Facilities job={job}/>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

            <section className="pt-40">
        <div className="container">
          <div className="pt-40 border-top-light">
            <div className="row">
              <div className="col-12">
              </div>
            </div>
            {/* End .row */}

            <div className="row x-gap-50 y-gap-30 pt-20">
            {job && Object.keys(job).length > 0 && (
                  <HelpfulFacts job={job}/>
                )}
            </div>
          </div>
        </div>
      </section>

      <section className="pt-40">
        <div className="container">
          <div className="row border-top-light">
            <div className="col-xl-8 col-lg-10 mt-30">
              <div className="row">
                <div className="col-auto">
                  <h3 className="text-22 fw-500">Leave a Reply</h3>
                  <p className="text-15 text-dark-1 mt-5">
                    Your email address will not be published.
                  </p>
                </div>
              </div>
              <ReplyForm />
            </div>
          </div>
        </div>
      </section>

            <section className="mt-40">
        <div className="container ">
          <div className="pt-40 border-top-light">
            <div className="row y-gap-20">
              <div className="col-lg-4">
                <h2 className="text-22 fw-500">
                  FAQs about
                  <br /> Startups24x7 Jobs
                </h2>
              </div>
              {/* End .row */}

              <div className="col-lg-8">
                <div
                  className="accordion -simple row y-gap-20 js-accordion"
                  id="Faq1"
                >
                  <Faq />
                </div>
              </div>
              {/* End .col */}
            </div>
            {/* End .row */}
          </div>
          {/* End .pt-40 */}
        </div>
        {/* End .container */}
      </section>
      {/* End Faq about sections */}

      <section className="layout-pt-lg layout-pb-lg mt-50 border-top-light">
        <div className="container">
          <div className="row y-gap-20 justify-between items-end">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">Popular jobs similar to this opportunity</h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  Explore similar jobs that match your skills and interests
                </p>
              </div>
            </div>
            {/* End .col */}
          </div>
          {/* End .row */}

          <div className="row y-gap-30 pt-40 sm:pt-20 item_gap-x30">
            <Tours />
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </section>
      {/* End Tours Sections */}

      <CallToActions />
      {/* End Call To Actions Section */}

      <DefaultFooter />
    </>
  );
};

export default TourSingleV1Dynamic;
