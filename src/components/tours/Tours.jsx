// import { Link } from "react-router-dom";
// import Slider from "react-slick";
// import toursData from "../../data/tours";
// import isTextMatched from "../../utils/isTextMatched";

// const JobCarousel = () => {
//   var settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 4,
//     slidesToScroll: 1,
//     responsive: [
//       {
//         breakpoint: 992,
//         settings: {
//           slidesToShow: 2,
//         },
//       },

//       {
//         breakpoint: 768,
//         settings: {
//           slidesToShow: 2,
//         },
//       },
//       {
//         breakpoint: 520,
//         settings: {
//           slidesToShow: 1,
//         },
//       },
//     ],
//   };

//   var itemSettings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//   };

//   // custom navigation
//   function Arrow(props) {
//     let className =
//       props.type === "next"
//         ? "slick_arrow-between slick_arrow -next arrow-md flex-center button -blue-1 bg-white shadow-1 size-30 rounded-full sm:d-none js-next"
//         : "slick_arrow-between slick_arrow -prev arrow-md flex-center button -blue-1 bg-white shadow-1 size-30 rounded-full sm:d-none js-prev";
//     className += " arrow";
//     const char =
//       props.type === "next" ? (
//         <>
//           <i className="icon icon-chevron-right text-12"></i>
//         </>
//       ) : (
//         <>
//           <span className="icon icon-chevron-left text-12"></span>
//         </>
//       );
//     return (
//       <button className={className} onClick={props.onClick}>
//         {char}
//       </button>
//     );
//   }

//   return (
//     <>
//       <Slider {...settings}>
//         {toursData.slice(0, 4).map((item) => (
//           <div
//             key={item?.id}
//             data-aos="fade"
//             data-aos-delay={item?.delayAnimation}
//           >
//             <Link
//               to={`/tour-single/${item.id}`}
//               className="tourCard -type-1 rounded-4 hover-inside-slider"
//             >
//               <div className="tourCard__image position-relative">
//                 <div className="inside-slider">
//                   <Slider
//                     {...itemSettings}
//                     arrows={true}
//                     nextArrow={<Arrow type="next" />}
//                     prevArrow={<Arrow type="prev" />}
//                   >
//                     {item?.slideImg?.map((slide, i) => (
//                       <div className="cardImage ratio ratio-1:1" key={i}>
//                         <div className="cardImage__content ">
//                           <img
//                             className="col-12 js-lazy"
//                             src={slide}
//                             alt="image"
//                           />
//                         </div>
//                       </div>
//                     ))}
//                   </Slider>

//                   <div className="cardImage__wishlist">
//                     <button className="button -blue-1 bg-white size-30 rounded-full shadow-2">
//                       <i className="icon-heart text-12" />
//                     </button>
//                   </div>

//                   <div className="cardImage__leftBadge">
//                     <div
//                       className={`py-5 px-15 rounded-right-4 text-12 lh-16 fw-500 uppercase ${
//                         isTextMatched(item?.tag, "likely to sell out*")
//                           ? "bg-dark-1 text-white"
//                           : ""
//                       } ${
//                         isTextMatched(item?.tag, "best seller")
//                           ? "bg-blue-1 text-white"
//                           : ""
//                       }  ${
//                         isTextMatched(item?.tag, "top rated")
//                           ? "bg-yellow-1 text-dark-1"
//                           : ""
//                       }`}
//                     >
//                       {item.tag}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               {/* End .tourCard__image */}

//               <div className="tourCard__content mt-10">
//                 <div className="d-flex items-center lh-14 mb-5">
//                   <div className="text-14 text-light-1">
//                     {item?.duration}+ hours
//                   </div>
//                   <div className="size-3 bg-light-1 rounded-full ml-10 mr-10" />
//                   <div className="text-14 text-light-1">{item?.tourType}</div>
//                 </div>
//                 <h4 className="tourCard__title text-dark-1 text-18 lh-16 fw-500">
//                   <span>{item?.title}</span>
//                 </h4>
//                 <p className="text-light-1 lh-14 text-14 mt-5">
//                   {item?.location}
//                 </p>

