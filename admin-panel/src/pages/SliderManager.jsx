import { useState } from "react";
import {
  useAddSliderMutation,
  useDeleteSliderMutation,
  useGetSlidersQuery,
  useUpdateSliderMutation,
} from "../redux/Api/sliderApi";

export default function SliderManager() {
  const { data: sliders, isLoading, refetch } = useGetSlidersQuery();
  const [addSlider] = useAddSliderMutation();
  const [updateSlider] = useUpdateSliderMutation();
  const [deleteSlider] = useDeleteSliderMutation();

  // Form State
  const [form, setForm] = useState({
    id: null,
    title: "",
    description: "",
    image: "",
    buttonText: "",
    buttonLink: "",
    status: "active",
  });

  // Handle Input Change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle Form Submit (Add / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.id) {
      await updateSlider(form);
    } else {
      await addSlider(form);
    }
    refetch();
    resetForm();
  };

  // Handle Edit
  const handleEdit = (slider) => {
    setForm({
      id: slider._id,
      title: slider.title,
      description: slider.description,
      image: slider.image,
      buttonText: slider.buttonText,
      buttonLink: slider.buttonLink,
      status: slider.status,
    });
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this slider?")) {
      await deleteSlider(id);
      refetch();
    }
  };

  // Reset Form
  const resetForm = () => {
    setForm({
      id: null,
      title: "",
      description: "",
      image: "",
      buttonText: "",
      buttonLink: "",
      status: "active",
    });
  };

  // Handle Status Change
  const handleStatusChange = async (id, newStatus) => {
    await updateSlider({ id, status: newStatus });
    refetch();
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Slider Manager</h2>

      {/* Add New Slider Button */}
      {form.id && (
        <button
          type="button"
          onClick={resetForm}
          className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        >
          Add New Slider
        </button>
      )}

      {/* Add / Edit Slider Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md space-y-4"
      >
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="buttonText"
          placeholder="Button Text"
          value={form.buttonText}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="buttonLink"
          placeholder="Button Link"
          value={form.buttonLink}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {form.id ? "Update Slider" : "Add Slider"}
        </button>
      </form>

      {/* Show All Sliders */}
      {isLoading ? (
        <p>Loading sliders...</p>
      ) : (
        <div className="mt-6 space-y-4">
          {sliders?.map((slider) => (
            <div
              key={slider._id}
              className="bg-gray-100 p-4 rounded shadow-md flex justify-between items-center"
            >
              <div>
                <h3 className="text-xl font-semibold">{slider.title}</h3>
                <p>{slider.description}</p>
                <img
                  src={slider.image}
                  alt={slider.title}
                  className="w-24 h-24 object-cover mt-2 rounded"
                />
                <a href={slider.buttonLink} className="text-blue-500 underline">
                  {slider.buttonText}
                </a>

                {/* Status Dropdown */}
                <div className="mt-2">
                  <label className="font-bold">Status: </label>
                  <select
                    value={slider.status}
                    onChange={(e) =>
                      handleStatusChange(slider._id, e.target.value)
                    }
                    className={`p-1 border rounded ${
                      slider.status === "active" ? "bg-green-200" : "bg-red-200"
                    }`}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(slider)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(slider._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
