import React, { useState } from "react";
import SidebarRight from "@/components/tour-single/SidebarRight";
import Overview from "@/components/tour-single/Overview";
import TourSnapShot from "@/components/tour-single/TourSnapShot";
import { Gallery, Item } from "react-photoswipe-gallery";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import ModalVideo from "react-modal-video";

export default function TourGallery({ tour }) {
  const [isOpen, setOpen] = useState(false);

  // Parse DB images (portfolio) and fallback default images
  const dbImages = tour?.portfolio ? JSON.parse(tour.portfolio) : [];
  const defaultImages = [
    "/img/jobsCategory/Sales&BusinessDevelopment.png",
    "/img/jobsCategory/HumanResources.jpg",
    "/img/jobsCategory/ContentWriting.png",
    "/img/jobsCategory/officeInside.webp",
  ];
  const allImages = [...dbImages, ...defaultImages];

  return (
    <>
      <ModalVideo
        channel="youtube"
        autoplay
        isOpen={isOpen}
        videoId="oqNZOOWF8qM"
        onClose={() => setOpen(false)}
      />

      <section className="pt-40 js-pin-container">
        <div className="container">
          <div className="row y-gap-30">
            <div className="col-xl-8">
              <div className="relative d-flex justify-center overflow-hidden js-section-slider">
                <Swiper
                  modules={[Navigation]}
                  loop={true}
                  navigation={{
                    nextEl: ".js-img-next",
                    prevEl: ".js-img-prev",
                  }}
                >
                  {allImages.map((img, i) => (
                    <SwiperSlide key={i}>
                      <img
                        src={img}
                        alt={`slide-${i}`}
                        style={{ height: "501px", objectFit: "cover" }}
                        className="rounded-4 col-12"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

                <Gallery>
                  <div
                    className="absolute px-10 py-10 col-12 h-full d-flex justify-end items-end z-2 bottom-0 end-0"
                    key="gallery-button"
                  >
                    <Item
                      original={allImages[0]}
                      thumbnail={allImages[0]}
                      width={451}
                      height={450}
                    >
                      {({ ref, open }) => (
                        <div
                          className="button -blue-1 px-24 py-15 bg-white text-dark-1 js-gallery"
                          ref={ref}
                          onClick={open}
                          role="button"
                        >
                          See All Photos
                        </div>
                      )}
                    </Item>
                  </div>
                </Gallery>

                <div className="absolute h-full col-11">
                  <button className="section-slider-nav -prev flex-center button -blue-1 bg-white shadow-1 size-40 rounded-full sm:d-none js-img-prev">
                    <i className="icon icon-chevron-left text-12" />
                  </button>
                  <button className="section-slider-nav -next flex-center button -blue-1 bg-white shadow-1 size-40 rounded-full sm:d-none js-img-next">
                    <i className="icon icon-chevron-right text-12" />
                  </button>
                </div>
              </div>

              <h3 className="text-22 fw-500 mt-40">Job highlights</h3>
              <TourSnapShot />
              <div className="border-top-light mt-40 mb-40"></div>
              <Overview />
            </div>

            <div className="col-xl-4">
              <SidebarRight tour={tour} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
