import { useCallback, useState } from "react";
import {
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from "../redux/Api/categoryApi";
import { AgGridReact } from "ag-grid-react";
import CategoryModal from "../components/ShowporductModal";
import Loading from "../components/Loading";

export default function ShowCategory() {
  const { data: categories, isLoading, isError } = useGetCategoriesQuery();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);

  // Using the update and delete mutations
  const [deleteCategory] = useDeleteCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  const handleCategoryClick = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  const handleEditClick = (category) => {
    setEditingCategory(category); // Open the edit modal with the selected category
  };

  const handleDeleteClick = (category) => {
    setDeletingCategory(category); // Trigger delete confirmation
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteCategory(deletingCategory.id); // Perform delete operation
      setDeletingCategory(null); // Close the delete confirmation
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleUpdateCategory = async (updatedCategory) => {
    try {
      await updateCategory(updatedCategory); // Update the category
      setEditingCategory(null); // Close the edit modal
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const columnDefs = [
    {
      field: "name",
      headerName: "Category Name", // Header for the category name column
      sortable: true,
      filter: true,
    },
    {
      headerName: "View Products", // Header for the view products column
      cellRenderer: (params) => (
        <button
          onClick={() => handleCategoryClick(params.data)}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          View Products
        </button>
      ),
    },
    {
      headerName: "Edit",
      cellRenderer: (params) => (
        <button
          onClick={() => handleEditClick(params.data)}
          className="bg-yellow-500 text-white px-3 py-1 rounded"
        >
          Edit
        </button>
      ),
    },
    {
      headerName: "Delete",
      cellRenderer: (params) => (
        <button
          onClick={() => {
            handleDeleteClick(params.data);
          }}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Delete
        </button>
      ),
    },
  ];

  return (
    <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
      {isLoading && <Loading />}
      {isError && <p>Error fetching categories</p>}
      {categories && (
        <AgGridReact
          rowData={categories}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
        />
      )}
      <CategoryModal
        isOpen={!!selectedCategory}
        onClose={() => setSelectedCategory(null)}
        category={selectedCategory}
      />
      {/* Edit Modal */}
      {editingCategory && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Category</h2>
            <input
              type="text"
              defaultValue={editingCategory.name}
              onChange={(e) =>
                setEditingCategory({ ...editingCategory, name: e.target.value })
              }
            />
            <button
              onClick={() => {
                handleUpdateCategory(editingCategory?._id);
              }}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditingCategory(null)}
              className="bg-gray-500 text-white px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {/* Delete Confirmation */}
      {deletingCategory && (
        <div className="modal">
          <div className="modal-content">
            <h2>Are you sure you want to delete this category?</h2>
            <p>{deletingCategory.name}</p>
            <button
              onClick={handleDeleteConfirm}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Confirm
            </button>
            <button
              onClick={() => setDeletingCategory(null)}
              className="bg-gray-500 text-white px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
