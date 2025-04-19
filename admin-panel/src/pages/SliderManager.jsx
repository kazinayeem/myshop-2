import { useState } from "react";
import {
  useAddSliderMutation,
  useDeleteSliderMutation,
  useGetSlidersQuery,
  useUpdateSliderMutation,
} from "../redux/Api/sliderApi";
import Swal from "sweetalert2";
export default function SliderManager() {
  const {
    data: sliders,
    isLoading,
    refetch,
    isError,
    error,
  } = useGetSlidersQuery();
  const [addSlider] = useAddSliderMutation();
  const [deleteSlider] = useDeleteSliderMutation();
  const [updateSlider] = useUpdateSliderMutation();

  const [form, setForm] = useState({
    title: "",
    description: "",
    image: null,
    buttonText: "",
    buttonLink: "",
    status: "active",
  });

  const [editingStatus, setEditingStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    Swal.fire({
      title: "Adding Slider...",
      didOpen: () => Swal.showLoading(),
    });
    e.preventDefault();

    if (!form.image) return alert("Please select an image");

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    try {
      const newSlider = await addSlider(formData).unwrap();
      if (newSlider._id) {
        // After adding the new slider, update the status
        await updateSlider({ id: newSlider._id, status: form.status });
        Swal.close();
        Swal.fire({
          icon: "success",
          title: "Slider Added",
          text: "Slider has been added successfully.",
          showConfirmButton: false,
          timer: 1500,
        });
      }

      resetForm();
      refetch();
    } catch (err) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add slider.",
        showConfirmButton: true,
      });
      console.error("Failed to add slider:", err);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Deleting Slider...",
      didOpen: () => Swal.showLoading(),
    });
    try {
      await deleteSlider(id).unwrap();
      Swal.close();
      Swal.fire({
        icon: "success",
        title: "Slider Deleted",
        text: "Slider has been deleted successfully.",
        showConfirmButton: false,
        timer: 1500,
      });
      refetch();
    } catch (err) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete slider.",
        showConfirmButton: true,
      });
      console.error("Failed to delete slider:", err);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateSlider({ id, status });
      refetch();
      setEditingStatus(null);
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      image: null,
      buttonText: "",
      buttonLink: "",
      status: "active",
    });
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        Slider Manager
      </h2>

      {/* Error Alert */}
      {isError && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          <p>Error: {error.message}</p>
        </div>
      )}

      {/* Add Slider Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 space-y-6 max-w-6xl mx-auto"
        encType="multipart/form-data"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title Input */}
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="p-4 border rounded-lg w-full text-lg"
            required
          />

          {/* Description Input */}
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="p-4 border rounded-lg w-full text-lg"
            required
          />

          {/* Image Upload */}
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="p-4 border rounded-lg w-full text-lg"
            required
          />

          {/* Button Text Input */}
          <input
            type="text"
            name="buttonText"
            placeholder="Button Text"
            value={form.buttonText}
            onChange={handleChange}
            className="p-4 border rounded-lg w-full text-lg"
          />

          {/* Button Link Input */}
          <input
            type="text"
            name="buttonLink"
            placeholder="Button Link"
            value={form.buttonLink}
            onChange={handleChange}
            className="p-4 border rounded-lg w-full text-lg"
          />

          {/* Status Dropdown */}
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="p-4 border rounded-lg w-full text-lg"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Add Slider
          </button>
        </div>
      </form>

      {/* Sliders List */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="text-center text-lg text-gray-600">
            Loading sliders...
          </div>
        ) : (
          sliders?.map((slider) => (
            <div
              key={slider._id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <img
                src={slider.image}
                alt={slider.title}
                className="w-full h-48 object-cover rounded-lg"
              />
              <h3 className="text-xl font-semibold mt-4">{slider.title}</h3>
              <p className="text-gray-600 text-sm">{slider.description}</p>
              <a
                href={slider.buttonLink}
                className="text-blue-500 underline mt-2 block"
                target="_blank"
              >
                {slider.buttonText}
              </a>
              <div className="mt-4">
                {editingStatus === slider._id ? (
                  <select
                    value={slider.status}
                    onChange={(e) =>
                      handleStatusChange(slider._id, e.target.value)
                    }
                    className="p-2 border rounded-lg w-full text-lg"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                ) : (
                  <span
                    className={`text-lg font-semibold ${
                      slider.status === "active"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {slider.status}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => handleDelete(slider._id)}
                  className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-200"
                >
                  Delete
                </button>
                <button
                  onClick={() => setEditingStatus(slider._id)}
                  className="bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition duration-200"
                >
                  Change Status
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
