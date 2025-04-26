import { useState } from "react";
import "../../../../../../styles/modals.css";
import axios from "axios";
import { api } from "@/utils/apiProvider";
// import { showAlert } from "@/utils/isTextMatched";
import GalleryUploader from "./GalleryUploader";
// import "react-quill/dist/quill.snow.css";
// import ReactQuill from "react-quill";

const AddPackage = ({ refreshPackage = () => {} }) => {
  const [showModal, setShowModal] = useState(false);
  const [packageData, setPackageData] = useState({
    package_name: "",
    package_description: "",
    package_price: "",
    booking_limit: "",
    validity_days: "",
    package_image: [],
    is_featured: false,
  });

  const handleImageUpload = (uploadedImages) => {
    setPackageData((prevPackageData) => ({
      ...prevPackageData,
      package_image: uploadedImages,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting package data:", packageData);
      const response = await axios.post(`${api}/api/package/add-package`, {
        ...packageData,
        package_image: JSON.stringify(packageData.package_image),
      });
      console.log("Response:", response);
      if (response.data.success === true) {
        showAlert("Package added successfully.", "success");
        setPackageData({
          package_name: "",
          package_description: "",
          package_price: "",
          booking_limit: "",
          validity_days: "",
          package_image: [],
          is_featured: false,
        });
        setShowModal(false);
        refreshPackage();
      } else {
        showAlert("Something went wrong.", "error");
      }
    } catch (error) {
      console.error("Error submitting package data:", error);
      showAlert(error.response?.data?.error || "An error occurred.", "error");
    }
  };

  return (
    <div className="col-auto">
      {/* Add Package Button */}
      <button
        className="button h-50 px-24 -dark-1 bg-blue-1 text-white"
        onClick={() => setShowModal(true)}
      >
        Add Package
        <div className="icon-arrow-top-right ml-15"></div>
      </button>

      {/* Add Package Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add Package</h3>
            <form onSubmit={handleSubmit}>
              <label>
                Package Name:
                <input
                  type="text"
                  value={packageData.package_name}
                  onChange={(e) =>
                    setPackageData((prevPackageData) => ({
                      ...prevPackageData,
                      package_name: e.target.value,
                    }))
                  }
                  required
                />
              </label>
              <label>
                Description:
                <ReactQuill
                  value={packageData.package_description}
                  onChange={(text) =>
                    setPackageData({
                      ...packageData,
                      package_description: text,
                    })
                  }
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, false] }], // Headings
                      ["bold", "italic", "underline", "strike"], // Formatting buttons
                      [{ list: "ordered" }, { list: "bullet" }], // Lists
                      ["link"], // Links
                      ["clean"], // Remove formatting
                    ],
                  }}
                  formats={[
                    "header",
                    "bold",
                    "italic",
                    "underline",
                    "strike",
                    "list",
                    "bullet",
                    "link",
                  ]}
                  placeholder="Write package description..."
                />
              </label>
              <label>
                Price (₹):
                <input
                  type="number"
                  value={packageData.package_price}
                  onChange={(e) =>
                    setPackageData((prevPackageData) => ({
                      ...prevPackageData,
                      package_price: e.target.value,
                    }))
                  }
                  required
                />
              </label>
              <label>
                Bookings Limit:
                <input
                  type="number"
                  value={packageData.booking_limit}
                  onChange={(e) =>
                    setPackageData((prevPackageData) => ({
                      ...prevPackageData,
                      booking_limit: e.target.value,
                    }))
                  }
                  required
                />
              </label>
              <label>
                Validity (in days):
                <input
                  type="number"
                  value={packageData.validity_days}
                  onChange={(e) =>
                    setPackageData((prevPackageData) => ({
                      ...prevPackageData,
                      validity_days: e.target.value,
                    }))
                  }
                  required
                />
              </label>
              <label>
                Is Featured
                <input
                  type="checkbox"
                  checked={packageData.is_featured}
                  onChange={(e) =>
                    setPackageData((prevPackageData) => ({
                      ...prevPackageData,
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
                packageFormData={packageData}
                setpackageFormData={setPackageData}
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
    </div>
  );
};

export default AddPackage;
