import { useState } from "react";
import "../../../../../../styles/modals.css";
import axios from "axios";
import { api } from "@/utils/apiProvider";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import GalleryUploader from "./GalleryUploader";

const AddCity = ({ refreshCity = () => {} }) => {
  const [showModal, setShowModal] = useState(false);
  const [cityData, setCityData] = useState({
    city_name: "",
    city_address: "",
    city_image: [],
    is_featured: false,
  });

  const handleImageUpload = (uploadedImages) => {
    setCityData((prevCityData) => ({
      ...prevCityData,
      city_image: uploadedImages,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${api}/api/city/add-city`,
        { ...cityData, city_image: JSON.stringify(cityData.city_image) }
      );

      if (response.data.success === true) {
        toast.success("City added successfully.");
        setCityData({
          city_name: "",
          city_address: "",
          city_image: [],
          is_featured: false,
        });
        setShowModal(false);
        refreshCity();
      } else {
        toast.error("Something went wrong.");
      }
    } catch (error) {
      console.error("Error submitting city data:", error);
      toast.error(error.response?.data?.error || "An error occurred.");
    }
  };

  return (
    <div className="col-auto">
      <button
        className="button h-50 px-24 -dark-1 bg-blue-1 text-white"
        onClick={() => setShowModal(true)}
      >
        Add City
        <div className="icon-arrow-top-right ml-15"></div>
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add City</h3>
            <form onSubmit={handleSubmit}>
              <label>
                City Name:
                <input
                  type="text"
                  value={cityData.city_name}
                  onChange={(e) =>
                    setCityData((prevCityData) => ({
                      ...prevCityData,
                      city_name: e.target.value,
                    }))
                  }
                  required
                />
              </label>
              <label>
                City Address:
                <input
                  type="text"
                  value={cityData.city_address}
                  onChange={(e) =>
                    setCityData((prevCityData) => ({
                      ...prevCityData,
                      city_address: e.target.value,
                    }))
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
                    setCityData((prevCityData) => ({
                      ...prevCityData,
                      is_featured: e.target.checked,
                    }))
                  }
                  style={{
                    width: "10%",
                    padding: "8px",
                    marginBottom: "15px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    cursor: "pointer",
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

      {/* Toast Container (only needs to appear once per app, can be removed here if already globally added) */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AddCity;
