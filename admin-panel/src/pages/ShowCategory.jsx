import { useCallback, useState } from "react";
import {
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from "../redux/Api/categoryApi";
import { AgGridReact } from "ag-grid-react";
import Swal from "sweetalert2";
import CategoryModal from "../components/ShowporductModal";
import Loading from "../components/Loading";

export default function ShowCategory() {
  const {
    data: categories,
    isLoading,
    isError,
    refetch,
  } = useGetCategoriesQuery(); 
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteCategory] = useDeleteCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  const handleCategoryClick = useCallback((category) => {
    setSelectedCategory(category);
  }, []);


  const handleEditClick = async (category) => {
    const { value: formValues } = await Swal.fire({
      title: "Edit Category",
      html: `
        <input id="swal-input-name" class="swal2-input" placeholder="Category Name" value="${
          category.name
        }">
        <input id="swal-input-image" class="swal2-input" placeholder="Image URL" value="${
          category.image || ""
        }">
      `,
      showCancelButton: true,
      confirmButtonText: "Update",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        const name = document.getElementById("swal-input-name").value;
        const image = document.getElementById("swal-input-image").value;

        if (!name) {
          Swal.showValidationMessage("Category name is required");
          return false;
        }

        return { id: category._id, name, image };
      },
    });

    if (formValues) {
      try {
        await updateCategory(formValues);
        Swal.fire("Updated!", "Category has been updated.", "success");
        refetch(); 
      } catch (error) {
        Swal.fire(
          "Error!",
          "Failed to update category.",
          error.message,
          "error"
        );
      }
    }
  };

 
  const handleDeleteClick = async (category) => {
    const isConfirmed = await Swal.fire({
      title: "Are you sure?",
      text: `Delete category: ${category.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (isConfirmed.isConfirmed) {
      try {
        await deleteCategory(category._id);
        Swal.fire("Deleted!", "Category has been deleted.", "success"); 
        refetch(); 
      } catch (error) {
        Swal.fire(
          "Error!",
          "Failed to delete category.",
          error.message,
          "error"
        ); 
      }
    }
  };

  const columnDefs = [
    {
      field: "name",
      headerName: "Category Name",
      sortable: true,
      filter: true,
    },
    {
      headerName: "View Products",
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
    </div>
  );
}
