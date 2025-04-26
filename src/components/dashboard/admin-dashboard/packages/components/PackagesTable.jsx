import { useState, useEffect } from "react";
import axios from "axios";
// import Pagination from "../../common/Pagination";
import ActionsButton from "./ActionsButton";
import { api } from "@/utils/apiProvider";
// import { showAlert } from "@/utils/isTextMatched";
import GalleryUploader from "./filter-box/GalleryUploader";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import styles for the editor

const PackagesTable = ({ searchParameter, refresh }) => {
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [packageData, setPackageData] = useState({
    package_id: null,
    package_name: "",
    package_description: "",
    package_price: "",
    booking_limit: "",
    validity_days: "",
    package_image: [],
    new_image: null,
    is_featured: false,
  });

  // Fetch packages
  const fetchPackages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${api}/api/package/get-packages`);
      if (response.data.success) {
        setPackages(response.data.results);
        setFilteredPackages(response.data.results);
      } else {
        setError("Failed to fetch packages.");
      }
    } catch (err) {
      console.error("Error fetching packages:", err);
      setError("An error occurred while fetching packages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [refresh]);

  // Unified Search Logic
  useEffect(() => {
    const lowercasedTerm = searchParameter.toLowerCase();
    const filtered = packages.filter((pkg) =>
      pkg.package_name.toLowerCase().includes(lowercasedTerm)
    );
    setFilteredPackages(filtered);
  }, [searchParameter]);

  // Edit package
  const handleEdit = (pkg) => {
    setPackageData({
      package_id: pkg.package_id,
      package_name: pkg.package_name,
      package_description: pkg.package_description || "",
      package_price: pkg.package_price,
      package_image: JSON.parse(pkg.package_image || "[]"),
      new_image: null,
      is_featured: pkg.is_featured || false,
      booking_limit: pkg.booking_limit || "",
      validity_days: pkg.validity_days || "",
    });
    setEditMode(true);
    setShowModal(true);
  };

  // Update package
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${api}/api/package/update-package/${packageData.package_id}`,
        {
          ...packageData,
          package_image: JSON.stringify(packageData.package_image),
        }
      );

      showAlert("Package updated successfully.", "success");
      setShowModal(false);
      fetchPackages();
    } catch (error) {
      console.error("Error updating package:", error);
      showAlert(error.response?.data?.error || "An error occurred.", "error");
    }
  };

  // Delete package
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${api}/api/package/delete-package/${id}`);
      showAlert("Package deleted successfully.", "success");
      fetchPackages();
    } catch (error) {
      console.error("Error deleting package:", error);
      showAlert(error.response?.data?.error || "An error occurred.", "error");
    }
  };

  // Handle new image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPackageData((prevPackageData) => ({
        ...prevPackageData,
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
              <p>Loading packages...</p>
            ) : error ? (
              <p className="text-red-1">{error}</p>
            ) : filteredPackages.length === 0 ? (
              <p>No packages available.</p>
            ) : (
              <div className="overflow-scroll scroll-bar-1">
                <table className="table-3 -border-bottom col-12">
                  <thead className="bg-light-2">
                    <tr>
                      <th>Package Name</th>
                      <th>Description</th>
                      <th>Price</th>
                      <th>Image</th>
                      <th>Featured</th>
                      <th>Bookings Limit</th>
                      <th>Validity (in days)</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPackages.map((pkg, index) => (
                      <tr key={index}>
                        <td>{pkg.package_name || "N/A"}</td>
                        <td>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: pkg.package_description || "N/A",
                            }}
                          />
                        </td>
                        <td>₹ {pkg.package_price || "0"}</td>
                        <td>
                          <img
                            src={
                              pkg.package_image
                                ? JSON.parse(pkg.package_image)[0]
                                : "placeholder-image-url"
                            }
                            alt={pkg.package_name || "Package"}
                            style={{ width: "50px", height: "50px" }}
                          />
                        </td>
                        <td>{pkg.is_featured ? "Yes" : "No"}</td>
                        <td>{pkg.booking_limit}</td>
                        <td>{pkg.validity_days}</td>
                        <td>
                          <ActionsButton
                            item={pkg}
                            onEdit={() => handleEdit(pkg)}
                            onDelete={() => handleDelete(pkg.package_id)}
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

      {/* Edit Package Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal-content w-[500px] h-[80vh] overflow-y-auto p-5 bg-white rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{editMode ? "Edit Package" : "Add Package"}</h3>
            <form onSubmit={handleSubmit}>
              <label>
                Package Name:
                <input
                  type="text"
                  value={packageData.package_name}
                  onChange={(e) =>
                    setPackageData({
                      ...packageData,
                      package_name: e.target.value,
                    })
                  }
                  required
                />
              </label>
              <label>
                Description:
                <ReactQuill
                  value={packageData.package_description}
                  onChange={(text) => {
                    setPackageData((prev) => ({
                      ...prev,
                      package_description: text,
                    }));
                  }}
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, false] }],
                      ["bold", "italic", "underline", "strike"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link"],
                      ["clean"],
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
                Booking Limit:
                <input
                  type="number"
                  value={packageData.booking_limit}
                  onChange={(e) =>
                    setPackageData({
                      ...packageData,
                      booking_limit: e.target.value,
                    })
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
                    setPackageData({
                      ...packageData,
                      validity_days: e.target.value,
                    })
                  }
                  required
                />
              </label>
              <label>
                Price:
                <input
                  type="number"
                  value={packageData.package_price}
                  onChange={(e) =>
                    setPackageData({
                      ...packageData,
                      package_price: e.target.value,
                    })
                  }
                  required
                />
              </label>
              <label>
                Marked as Recommended:
                <input
                  type="checkbox"
                  checked={packageData.is_featured}
                  onChange={(e) =>
                    setPackageData({
                      ...packageData,
                      is_featured: e.target.checked,
                    })
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

export default PackagesTable;
