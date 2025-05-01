import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { api } from "@/utils/apiProvider";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const SignUpForm = () => {
  const navigate = useNavigate(); 
  // Initialize the formData state to handle form inputs
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user", // default role
    mobile: "", // Optional, if mobile is required
    image: "", // Optional image field
  });

  // Handle change in form fields and update the state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
  
    // Prepare the payload for the API request
    const userData = {
      name: `${formData.firstName} ${formData.lastName}`,
      mobile: formData.mobile,
      email: formData.email,
      role: formData.role,
      password: formData.password,
      image: formData.image || null, // Optional image
    };
    console.log(userData);
  
    try {
      // Send POST request to create a new user
      const response = await axios.post(`${api}/api/user/create-users`, userData);
  
      // Show success toast notification
      toast.success("User created successfully!");
  
      navigate('/login');
    } catch (error) {
      if (error.response) {
        // Log error response for debugging
        console.error("Error creating user:", error.response.data);
        toast.error(error.response.data.error || "An error occurred, please try again later.");
      } else {
        // Handle network or other errors
        console.error("Network error:", error.message);
        toast.error("Network error: An error occurred, please try again later.");
      }
    }
  };
  

  return (
    <form className="row y-gap-20" onSubmit={handleSubmit}>
      <div className="col-12">
        <h1 className="text-22 fw-500">Create an account</h1>
        <p className="mt-10">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-1">
            Log in
          </Link>
        </p>
      </div>

      {/* Role Dropdown */}
      <div className="col-12">
        <label>Select Role:</label>
        <div className="form-input">
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="user">User</option>
            <option value="mentor">Mentor</option>
          </select>
        </div>
      </div>

      {/* First Name */}
      <div className="col-12">
        <div className="form-input">
          <input
            type="text"
            name="firstName"
            required
            value={formData.firstName}
            onChange={handleChange}
          />
          <label className="lh-1 text-14 text-light-1">First Name</label>
        </div>
      </div>

      {/* Last Name */}
      <div className="col-12">
        <div className="form-input">
          <input
            type="text"
            name="lastName"
            required
            value={formData.lastName}
            onChange={handleChange}
          />
          <label className="lh-1 text-14 text-light-1">Last Name</label>
        </div>
      </div>

      {/* Email */}
      <div className="col-12">
        <div className="form-input">
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
          />
          <label className="lh-1 text-14 text-light-1">Email</label>
        </div>
      </div>

      {/* Password */}
      <div className="col-12">
        <div className="form-input">
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
          />
          <label className="lh-1 text-14 text-light-1">Password</label>
        </div>
      </div>

      {/* Confirm Password */}
      <div className="col-12">
        <div className="form-input">
          <input
            type="password"
            name="confirmPassword"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <label className="lh-1 text-14 text-light-1">Confirm Password</label>
        </div>
      </div>

      {/* Mobile Number */}
      <div className="col-12">
        <div className="form-input">
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Mobile Number"
          />
          <label className="lh-1 text-14 text-light-1">Mobile Number</label>
        </div>
      </div>

      {/* Promotions Checkbox */}
      <div className="col-12">
        <div className="d-flex">
          <div className="form-checkbox mt-5">
            <input type="checkbox" name="promotions" />
            <div className="form-checkbox__mark">
              <div className="form-checkbox__icon icon-check" />
            </div>
          </div>
          <div className="text-15 lh-15 text-light-1 ml-10">
            Email me exclusive promotions. I can opt out later.
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="col-12">
        <button
          type="submit"
          className="button py-20 -dark-1 bg-blue-1 text-white w-100"
        >
          Sign Up <div className="icon-arrow-top-right ml-15" />
        </button>
      </div>
    </form>
  );
};

export default SignUpForm;
