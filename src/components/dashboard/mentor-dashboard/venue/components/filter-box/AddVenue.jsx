import { useState } from "react";
import "../../../../../../styles/modals.css";
import axios from "axios";
import { api } from "@/utils/apiProvider";
// import { showAlert } from "@/utils/isTextMatched";
import { useNavigate } from "react-router-dom";

const AddVenue = ({ refreshVenues = () => {} }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [venueData, setVenueData] = useState({
    venue_name: "",
    city_name: "",
    region_name: "",
    venue_rate: "",
    veg_package_price: "",
    non_veg_package_price: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${api}/api/add-venue`, {
        ...venueData,
      });

      if (response.data.results === true) {
        showAlert("Venue added successfully.","success");
        setVenueData({
          venue_name: "",
          city_name: "",
          region_name: "",
          venue_rate: "",
          veg_package_price: "",
          non_veg_package_price: "",
        });
        setShowModal(false);
        refreshVenues(); // Refresh the venue list after adding
      } else {
        showAlert("Something went wrong.","error");
      }
    } catch (error) {
      showAlert(error.response?.data?.error || "An error occurred.","error");
      console.error("Error:", error);
    }
  };

  return (
    <div className="col-auto">
      {/* Add Venue Button */}
      <button
        className="button h-50 px-24 -dark-1 bg-blue-1 text-white"
        onClick={() => {navigate("/admin-dashboard/venue/add")}}
      >
        Add Internships <div className="icon-arrow-top-right ml-15"></div>
      </button>

      {/* Add Venue Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add Venue</h3>
            <form onSubmit={handleSubmit}>
              {/* Venue Name */}
              <label>
                Venue Name:
                <input
                  type="text"
                  value={venueData.venue_name}
                  onChange={(e) =>
                    setVenueData({ ...venueData, venue_name: e.target.value })
                  }
                  required
                />
              </label>

              {/* City Name */}
              <label>
                City Name:
                <input
                  type="text"
                  value={venueData.city_name}
                  onChange={(e) =>
                    setVenueData({ ...venueData, city_name: e.target.value })
                  }
                  required
                />
              </label>

              {/* Region Name */}
              <label>
                Region Name:
                <input
                  type="text"
                  value={venueData.region_name}
                  onChange={(e) =>
                    setVenueData({ ...venueData, region_name: e.target.value })
                  }
                  required
                />
              </label>

              {/* Venue Rate */}
              <label>
                Venue Rate:
                <input
                  type="number"
                  value={venueData.venue_rate}
                  onChange={(e) =>
                    setVenueData({ ...venueData, venue_rate: e.target.value })
                  }
                  required
                />
              </label>

              {/* Veg Package Price */}
              <label>
                Veg Package Price:
                <input
                  type="number"
                  value={venueData.veg_package_price}
                  onChange={(e) =>
                    setVenueData({
                      ...venueData,
                      veg_package_price: e.target.value,
                    })
                  }
                />
              </label>

              {/* Non-Veg Package Price */}
              <label>
                Non-Veg Package Price:
                <input
                  type="number"
                  value={venueData.non_veg_package_price}
                  onChange={(e) =>
                    setVenueData({
                      ...venueData,
                      non_veg_package_price: e.target.value,
                    })
                  }
                />
              </label>

              {/* Modal Actions */}
              <div className="modal-actions">
                <button type="submit" className="button bg-blue-1 text-white">
                  Submit
                </button>
                <button
                  type="button"
                  className="button bg-light-2 text-dark-1"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddVenue;