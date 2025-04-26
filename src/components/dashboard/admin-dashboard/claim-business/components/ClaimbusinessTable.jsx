import { useState, useEffect } from "react";
import axios from "axios";
import { api } from "@/utils/apiProvider";
// import { showAlert } from "@/utils/isTextMatched";
import ActionsButton from "./ActionsButton";
import {getClassOfStatus} from "@/utils/DOMUtils";
import { claimStateArray } from "@/constant/constants";

const ClaimbusinessTable = ({ searchParameter, refresh }) => {
  const [claims, setClaims] = useState([]);
  const [filteredClaims, setFilteredClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [claimData, setClaimData] = useState({
    claim_id: null,
    business_name: "",
    claimed_by: "",
    owner_name: "",
    user_type: "",
    status: "",
  });

  // // Fetch claims
  // const fetchClaims = async () => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const response = await axios.get(`${api}/api/claim/claims`);
  //     if (response.data.success) {
  //       setClaims(response.data.claims);
  //       setFilteredClaims(response.data.claims);
  //     } else {
  //       setError("Failed to fetch claims.");
  //     }
  //   } catch (err) {
  //     console.error("Error fetching claims:", err);
  //     setError("An error occurred while fetching claims.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchClaims();
  // }, [refresh]);

  // // Unified search logic
  // useEffect(() => {
  //   const lowercasedTerm = searchParameter.toLowerCase();
  //   const filtered = claims.filter((claim) =>
  //     claim.venue_or_vendor_name.toLowerCase().includes(lowercasedTerm) ||
  //     claim.user_name.toLowerCase().includes(lowercasedTerm)
  //   );
  //   setFilteredClaims(filtered);
  // }, [searchParameter]);

  // // Edit claim
  // const handleEdit = (claim) => {
  //   setClaimData({
  //     claim_id: claim.claim_id,
  //     venue_or_vendor_name: claim.business_name,
  //     user_name: claim.user_name,
  //     user_role: claim.user_role,
  //     status: claim.claim_status,
  //   });
  //   setEditMode(true);
  //   setShowModal(true);
  // };

  // // Update claim
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await axios.put(`${api}/api/claim/updateClaim`, {
  //       claim_id: claimData.claim_id,
  //       claim_status: claimData.status,
  //     });
  //     showAlert("Claim updated successfully.", "success");
  //     setShowModal(false);
  //     fetchClaims(); // Refresh claim list
  //   } catch (err) {
  //     console.error("Error updating claim:", err);
  //     showAlert(err.response?.data?.error || "An error occurred.", "error");
  //   }
  // };

  // // Delete claim
  // const handleDelete = async (claim_id) => {
  //   try {
  //     await axios.delete(`${api}/api/claim/deleteClaim`, { data: { claim_id } });
  //     showAlert("Claim deleted successfully.", "success");
  //     fetchClaims(); // Refresh claim list
  //   } catch (err) {
  //     console.error("Error deleting claim:", err);
  //     showAlert(err.response?.data?.error || "An error occurred.", "error");
  //   }
  // };

  // const renderClaimStatus = (item) => {
  //     return (
  //     <span style={{width:"max-content"}}className={`rounded-100 py-4 px-10 d-flex text-center text-14 fw-500 ${getClassOfStatus(item.claim_status)}`}>
  //       {item.claim_status}
  //     </span>)
  //   }

  //   const handleChange = (name,value) => {
  //     setClaimData((prevValue)=>{
  //       return {
  //         ...prevValue,
  //         [name] : value
  //       }
  //     })
  //   }

  return (
    <>
      <div className="tabs -underline-2 js-tabs">
        <div className="tabs__content pt-30 js-tabs-content">
          <div className="tabs__pane -tab-item-1 is-tab-el-active">
            {loading ? (
              <p>Loading claims...</p>
            ) : error ? (
              <p className="text-red-1">{error}</p>
            ) : filteredClaims.length === 0 ? (
              <p>No claims available.</p>
            ) : (
              <div className="overflow-scroll scroll-bar-1">
                <table className="table-3 -border-bottom col-12">
                  <thead className="bg-light-2">
                    <tr>
                      <th>Claimed Business Name</th>
                      <th>Claimed Business Phone No</th>
                      <th>Claimed Business Email</th>
                      <th>Claimed By - Name</th>
                      <th>Claimed By - Email</th>
                      <th>Claimed By - Role</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClaims.map((claim, index) => (
                      <tr key={index}>
                        <td>{claim.venue_or_vendor_name || "N/A"}</td>
                        <td>{claim.contact_number || "N/A"}</td>
                        <td>{claim.venue_or_vendor_email || "N/A"}</td>
                        <td>{claim.user_name || "N/A"}</td>
                        <td>{claim.user_email || "N/A"}</td>
                        <td>{claim.user_role || "N/A"}</td>
                        {/* <td>{claim.claim_status || "Pending"}</td> */}
                        <td>{renderClaimStatus(claim)}</td>
                        <td>
                          <ActionsButton
                            onEdit={() => handleEdit(claim)}
                            onDelete={() => handleDelete(claim.claim_id)}
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
      {/* Edit Claim Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editMode ? "Edit Claim" : "Add Claim"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="col-12">
                <div
                  className="form-input"
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "8px",
                  }}
                >
                  <div className="dropdown js-dropdown js-services-active w-100">
                    <div
                      className="dropdown__button d-flex items-center justify-between bg-white rounded-4 w-100 text-14 px-20 h-50 text-14"
                      data-bs-toggle="dropdown"
                      data-bs-auto-close="true"
                      aria-expanded="false"
                      data-bs-offset="0,10"
                    >
                      <span className="d-flex js-dropdown-title">
                        {claimData.status}
                      </span>
                      <i className="icon icon-chevron-sm-down text-7 ml-10" />
                    </div>
                    <div className="toggle-element -dropdown w-100 dropdown-menu">
                      <div className="text-14 y-gap-15 js-dropdown-list">
                        {claimStateArray.map((state, index) => (
                          <div
                            key={index}
                            id={state}
                            className={`${
                              claimData.status === state ? "text-blue-1" : ""
                            } js-dropdown-link`}
                            onClick={() => {
                              handleChange("status", state);
                            }}
                          >
                            {state}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div> <br></br>
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

export default ClaimbusinessTable;