import AddEmail from "./AddEmail";
import SearchBox from "./SearchBox";

const FilterBox = ({setSearchParameter, setRefresh, refresh}) => {
  const refreshEmails = () =>{
    setRefresh(!refresh)
  }
  const handleOnsearch = (searchString) =>{
    setSearchParameter(searchString)
  }
  return (
    <div className="row x-gap-20 y-gap-20 items-center">

      <div className="col-auto">
        <SearchBox onSearch = {handleOnsearch}/>
      </div>
      {/* End col-auto */}
      
      <div className="col-auto">
        <AddEmail refreshEmails = {refreshEmails}/>
      </div>
      {/* End col-auto */}
    </div>
  );
};

export default FilterBox;
