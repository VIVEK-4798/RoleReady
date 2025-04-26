import { useState } from "react";
import "../../../../../../styles/modals.css";
import axios from "axios";
import { SketchPicker } from "react-color"; 
import { api } from "@/utils/apiProvider";
// import { showAlert } from "@/utils/isTextMatched";

const AddCategory = ({ refreshCategories = () => {} }) => {
  const [showModal, setShowModal] = useState(false);
  const [categoryData, setCategoryData] = useState({
    category_name: "",
    category_color_class: "",
  });

  const [selectedColor, setSelectedColor] = useState("#007bff"); // Default color

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${api}/api/categories/create-categories`, {
        ...categoryData,
        category_color_class: selectedColor, // Use the selected color
      });

      if (response.data.success === true) {
        showAlert("Category added successfully.", "success");
        setCategoryData({
          category_name: "",
          category_color_class: "",
        });
        setSelectedColor("#007bff"); // Reset color picker
        setShowModal(false);
        refreshCategories(); // Refresh the category list after adding
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
      {/* Add Category Button */}
      <button
        className="button h-50 px-24 -dark-1 bg-blue-1 text-white"
        onClick={() => setShowModal(true)}
      >
        Add Category <div className="icon-arrow-top-right ml-15"></div>
      </button>

      {/* Add Category Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add Venue Category</h3>
            <form onSubmit={handleSubmit}>
              <label>
                Category Name:
                <input
                  type="text"
                  value={categoryData.category_name}
                  onChange={(e) =>
                    setCategoryData({ ...categoryData, category_name: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Select Category Badge Color:
                <div style={{ marginTop: "10px", marginBottom: "20px" }}>
                  {/* Color Picker */}
                  <SketchPicker
                    color={selectedColor}
                    onChangeComplete={(color) => setSelectedColor(color.hex)} // Update selected color
                  />
                </div>
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

export default AddCategory;
