import { XCircle } from "lucide-react"; // Import the "X" icon from lucide-react
import PropTypes from "prop-types";
import { useState } from "react";

export default function ProductImageUpload({ setImages }) {
  const [previewImages, setPreviewImages] = useState([]);
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const imagePreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...imagePreviews]);
  };

  //   console.log(images);

  //   const handleRemoveImage = (index) => {
  //     const updatedImages = [...previewImages];
  //     updatedImages.splice(index, 1);
  //     setPreviewImages(updatedImages);
  //     setImages((prev) => prev.filter((_, i) => i !== index));
  //     URL.revokeObjectURL(previewImages[index]);
  //   };

  const renderImagePreviews = () => {
    return previewImages?.map((image, index) => (
      <div
        key={index}
        className="relative w-32 h-32 bg-gray-200 border border-dashed border-gray-400 rounded-lg flex justify-center items-center"
      >
        <img
          src={image}
          alt={`Product Preview ${index + 1}`}
          className="object-cover w-full h-full rounded-lg"
        />
        <button
          type="button"
          // Trigger image removal on button click
          className="absolute top-0 right-0 p-1 text-white bg-red-500 rounded-full hover:bg-red-600 focus:outline-none"
        >
          <XCircle size={20} />
        </button>
      </div>
    ));
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Display image previews */}
        <div className="flex space-x-4 overflow-x-auto">
          {renderImagePreviews()}
        </div>

        {/* File input for uploading images */}
        <label
          htmlFor="image-upload"
          className="flex items-center justify-center cursor-pointer w-full py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md transition-colors duration-200"
        >
          <span className="text-lg">Upload Images</span>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            multiple
            className="hidden"
          />
        </label>

        {/* Instructions */}
        <p className="text-sm text-gray-500">
          You can upload up to 4 images. Supported formats: .jpg, .jpeg, .png,
          .gif
        </p>
      </div>
    </div>
  );
}

ProductImageUpload.propTypes = {
  setImages: PropTypes.func.isRequired, // Prop for the function to update the images state
  images: PropTypes.arrayOf(PropTypes.string).isRequired, // Prop for the array of image URLs
};
