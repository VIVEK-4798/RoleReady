import { useState, useEffect } from "react";
import "../../../../../../styles/modals.css";
import axios from "axios";
import { api } from "@/utils/apiProvider";
// import { showAlert } from "@/utils/isTextMatched";

const AddRegion = ({ refreshRegions = () => {} }) => {
  const [showModal, setShowModal] = useState(false);
  const [cities, setCities] = useState([]);
  const [regionData, setRegionData] = useState({
    region_name: "",
    region_pincode: "", // Added region_pincode field
    city_id: "",
  });

  // Fetch cities for the dropdown
  const fetchCities = async () => {
    try {
      const response = await axios.get(`${api}/api/city/get-city`);
      if (response.data.success) {
        setCities(response.data.results);
      } else {
        console.error("Failed to fetch cities.");
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${api}/api/region/add-regions`, {
        ...regionData,
      });

      if (response.data.success === true) {
        showAlert("Region added successfully.", "success");
        setRegionData({
          region_name: "",
          region_pincode: "", // Reset region_pincode after submission
          city_id: "",
        });
        setShowModal(false); // Close modal after submission
        refreshRegions(); // Refresh the region list after adding
      } else {
        showAlert("Something went wrong.", "error");
      }
    } catch (error) {
      showAlert(error.response?.data?.error || "An error occurred.", "error");
      console.error("Error:", error);
    }

  };

  return (
    <div className="col-auto">
      {/* Add Region Button */}
      <button
        className="button h-50 px-24 -dark-1 bg-blue-1 text-white"
        onClick={() => setShowModal(true)}
      >
        Add Region <div className="icon-arrow-top-right ml-15"></div>
      </button>

      {/* Add Region Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add Region</h3>
            <form onSubmit={handleSubmit}>
              <label>
                Region Name:
                <input
                  type="text"
                  value={regionData.region_name}
                  onChange={(e) =>
                    setRegionData({ ...regionData, region_name: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Zip Code:
                <input
                  type="text"
                  value={regionData.region_pincode}
                  onChange={(e) =>
                    setRegionData({
                      ...regionData,
                      region_pincode: e.target.value,
                    })
                  }
                  required
                />
              </label>
              <label>
                Parent City:
                <select
                  className="form-input"
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "8px",
                  }}
                  value={regionData.city_id}
                  onChange={(e) =>
                    setRegionData({ ...regionData, city_id: e.target.value })
                  }
                  required
                >
                  <option value="">Select a city</option>
                  {cities.map((city) => (
                    <option key={city.city_id} value={city.city_id}>
                      {city.city_name}
                    </option>
                  ))}
                </select>
              </label>              
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

export default AddRegion;
