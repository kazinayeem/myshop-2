import ImageSlider from "./ImageSlider";
import ShowCategory from "./ShowCategory";

export default function MainHeader() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Sidebar Categories */}
        <ShowCategory />

        {/* Image Slider */}
        <div className="w-full lg:w-3/4">
          <ImageSlider />
        </div>
      </div>
    </div>
  );
}
