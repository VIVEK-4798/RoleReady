import { Link } from "react-router-dom";
import Slider from "react-slick";
import { useEffect, useState } from "react";
import axios from "axios";
import { getId } from "@/utils/DOMUtils";
import { api } from "@/utils/apiProvider";

const InternshipCarousel = () => {
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

export default InternshipCarousel;