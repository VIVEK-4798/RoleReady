import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import toursData from "../../../data/tours";
import isTextMatched from "../../../utils/isTextMatched";
import axios from "axios";
import { getId } from "@/utils/DOMUtils";
import { useEffect, useState } from "react";
import { api } from "@/utils/apiProvider";

const TourProperties = () => {

  const [vendors, setVendors] = useState([]);

  const fetchVendors = async () => {
    try {
      const response = await axios.get(`${api}/api/vendor/get-vendors`, {
        headers: { id: getId() },
      });
      return response.data?.results || [];
    } catch (error) {
      console.error("Failed to fetch vendors:", error);
      return [];
    }
  };

  useEffect(() => {
    const loadVendors = async () => {
      const data = await fetchVendors();
      setVendors(data);
      console.log(data);
      
    };
    loadVendors();
  }, []);

  return (
    <>
      {vendors.slice(0, 9).map((item, index) => (
        <div
          className="col-lg-4 col-sm-6"
          key={index}
          data-aos="fade"
          data-aos-delay="100"
        >
          <Link
            to={`/tour-single/${item.service_reg_id}`}
            className="hotelsCard -type-1 hover-inside-slider"
          >
          <div className="tourCard -type-1 rounded-4 position-relative">
            <div className="tourCard__image">
            <div
              className="cardImage"
              style={{
                position: "relative",
                width: "100%",
                height: "300px",
                overflow: "hidden",
                borderRadius: "12px",
              }}
            >
              <div
                className="cardImage__content"
                style={{ width: "100%", height: "100%" }}
              >
                <div
                  className="cardImage-slider custom_inside-slider"
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <Swiper
                    className="mySwiper"
                    modules={[Pagination, Navigation]}
                    pagination={{ clickable: true }}
                    navigation={true}
                    style={{ height: "100%" }}
                  >
                    {item?.portfolio && JSON.parse(item.portfolio).map((img, i) => (
                      <SwiperSlide key={i} style={{ height: "100%" }}>
                        <img
                          className="col-12 js-lazy"
                          src={img}
                          alt="portfolio"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "12px",
                          }}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            </div>
              <div className="cardImage__wishlist">
                <button className="button -blue-1 bg-white size-30 rounded-full shadow-2">
                  <i className="icon-heart text-12" />
                </button>
              </div>
            </div>
  
            <div className="tourCard__content mt-10">
              <h4 className="tourCard__title text-dark-1 text-18 lh-16 fw-500">
                <span>{item?.vendor_name}</span>
              </h4>

              <div className="row justify-between items-center mt-5">
                <div className="col-auto">
                  <p className="text-light-1 lh-14 text-14">
                    {item?.city_name}, {item?.region_name}
                  </p>
                </div>
                <div className="col-auto">
                  <p className="text-dark-1 lh-14 text-14">
                    Work Experience: {item?.work_experience}
                  </p>
                </div>
              </div>

              <p className="text-16 fw-500 text-dark-1 mt-5">{item?.vendor_service}</p>

              <div className="row justify-between items-center pt-15">
                <div className="col-auto">
                  <div className="text-14 text-dark-1 fw-500">
                    Type: {item?.job_type}
                  </div>
                </div>
                <div className="col-auto">
                  <div className="text-14 text-dark-1 fw-500">
                     Expected Salary: ₹{item?.job_salary}
                  </div>
                </div>
              </div>
            </div>
          </div>
          </Link>
        </div>
      ))}
    </>
  );
  
};

export default TourProperties;
