import { useState } from "react";
import "../../../../../../styles/modals.css";
import axios from "axios";
import { api } from "@/utils/apiProvider";
// import { showAlert } from "@/utils/isTextMatched";
import { useNavigate } from "react-router-dom";

const AddVenue = () => {
  const navigate = useNavigate();

  return (
    <div className="col-auto">
      {/* Add Venue Button */}
      <button
        className="button h-50 px-24 -dark-1 bg-blue-1 text-white"
        onClick={() => {navigate("/admin-dashboard/vendor/add")}}
      >
        Add Vendor <div className="icon-arrow-top-right ml-15"></div>
      </button>
    </div>
  );
};

export default AddVenue;