import { useState } from "react";
import Education from "./location/Education";
import Health from "./location/Health";
import Location from "./location/Location";
import Sorroundings from "./location/Sorroundings";
import Transportation from "./location/Transportation";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const DetailsAndPricing = ({
  vendorData,
  handleComponentDelete,
  handleNonVegDishDelete,
  handleSubmitNonVegDish,
  handleNonVegChange,
  nonVegDish,
  setNonVegDish,
  handleChange = () => {},
  services = [],
  handleServiceDropDownChange,
  component,
  handleComponentChange,
  handleSubmitComponent,
  handleDropDownChange
}) => {
  const [errors, setErrors] = useState({});

  const validateFields = () => {
    const validationErrors = {};
    if (!component?.component_name?.trim()) {
      validationErrors.component_name = "Component Name is required.";
    }
    if (!component?.component_remark?.trim()) {
      validationErrors.component_remark = "Remark is required.";
    }
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validateFields()) {
      handleSubmitComponent();
    }
  };

  const renderSelectedService = () => {
    return vendorData?.vendor_service !== "" ? (
      <div
        className={`py-5 px-15 mr-5 bg-blue-1 rounded-right-4 text-12 lh-16 fw-500 uppercase text-white`}
        style={{ width: "fit-content" }}
      >
        {vendorData?.vendor_service}
      </div>
    ) : (
      <div>Select Service Category</div>
    );
  };

  return (
    <div className="col-xl-10">
      <div className="text-18 fw-500 mb-10">Details & Pricing</div>
      <div className="row x-gap-20 y-gap-20">
        <div className="col-12">
          <div className="col-12">
            <ReactQuill
              value={vendorData?.vendor_overview}
              onChange={(text)=>{handleDropDownChange({name:"vendor_overview",value:text})}}
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
              placeholder="Write overview your venue..."
            />
          </div>
        </div>
        {/* // need to render this tags dynamic */}
        <div className="col-12">
          <div
            className="form-input"
            style={{ border: "1px solid #ccc", borderRadius: "4px", padding: "8px" }}
          >
            <div className="dropdown js-dropdown js-services-active w-100">
              <div
                className="dropdown__button d-flex items-center justify-between bg-white rounded-4 w-100 text-14 px-20 h-50 text-14"
                data-bs-toggle="dropdown"
                data-bs-auto-close="true"
                aria-expanded="false"
                data-bs-offset="0,10"
              >
                <span className="d-flex js-dropdown-title">{renderSelectedService()}</span>
                <i className="icon icon-chevron-sm-down text-7 ml-10" />
              </div>
              <div className="toggle-element -dropdown w-100 dropdown-menu">
                <div className="text-14 y-gap-15 js-dropdown-list">
                  {services.map((service, index) => (
                    <div
                      key={index}
                      id={service.service_id}
                      className={service.service_name === vendorData.vendor_service ? "text-blue-1" : ""}
                      onClick={() => {
                        handleServiceDropDownChange(service);
                      }}
                    >
                      {service.service_name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6">
          <div className="form-input">
            <input
              type="number"
              required
              name="vendor_rate"
              value={vendorData?.vendor_rate}
              onChange={handleChange}
            />
            <label className="lh-1 text-16 text-light-1">{vendorData?.vendor_service} Package Price</label>
          </div>
        </div>
      </div>
      <div className="border-top-light mt-30 mb-30" />
      <div className="mt-30">
        <div className="fw-500 mb-20">Package Details</div>
        <div className="overflow-scroll scroll-bar-1">
          <table className="table-5 -border-bottom col-12">
            <thead className="bg-light-2">
              <tr>
                <th>Component</th>
                <th>Remark</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {vendorData.vendor_package.map((item) => {
                return (
                  <tr key={item.id}>
                    <td className="col-4">
                      <div className="form-input">
                        <label style={{ top: "10px" }} className="lh-1 text-16 text-light-1">
                          {item.component_name}
                        </label>
                      </div>
                    </td>
                    <td className="col-4">
                      <div className="form-input">
                        <label style={{ top: "10px" }} className="lh-1 text-16 text-light-1">
                          {item.component_remark}
                        </label>
                      </div>
                    </td>
                    <td className="col-auto">
                      <button
                        className="flex-center bg-light-2 rounded-4 size-35"
                        onClick={() => {
                          handleComponentDelete(item.id);
                        }}
                      >
                        <i className="icon-trash-2 text-16 text-light-1" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <form onSubmit={handleFormSubmit}>
        <div className="d-flex justify-between">
          <div className="col-4">
            <div className="form-input">
              <input
                type="text"
                required
                name="component_name"
                value={component?.component_name}
                onChange={handleComponentChange}
              />
              <label className="lh-1 text-16 text-light-1">Component Name</label>
              {errors.component_name && <p className="text-red-1">{errors.component_name}</p>}
            </div>
          </div>
          <div className="col-4">
            <div className="form-input">
              <input
                type="text"
                required
                name="component_remark"
                value={component?.component_remark}
                onChange={handleComponentChange}
              />
              <label className="lh-1 text-16 text-light-1">Remark</label>
              {errors.component_remark && <p className="text-red-1">{errors.component_remark}</p>}
            </div>
          </div>
          <button
            type="submit"
            className="button col-3 -md -blue-1 bg-blue-1-05 text-blue-1 mt-20"
          >
            Add Item
          </button>
        </div>
      </form>
    </div>
  );
};

export default DetailsAndPricing;
