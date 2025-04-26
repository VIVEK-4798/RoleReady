import AddRegion from "./AddRegion";
import SearchBox from "./SearchBox";

const FilterBox = ({setSearchParameter, setRefresh, refresh}) => {
  const refreshRegions = () =>{
    setRefresh(!refresh)
  }
  const handleOnsearch = (searchString) =>{
    setSearchParameter(searchString)
  }

  return (
    <div className="row x-gap-20 y-gap-20 items-center">

      <div className="col-auto">
        <SearchBox onSearch = {handleOnsearch} />
      </div>
      {/* End col-auto */}
      
      <div className="col-auto">
        <AddRegion refreshRegions = {refreshRegions}/>
      </div>
      {/* End col-auto */}
    </div>
  );
};

export default FilterBox;
