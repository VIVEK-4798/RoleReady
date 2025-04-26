import { useState } from "react";

const GalleryUploader = ({ cityFormData, setCityFormData }) => {
  const [error, setError] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0]; 
    const maxSize = 1800; 

    if (!file) return;

    if (!["image/png", "image/jpeg"].includes(file.type.toLowerCase())) {
      setError(`File ${file.name} is not a valid type. Only PNG and JPEG are allowed.`);
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        if (img.width > maxSize || img.height > maxSize) {
          setError(`Image ${file.name} exceeds the maximum size of ${maxSize}px.`);
        } else {
          setError("");
          setCityFormData((prevState) => ({
            ...prevState,
            city_image: [reader.result],
          }));
        }
      };
      img.onerror = () => {
        setError(`Image ${file.name} could not be loaded.`);
      };
      img.src = reader.result;
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setCityFormData((prevState) => ({
      ...prevState,
      city_image: [],
    }));
  };

  return (
    <div className="row x-gap-20 y-gap-20 pt-15">
      {/* Upload Button */}
      <div className="col-auto">
        <div className="w-200">
          <label htmlFor="uploadGallery" className="d-flex ratio ratio-2:1">
            <div className="flex-center flex-column text-center bg-blue-2 h-full w-1/1 absolute rounded-4 border-type-1">
              <div className="icon-upload-file text-40 text-blue-1 mb-10" />
              <div className="text-blue-1 fw-500">Upload Image</div>
            </div>
          </label>
          <input
            type="file"
            id="uploadGallery"
            accept="image/png, image/jpeg"
            className="d-none"
            onChange={handleFileUpload}
          />
          <div className="text-start mt-10 text-14 text-light-1">
            PNG or JPG no bigger than 1800px wide and tall.
          </div>
        </div>
      </div>

      {/* Display Uploaded Image */}
      {cityFormData?.city_image?.length > 0 && (
        <div className="col-auto">
          <div className="d-flex ratio ratio-2:1 w-200">
            <img
              src={cityFormData.city_image[0]}
              alt="Uploaded"
              className="img-ratio rounded-4"
            />
            <div
              className="d-flex justify-end px-10 py-10 h-100 w-1/1 absolute"
              onClick={handleRemoveImage}
            >
              <div className="size-40 bg-white rounded-4 flex-center cursor-pointer">
                <i className="icon-trash text-16" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Messages */}
      {error && <div className="col-12 mb-10 text-red-1">{error}</div>}
    </div>
  );
};

export default GalleryUploader;