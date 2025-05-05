import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const DetailsAndPricing = ({
  venueFormData = {},
  handleVegDishDelete,
  handleNonVegDishDelete,
  handleSubmitNonVegDish,
  handleNonVegChange,
  nonVegDish,
  setNonVegDish,
  handleChange = () => {},
  allCategories = [],
  handleCategoryDropDownChange,
  vegDish,
  handleVegChange,
  handleSubmitVegDish,
  handleDropDownChange
}) => {
  // Render selected categories with their respective colors
  const renderSelectedCategory = () => {
    return venueFormData.venue_categories.length === 0 ? (
      "Select Categories"
    ) : (
      venueFormData.venue_categories.map((category) => (
        <div
          key={category.category_id}
          className={`py-5 px-15 mr-5 rounded-right-4 text-12 lh-16 fw-500 uppercase text-white`}
          style={{
            backgroundColor: category.category_color_class, // Apply the category's color
            width: "fit-content",
          }}
        >
          {category.category_name}
        </div>
      ))
    );
  };

  return (
    <div className="col-xl-10">
      <div className="text-18 fw-500 mb-10">Details & Pricing</div>
      <div className="row x-gap-20 y-gap-20">
        <div className="col-12">
          <ReactQuill
            value={venueFormData?.venue_overview}
            onChange={(text)=>{handleDropDownChange({name:"venue_overview",value:text})}}
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
            placeholder="Write overview for your Internship..."
          />
        </div>

        <div className="col-12">
            <div className="form-input ">
              <input
                type="text"
                required
                name="special_label"
                value={venueFormData?.special_label}
                onChange={handleChange}
              />
              <label className="lh-1 text-16 text-light-1">Responsibilities of the Intern:</label>
            </div>
          </div>
        <div className="col-12">
            <div className="form-input ">
              <input
                type="text"
                required
                name="special_label"
                value={venueFormData?.special_label}
                onChange={handleChange}
              />
              <label className="lh-1 text-16 text-light-1">Requirements</label>
            </div>
          </div>
        <div className="col-12">
            <div className="form-input ">
              <input
                type="text"
                required
                name="special_label"
                value={venueFormData?.special_label}
                onChange={handleChange}
              />
              <label className="lh-1 text-16 text-light-1">Perks</label>
            </div>
          </div>
        <div className="col-12">
            <div className="form-input ">
              <input
                type="text"
                required
                name="special_label"
                value={venueFormData?.special_label}
                onChange={handleChange}
              />
              <label className="lh-1 text-16 text-light-1">Eligibility</label>
            </div>
          </div>

        {/* Categories Dropdown */}
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
                  {renderSelectedCategory()}
                </span>
                <i className="icon icon-chevron-sm-down text-7 ml-10" />
              </div>
              <div className="toggle-element -dropdown w-100 dropdown-menu">
                <div className="text-14 y-gap-15 js-dropdown-list">
                  {allCategories.map((category, index) => (
                    <div
                      key={index}
                      id={category.category_id}
                      className={`js-dropdown-link`}
                      style={{
                        color: venueFormData?.venue_categories?.some(
                          (selectedCategory) =>
                            category.category_name === selectedCategory.category_name
                        )
                          ? category.category_color_class
                          : "inherit", // Highlight selected categories
                          flex: "0 0 130px", borderRadius: "0 15px 15px 0",
                      }}
                      onClick={() => {
                        handleCategoryDropDownChange(category);
                      }}
                    >
                      {category.category_name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12">
            <div className="form-input ">
              <input
                type="text"
                required
                name="special_label"
                value={venueFormData?.special_label}
                onChange={handleChange}
              />
              <label className="lh-1 text-16 text-light-1">Internship Type/Timing</label>
            </div>
          </div>
        <div className="col-12">
            <div className="form-input ">
              <input
                type="text"
                required
                name="special_label"
                value={venueFormData?.special_label}
                onChange={handleChange}
              />
              <label className="lh-1 text-16 text-light-1">Work Detail (Ex - 5 days)</label>
            </div>
          </div>

        {/* Remaining Form Elements */}
        <div className="col-6">
          <div className="form-input">
            <input
              type="number"
              required
              name="venue_rate"
              value={venueFormData?.venue_rate}
              onChange={handleChange}
            />
            <label className="lh-1 text-16 text-light-1">Internship Stipend</label>
          </div>
        </div>
        <div className="col-6">
          <div className="form-input">
            <input
              type="number"
              required
              name="venue_rate"
              value={venueFormData?.venue_rate}
              onChange={handleChange}
            />
            <label className="lh-1 text-16 text-light-1">Internship Duration in months</label>
          </div>
        </div>

      </div>
      <div className="border-top-light mt-30 mb-30" />
    </div>
  );
};

export default DetailsAndPricing;
