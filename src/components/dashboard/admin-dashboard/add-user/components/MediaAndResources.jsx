import GalleryUploader from "./content/GalleryUploader";

const MediaAndResources = ({ vendorData, setVendorData}) => {
  return (
    <div className="col-xl-9 col-lg-11">
      <div className="row x-gap-20 y-gap-20">
        <div className="col-12">
          <div className="mt-30">
            <div className="fw-500">Upload Portfolio</div>
            <GalleryUploader vendorData={vendorData} setVendorData={setVendorData}/>
          </div>
        </div>
        {/* End .col-12 */}
      </div>
    </div>
  );
};

export default MediaAndResources;
