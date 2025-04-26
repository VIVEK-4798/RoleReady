import { useState } from "react";
import "../../../../../../styles/modals.css";
import axios from "axios";
import { api } from "@/utils/apiProvider";
// import { showAlert } from "@/utils/isTextMatched";
import { useNavigate } from "react-router-dom";

const AddUser = ({ refreshUsers = () => {} }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    mobile: "",
    role: "customer", // Default role
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting user data:", userData);
      const response = await axios.post(`${api}/api/user/create-users`, userData);
      console.log("Response:", response);
      if (response.data.success === true) {
        showAlert("User added successfully.", "success");
        setUserData({
          name: "",
          email: "",
          mobile: "",
          role: "customer",
          password: "",
        });
        setShowModal(false);
        refreshUsers();
      } else {
        showAlert("Something went wrong.", "error");
      }
    } catch (error) {
      console.error("Error submitting user data:", error);
      showAlert(error.response?.data?.error || "An error occurred.", "error");
    }
  };

  return (
    <div className="col-auto">
      {/* Add User Button */}
      <button
        className="button h-50 px-24 -dark-1 bg-blue-1 text-white"
        onClick={() => {navigate("/admin-dashboard/user/add")}}
      >
        Add User
        <div className="icon-arrow-top-right ml-15"></div>
      </button>

      {/* Add User Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add User</h3>
            <form onSubmit={handleSubmit}>
              {/* Name */}
              <label>
                Name:
                <input
                  type="text"
                  value={userData.name}
                  onChange={(e) =>
                    setUserData((prevUserData) => ({
                      ...prevUserData,
                      name: e.target.value,
                    }))
                  }
                  required
                />
              </label>

              {/* Email */}
              <label>
                Email:
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) =>
                    setUserData((prevUserData) => ({
                      ...prevUserData,
                      email: e.target.value,
                    }))
                  }
                  required
                />
              </label>

              {/* Mobile */}
              <label>
                Mobile:
                <input
                  type="text"
                  value={userData.mobile}
                  onChange={(e) =>
                    setUserData((prevUserData) => ({
                      ...prevUserData,
                      mobile: e.target.value,
                    }))
                  }
                  required
                />
              </label>

              {/* Role */}
              <label>
                Role:
                <select
                  value={userData.role}
                  onChange={(e) =>
                    setUserData((prevUserData) => ({
                      ...prevUserData,
                      role: e.target.value,
                    }))
                  }
                  required
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                  <option value="vendor">Vendor</option>
                </select>
              </label>

              {/* Password */}
              <label>
                Password:
                <input
                  type="password"
                  value={userData.password}
                  onChange={(e) =>
                    setUserData((prevUserData) => ({
                      ...prevUserData,
                      password: e.target.value,
                    }))
                  }
                  required
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

export default AddUser;