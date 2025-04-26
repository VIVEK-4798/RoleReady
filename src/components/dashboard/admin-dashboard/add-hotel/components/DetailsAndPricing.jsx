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
            placeholder="Write overview your venue..."
          />
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
            <label className="lh-1 text-16 text-light-1">Venue Rate</label>
          </div>
        </div>

        <div className="col-6">
          <div className="form-input">
            <input
              type="number"
              required
              name="veg_package_price"
              value={venueFormData?.veg_package_price}
              onChange={handleChange}
            />
            <label className="lh-1 text-16 text-light-1">Veg Package Price</label>
          </div>
        </div>

        <div className="col-6">
          <div className="form-input">
            <input
              type="number"
              required
              name="non_veg_package_price"
              value={venueFormData?.non_veg_package_price}
              onChange={handleChange}
            />
            <label className="lh-1 text-16 text-light-1">Non-Veg Package Price</label>
          </div>
        </div>
      </div>
      <div className="border-top-light mt-30 mb-30" />
      <div className="mt-30">
        <div className="fw-500 mb-20">Veg Package Details</div>
        <div className="overflow-scroll scroll-bar-1">
          <table className="table-5 -border-bottom col-12">
            <thead className="bg-light-2">
              <tr>
                <th>Dish Name</th>
                <th>Quantity</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {venueFormData.veg_package.map((dish)=>{
                return (
                  <tr>
                    <td className="col-4">
                      <div className="form-input ">
                        <label style={{top:"10px"}} className="lh-1 text-16 text-light-1">
                          {dish.dish_name}
                        </label>
                      </div>
                    </td>
                    <td className="col-4">
                      <div className="form-input ">
                        <label style={{top:"10px"}} className="lh-1 text-16 text-light-1">
                          {dish.dish_quantity}
                        </label>
                      </div>
                    </td>
                    <td className="col-auto">
                      <button className="flex-center bg-light-2 rounded-4 size-35" onClick={()=>{handleVegDishDelete(dish.id)}}>
                        <i className="icon-trash-2 text-16 text-light-1" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      <form>
        <div className="d-flex justify-between">
          <div className="col-4">
            <div className="form-input">
              <input 
                type="text" 
                required 
                name="dish_name" 
                value={vegDish?.dish_name} 
                onChange={handleVegChange} 
              />
              <label className="lh-1 text-16 text-light-1">Dish Name</label>
            </div>
          </div>
          <div className="col-4">
            <div className="form-input">
              <input 
                type="text" 
                required 
                name="dish_quantity" 
                value={vegDish?.dish_quantity} 
                onChange={handleVegChange}   
              />
              <label className="lh-1 text-16 text-light-1">Quantity</label>
            </div>
          </div> 
          <button onClick={handleSubmitVegDish} className="button col-3 -md -blue-1 bg-blue-1-05 text-blue-1 mt-20">
            Add Item
          </button>
        </div>
      </form>
      <div className="border-top-light mt-30 mb-30" />
      <div className="mt-30">
        <div className="fw-500 mb-20">Nov Veg Package Details</div>
        <div className="overflow-scroll scroll-bar-1">
          <table className="table-5 -border-bottom col-12">
            <thead className="bg-light-2">
              <tr>
                <th>Dish Name</th>
                <th>Quantity</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {venueFormData.non_veg_package.map((dish)=>{
                return (
                  <tr>
                    <td className="col-4">
                      <div className="form-input ">
                        <label style={{top:"10px"}} className="lh-1 text-16 text-light-1">
                          {dish.dish_name}
                        </label>
                      </div>
                    </td>
                    <td className="col-4">
                      <div className="form-input ">
                        <label style={{top:"10px"}} className="lh-1 text-16 text-light-1">
                          {dish.dish_quantity}
                        </label>
                      </div>
                    </td>
                    <td className="col-auto">
                      <button className="flex-center bg-light-2 rounded-4 size-35" onClick={()=>{handleNonVegDishDelete(dish.id)}}>
                        <i className="icon-trash-2 text-16 text-light-1" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      <form>
        <div className="d-flex justify-between">
          <div className="col-4">
            <div className="form-input">
              <input 
                type="text" 
                required 
                name="dish_name" 
                value={nonVegDish?.dish_name} 
                onChange={handleNonVegChange} 
              />
              <label className="lh-1 text-16 text-light-1">Dish Name</label>
            </div>
          </div>
          <div className="col-4">
            <div className="form-input">
              <input 
                type="text" 
                required 
                name="dish_quantity" 
                value={nonVegDish?.dish_quantity} 
                onChange={handleNonVegChange}   
              />
              <label className="lh-1 text-16 text-light-1">Quantity</label>
            </div>
          </div> 
          <button onClick={handleSubmitNonVegDish} className="button col-3 -md -blue-1 bg-blue-1-05 text-blue-1 mt-20">
            Add Item
          </button>
        </div>
      </form>

    </div>
  );
};

export default DetailsAndPricing;