//                 <div className="row justify-between items-center pt-15">
//                   <div className="col-auto">
//                     <div className="d-flex items-center">
//                       <div className="d-flex items-center x-gap-5">
//                         <div className="icon-star text-yellow-1 text-10" />
//                         <div className="icon-star text-yellow-1 text-10" />
//                         <div className="icon-star text-yellow-1 text-10" />
//                         <div className="icon-star text-yellow-1 text-10" />
//                         <div className="icon-star text-yellow-1 text-10" />
//                       </div>
//                       {/* End ratings */}

//                       <div className="text-14 text-light-1 ml-10">
//                         {item?.numberOfReviews} reviews
//                       </div>
//                     </div>
//                   </div>
//                   <div className="col-auto">
//                     <div className="text-14 text-light-1">
//                       From
//                       <span className="text-16 fw-500 text-dark-1">
//                         {" "}
//                         US${item.price}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </Link>
//           </div>
//         ))}
//       </Slider>
//     </>
//   );
// };

// export default JobCarousel;


import { Link } from "react-router-dom";
import Slider from "react-slick";
import { useEffect, useState } from "react";
import axios from "axios";
import { getId } from "@/utils/DOMUtils";
import { api } from "@/utils/apiProvider";

const JobCarousel = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVenues = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${api}/api/venue/get-venue`, {
        headers: {
          id: getId(),
        },
      });
      if (response.data.success) {
        setVenues(response.data.results || []);
      } else {
        setError("Failed to fetch venues.");
      }
    } catch (err) {
      setError("An error occurred while fetching venues.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const ArrowSlick = ({ type, onClick }) => {
    return (
      <button 
        className={`slick-arrow ${type === "next" ? "next-arrow" : "prev-arrow"}`}
        onClick={onClick}
      >
        <i className={`bi bi-chevron-${type === "next" ? "right" : "left"}`} />
      </button>
    );
  };

  return (
    <div className="internship-carousel-container">
      {loading ? (
        <div className="loading-spinner">Loading internships...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <Slider {...settings} 
          nextArrow={<ArrowSlick type="next" />}
          prevArrow={<ArrowSlick type="prev" />}
        >
          {venues.slice(0, 6).map((item, index) => {
            const images = JSON.parse(item.venue_images || "[]");
            const tagData = JSON.parse(item.venue_categories || "[]");
            const tag = tagData[0]?.category_name || "Internship";
            const tagColor = tagData[0]?.category_color || "#4f46e5";
            const logoImage = images.length > 0 ? images[0] : "/img/jobsCategory/default-logo.png";

            return (
              <div key={item.venue_id} data-aos="fade" data-aos-delay={index * 100}>
                <div className="internship-card">
                  <Link to={`/hotel-single-v1/${item.venue_id}`} className="card-link">
                    <div className="card-header">
                      <div className="company-logo">
                        <img src={logoImage} alt={`${item.venue_name} logo`} />
                      </div>
                      <div className="card-badge" style={{ backgroundColor: tagColor }}>
                        {tag}
                      </div>
                    </div>

                    <div className="card-content">
                      <div className="title-wrapper">
                        <h3 className="card-title">{item.venue_name || "Untitled Internship"}</h3>
                      </div>
                      <p className="card-location">
                        <i className="bi bi-geo-alt" /> {item.city_name}, {item.state}
                      </p>

                      <div className="card-rating">
                        <div className="rating-badge">
                          {item.venue_rate ?? "4.5"}
                        </div>
                        <span className="rating-text">Recommended</span>
                        <span className="rating-basis">Based on skills</span>
                      </div>

                      <div className="card-details">
                        <div className="detail-item">
                          <i className="bi bi-calendar" />
                          <span>{item.duration_months} month(s)</span>
                        </div>
                        <div className="detail-item">
                          <i className="bi bi-cash-coin" />
                          <span>₹{item.stipend}/month</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            );
          })}
        </Slider>
      )}
    </div>
  );
};

export default JobCarousel;