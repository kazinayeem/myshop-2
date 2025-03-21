import { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  useGetSubCategoriesQuery,
  useDeleteSubCategoryMutation,
  useUpdateSubCategoryMutation,
} from "../redux/Api/subcategoryApi";
import Loading from "../components/Loading";

export default function ShowSubCategory() {
  const {
    data: subcategories,
    isLoading,
    isError,
  } = useGetSubCategoriesQuery();
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const [deletingSubCategory, setDeletingSubCategory] = useState(null);

  // Using delete and update mutations
  const [deleteSubCategory] = useDeleteSubCategoryMutation();
  const [updateSubCategory] = useUpdateSubCategoryMutation();

  const handleEditClick = (subcategory) => {
    setEditingSubCategory(subcategory); // Set the subcategory for editing
  };

  const handleDeleteClick = (subcategory) => {
    setDeletingSubCategory(subcategory); // Set the subcategory to be deleted
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteSubCategory(deletingSubCategory.id); // Delete the subcategory
      setDeletingSubCategory(null); // Clear the deletion state
    } catch (error) {
      console.error("Error deleting subcategory:", error);
    }
  };

  const handleUpdateSubCategory = async () => {
    try {
      await updateSubCategory(editingSubCategory); // Update the subcategory
      setEditingSubCategory(null); // Clear the editing state
    } catch (error) {
      console.error("Error updating subcategory:", error);
    }
  };

  const columnDefs = [
    {
      field: "name",
      headerName: "Sub Category Name",
      sortable: true,
      filter: true,
      editable: true, // Make the subcategory name field editable
      cellEditorPopup: true,
    },
    {
      headerName: "Edit", // Edit column
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
      headerName: "Delete", // Delete column
      cellRenderer: (params) => (
        <button
          onClick={() => handleDeleteClick(params.data)}
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
      {isError && <p>Error fetching subcategories</p>}
      {subcategories && (
        <AgGridReact
          rowData={subcategories}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
          onCellEditCommit={(event) => {
            // Commit the update when the user edits a cell
            const updatedSubCategory = {
              ...event.data,
              [event.colDef.field]: event.newValue, // Update the field that was edited
            };
            setEditingSubCategory(updatedSubCategory); // Set the edited subcategory
            handleUpdateSubCategory(); // Call the update function
          }}
        />
      )}

      {deletingSubCategory && (
        <div className="confirmation-box">
          <p>Are you sure you want to delete {deletingSubCategory.name}?</p>
          <button
            onClick={handleDeleteConfirm}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Confirm
          </button>
          <button
            onClick={() => setDeletingSubCategory(null)}
            className="bg-gray-500 text-white px-3 py-1 rounded"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
