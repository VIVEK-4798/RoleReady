import { useState, useEffect } from "react";
import axios from "axios";
// import Pagination from "../../common/Pagination";
import ActionsButton from "./ActionsButton";
import { api } from "@/utils/apiProvider";
// import { showAlert } from "@/utils/isTextMatched";
import GalleryUploader from "./filter-box/GalleryUploader";

const CityTable = ({ searchParameter, refresh }) => {
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [cityData, setCityData] = useState({
    city_id: null,
    city_name: "",
    city_address: "",
    city_image: [],
    new_image: null, // For uploading a new image
    is_featured: false,
  });

  // Fetch cities
  const fetchCities = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${api}/api/city/get-city`);
      if (response.data.success) {
        setCities(response.data.results);
        setFilteredCities(response.data.results); // Set both main and filtered data
      } else {
        setError("Failed to fetch cities.");
      }
    } catch (err) {
      console.error("Error fetching cities:", err);
      setError("An error occurred while fetching cities.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, [refresh]);

  // Unified Search Logic
  useEffect(() => {
    const lowercasedTerm = searchParameter.toLowerCase();
    const filtered = cities.filter((city) =>
      city.city_name.toLowerCase().includes(lowercasedTerm)
    );
    setFilteredCities(filtered);
  }, [searchParameter]);

  // Edit city
  const handleEdit = (city) => {
    setCityData({
      city_id: city.city_id,
      city_name: city.city_name,
      city_address: city.city_address,
      city_image: JSON.parse(city.city_image || "[]"), // Existing images
      new_image: null, // Reset new image field
      is_featured: city.is_featured || false,
    });
    setEditMode(true);
    setShowModal(true);
  };

  // Update city
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      

      await axios.put(`${api}/api/city/update-city/${cityData.city_id}`, {...cityData, city_image:JSON.stringify(cityData.city_image)});

      showAlert("City updated successfully.", "success");
      setShowModal(false);
      fetchCities(); // Refresh cities list
    } catch (error) {
      console.error("Error updating city:", error);
      showAlert(error.response?.data?.error || "An error occurred.", "error");
    }
  };

  // Delete city
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${api}/api/city/delete-city/${id}`);
      showAlert("City deleted successfully.", "success");
      fetchCities(); // Refresh cities list
    } catch (error) {
      console.error("Error deleting city:", error);
      showAlert(error.response?.data?.error || "An error occurred.", "error");
    }
  };

  // Handle new image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCityData((prevCityData) => ({
        ...prevCityData,
        new_image: file,
      }));
    }
  };

  return (
    <>
      <div className="tabs -underline-2 js-tabs">
        <div className="tabs__content pt-30 js-tabs-content">
          <div className="tabs__pane -tab-item-1 is-tab-el-active">
            {loading ? (
              <p>Loading cities...</p>
            ) : error ? (
              <p className="text-red-1">{error}</p>
            ) : filteredCities.length === 0 ? (
              <p>No cities available.</p>
            ) : (
              <div className="overflow-scroll scroll-bar-1">
                <table className="table-3 -border-bottom col-12">
                  <thead className="bg-light-2">
                    <tr>
                      <th>City Name</th>
                      <th>Address</th>
                      <th>Image</th>
                      <th>Featured</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCities.map((city, index) => (
                      <tr key={index}>
                        <td>{city.city_name || "N/A"}</td>
                        <td>{city.city_address || "N/A"}</td>
                        <td>
                          <img
                            src={
                              city.city_image
                                ? JSON.parse(city.city_image)[0]
                                : "placeholder-image-url"
                            }
                            alt={city.city_name || "City"}
                            style={{ width: "50px", height: "50px" }}
                          />
                        </td>
                        <td>{city.is_featured ? "Yes" : "No"}</td>
                        <td>
                          <ActionsButton
                            city={city}
                            onEdit={() => handleEdit(city)}
                            onDelete={() => handleDelete(city.city_id)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* if want pagination insert here   <Pagination /> */}
      {/* Edit City Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editMode ? "Edit City" : "Add City"}</h3>
            <form onSubmit={handleSubmit}>
              <label>
                City Name:
                <input
                  type="text"
                  value={cityData.city_name}
                  onChange={(e) =>
                    setCityData({ ...cityData, city_name: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Address:
                <input
                  type="text"
                  value={cityData.city_address}
                  onChange={(e) =>
                    setCityData({ ...cityData, city_address: e.target.value })
                  }
                  required
                />
              </label>
              <label>                
              Is Featured
                <input
                  type="checkbox"
                  checked={cityData.is_featured}
                  onChange={(e) =>
                    setCityData({
                      ...cityData,
                      is_featured: e.target.checked,
                    })
                  }
                  style={{
                    width: '10%',
                    padding: '8px',
                    marginBottom: '15px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                />
              </label>
              <GalleryUploader
                cityFormData={cityData}
                setCityFormData={setCityData}
                onUploadComplete={handleImageUpload}
                maxFiles={1}
              />
              <div className="modal-actions">
                <button type="submit" className="button bg-blue-1 text-white">
                  Update
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
    </>
  );
};

export default CityTable;