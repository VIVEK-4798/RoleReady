import { useState, useEffect } from "react";
import axios from "axios";
import ActionsButton from "./ActionsButton";
import { api } from "@/utils/apiProvider";
// import { showAlert } from "@/utils/isTextMatched";
import { useNavigate } from "react-router-dom";
import { getId } from "@/utils/DOMUtils";
import "../../../../../styles/modals.css";
import Pagination from "@/components/hotel-list/common/Pagination";

const VendorTable = ({ searchParameter = "", refresh }) => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({ page: 1, limit: 10 }); 

  const fetchVendors = async () => {
    setLoading(true);
    setError(null); 
    try {
      const response = await axios.get(`${api}/api/vendor/get-vendors`,{
        headers: {
          id:  getId()
        },
        params : {
          ...searchParams,
          search : searchParameter
        }
      });
      if (response.data.success) {
        setVendors(response.data);
      } else {
        setError("Failed to fetch vendors.");
        showAlert("Failed to fetch vendors");
      }
    } catch (err) {
      setError("An error occurred while fetching vendors.");
      showAlert("An error occurred while fetching vendors");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [refresh]);

  // Handle Search
  useEffect(() => {
    fetchVendors()
  }, [searchParameter,searchParams]);

  const handleEdit = (vendor) => {
    navigate("/admin-dashboard/vendor/edit",{state: vendor});
  };

  const handleDelete = async (id) => {
      try {
        await axios.delete(`${api}/api/vendor/delete-vendor/${id}`);
        showAlert("Vendor deleted successfully.","success");
        fetchVendors(); // Refresh venues list
      } catch (error) {
        console.error("Error deleting vendor:", error);
        showAlert(error.response?.data?.error || "An error occurred.","error");
      }
  };

  return (
    <>
      <div className="tabs -underline-2 js-tabs">
        <div className="tabs__content pt-30 js-tabs-content">
          <div className="tabs__pane -tab-item-1 is-tab-el-active">
            {loading ? (
              <p>Loading vendor...</p>
            ) : error ? (
              <p className="text-red-1">{error}</p>
            ) : vendors.results.length === 0 ? (
              <p>No vendor available.</p>
            ) : (
              <div className="overflow-scroll scroll-bar-1">
                <table className="table-3 -border-bottom col-12">
                  <thead className="bg-light-2">
                    <tr>
                      <th>Vendor Name</th>
                      <th>City Name</th>
                      <th>Region Name</th>
                      <th>Service Rate</th>
                      <th>Service Category</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendors.results.map((vendor, index) => (
                      <tr key={index}>
                        <td>{vendor.vendor_name} </td>
                        <td>{vendor.city_name || "N/A"}</td>
                        <td>{vendor.region_name || "N/A"}</td>
                        <td>{vendor.vendor_rate || "N/A"}</td>
                        <td>{vendor.vendor_service || "N/A"}</td>
                        <td
                          className={
                            vendor.is_enable
                              ? "status-published"
                              : "status-draft"
                          }
                        >
                          {vendor.is_enable ? "Published" : "Draft"}
                        </td>
                        <td>
                          <ActionsButton
                            onEdit={() => handleEdit(vendor)} // Handle Edit
                            onDelete={() => handleDelete(vendor.service_reg_id)} // Handle Delete
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
        <Pagination totalPages={vendors?.pagination?.totalPages} setSearchParams={setSearchParams}/>
      </div>
    </>
  );
};

export default VendorTable;