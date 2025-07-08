import { useState } from "react";
import ActionsButton from "../components/ActionsButton";
import {
  convertISOToDateFormat,
  getClassOfStatus,
  isAdminLoggedIn,
  isVendorLoggedIn,
  isVenueLoggedIn
} from "@/utils/DOMUtils";
import Pagination from "@/components/hotel-list/common/Pagination";

const BookingTable = ({
  tabItems,
  setShowModal,
  data = [],
  setSearchParams,
  update,
  setBookingData,
  filterData,
  setFilterData,
  setUpdate
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index, tab = "") => {
    setActiveTab(index);
    setSearchParams((prev) => ({
      ...prev,
      tab: tab === "All Booking" ? "" : tab
    }));
  };

  const renderBookingStatus = (item) => (
    <span
      style={{ width: "max-content" }}
      className={`rounded-100 py-4 px-10 d-flex text-center text-14 fw-500 ${getClassOfStatus(item.status)}`}
    >
      {item.status}
    </span>
  );

  const isVendor = isVendorLoggedIn();
  const isVenue = isVenueLoggedIn();
  const isAdmin = isAdminLoggedIn();

  return (
    <>
      <div className="tabs -underline-2 js-tabs">
        <div className="tabs__controls row x-gap-40 y-gap-10 lg:x-gap-20 js-tabs-controls">
          {tabItems.map((item, index) => (
            <div className="col-auto" key={index}>
              <button
                className={`tabs__button text-18 lg:text-16 text-light-1 fw-500 pb-5 lg:pb-0 js-tabs-button ${
                  activeTab === index ? "is-tab-el-active" : ""
                }`}
                onClick={() => handleTabClick(index, item)}
              >
                {item}
              </button>
            </div>
          ))}
        </div>

        <div className="tabs__content pt-30 js-tabs-content">
          <div className="tabs__pane -tab-item-1 is-tab-el-active">
            <div className="overflow-scroll scroll-bar-1">
              <table className="table-3 -border-bottom col-12">
                <thead className="bg-light-2">
                  <tr>
                    <th>Applicant Name</th>
                    <th>Applicant Phone No</th>
                    {(isVendor || isAdmin) && <th>Type</th>}
                    {(isVenue || isAdmin) && <th>Application Submitted Date</th>}
                    {(isVenue || isAdmin) && <th>Opportunity Stream</th>}
                    <th>Company</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filterData.results &&
                    filterData.results.map((item) => (
                      <tr key={item.booking_id}>
                        <td>{item?.applicant_name}</td>
                        <td>{item?.applicant_phone}</td>

                        {(isVendor || isAdmin) && (
                          <td>
                            {item?.type === "venue"
                              ? "Internship"
                              : item?.type === "vendor"
                              ? "Job"
                              : "N/A"}
                          </td>
                        )}

                        {(isVenue || isAdmin) && (
                          <td>{convertISOToDateFormat(item?.appointment_date)}</td>
                        )}

                        {(isVenue || isAdmin) && (
                          <td>
                            {item?.type === "venue"
                              ? item?.venue_name
                              : item?.vendor_name}
                          </td>
                        )}

                        <td className="fw-500">
                          {item?.type === "venue"
                            ? item?.venue_address || "N/A"
                            : item?.vendor_address || "N/A"}
                        </td>

                        <td>{renderBookingStatus(item)}</td>

                        <td>
                          <ActionsButton
                            booking={item}
                            setShowModal={setShowModal}
                            setBookingData={setBookingData}
                            update={update}
                            setUpdate={setUpdate}
                          />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Uncomment if needed */}
          {/* <Pagination totalPages={data?.pagination?.totalPages} setSearchParams={setSearchParams}/> */}
        </div>
      </div>
    </>
  );
};

export default BookingTable;
