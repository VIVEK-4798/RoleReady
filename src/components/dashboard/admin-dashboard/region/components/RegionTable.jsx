import { useState, useEffect } from "react";
import axios from "axios";
// import Pagination from "../../common/Pagination";
import ActionsButton from "./ActionsButton";
import { api } from "@/utils/apiProvider";
// import { showAlert } from "@/utils/isTextMatched";

const RegionTable = ({ searchParameter, refresh}) => {
  const [regions, setRegions] = useState([]);
  const [filteredRegions, setFilteredRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [regionData, setRegionData] = useState({
    region_id: null,
    region_name: "",
    region_pincode: "",
    city_id: "",
  });

  const fetchRegions = async () => {
    setLoading(true);
    setError(null);
    try {
      const [regionResponse, cityResponse] = await Promise.all([
        axios.get(`${api}/api/region/get-regions`),
        axios.get(`${api}/api/city/get-city`),
      ]);

      if (regionResponse.data.success) {
        setRegions(regionResponse.data.results);
        setFilteredRegions(regionResponse.data.results); // Set both main and filtered data
      } else {
        setError("Failed to fetch regions.");
      }

      if (cityResponse.data.success) {
        setCities(cityResponse.data.results);
      }
    } catch (err) {
      setError("An error occurred while fetching data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegions();
  }, [refresh]);

  // Handle Search
  useEffect(() => {
    const lowercasedTerm = searchParameter.toLowerCase();
    const filtered = regions.filter((region) => {
      const cityName = cities.find((city) => city.city_id === region.city_id)?.city_name || "";
      return (
        region.region_name.toLowerCase().includes(lowercasedTerm) ||
        region.region_pincode.toLowerCase().includes(lowercasedTerm) ||
        cityName.toLowerCase().includes(lowercasedTerm)
      );
    });
    setFilteredRegions(filtered);
  }, [searchParameter, regions, cities]);

  // Handle Edit
  const handleEdit = (region) => {
    setRegionData({
      region_id: region.region_id,
      region_name: region.region_name,
      region_pincode: region.region_pincode,
      city_id: region.city_id,
    });
    setEditMode(true);
    setShowModal(true);
  };

  // Handle Submit (Update or Add Region)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(
          `${api}/api/region/update-regions/${regionData.region_id}`,
          regionData
        );
        showAlert("Region updated successfully.", "success");
        setShowModal(false);
        fetchRegions();
      }
    } catch (error) {
      console.error("Error saving region:", error);
      showAlert(error.response?.data?.error || "An error occurred.","error");
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
      try {
        await axios.delete(`${api}/api/region/delete-regions/${id}`);
        showAlert("Region deleted successfully.","success");
        fetchRegions();
      } catch (error) {
        console.error("Error deleting region:", error);
        showAlert(error.response?.data?.error || "An error occurred.","error");
      }
  };

  return (
    <>
      <div className="tabs -underline-2 js-tabs">
        <div className="tabs__content pt-30 js-tabs-content">
          <div className="tabs__pane -tab-item-1 is-tab-el-active">
            {loading ? (
              <p>Loading regions...</p>
            ) : error ? (
              <p className="text-red-1">{error}</p>
            ) : filteredRegions.length === 0 ? (
              <p>No regions available.</p>
            ) : (
              <div className="overflow-scroll scroll-bar-1">
                <table className="table-3 -border-bottom col-12">
                  <thead className="bg-light-2">
                    <tr>
                      <th>Region Name</th>
                      <th>City Name</th>
                      <th>Pincode</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRegions.map((region, index) => (
                      <tr key={index}>
                        <td>{region.region_name || "N/A"}</td>
                        <td>
                          {cities.find((city) => city.city_id === region.city_id)?.city_name ||
                            "N/A"}
                        </td>
                        <td>{region.region_pincode || "N/A"}</td>
                        <td>
                          <ActionsButton
                            onEdit={() => handleEdit(region)}
                            onDelete={() => handleDelete(region.region_id)}
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
      {/* Edit/Add Region Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editMode ? "Edit Region" : "Add Region"}</h3>
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
                Pincode:
                <input
                  type="text"
                  value={regionData.region_pincode}
                  onChange={(e) =>
                    setRegionData({ ...regionData, region_pincode: e.target.value })
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
    </>
  );
};

export default RegionTable;