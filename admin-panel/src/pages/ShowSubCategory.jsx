import { AgGridReact } from "ag-grid-react";
import {
  useGetSubCategoriesQuery,
  useDeleteSubCategoryMutation,
  useUpdateSubCategoryMutation,
} from "../redux/Api/subcategoryApi";
import Loading from "../components/Loading";
import Swal from "sweetalert2"; // Import SweetAlert2

export default function ShowSubCategory() {
  const {
    data: subcategories,
    isLoading: isSubCategoryLoading,
    isError: isSubCategoryError,
  } = useGetSubCategoriesQuery();

  const [deleteSubCategory] = useDeleteSubCategoryMutation();
  const [updateSubCategory] = useUpdateSubCategoryMutation();

  const handleEditClick = (subcategory) => {
    Swal.fire({
      title: "Update Subcategory",
      html: `
        <input id="swal-input-name" class="swal2-input" placeholder="Subcategory Name" value="${subcategory.name}" />
        <input id="swal-input-image" class="swal2-input" placeholder="Image URL" value="${subcategory.image}" />
      `,
      focusConfirm: false,
      preConfirm: () => {
        const name = document.getElementById("swal-input-name").value;
        const image = document.getElementById("swal-input-image").value;
        if (!name || !image) {
          Swal.showValidationMessage("Please enter both name and image URL");
        }
        return { name, image, _id: subcategory._id }; // Ensure _id is passed correctly
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const { name, image, _id } = result.value;
        handleUpdateSubCategory({ _id, name, image });
      }
    });
  };

  const handleDeleteClick = (subcategory) => {
    if (!subcategory._id) {
      console.error("Subcategory _id is missing:", subcategory);
      Swal.fire(
        "Error!",
        "Subcategory _id is missing. Cannot delete.",
        "error"
      );
      return;
    }

    Swal.fire({
      title: `Are you sure you want to delete ${subcategory.name}?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteConfirm(subcategory._id);
      }
    });
  };

  const handleDeleteConfirm = async (_id) => {
    if (!_id) {
      console.error("Invalid subcategory _id:", _id);
      Swal.fire("Error!", "Invalid subcategory _id.", "error");
      return;
    }

    try {
      await deleteSubCategory(_id);
      Swal.fire("Deleted!", "Subcategory has been deleted.", "success");
    } catch {
      Swal.fire(
        "Error!",
        "There was an issue deleting the subcategory.",
        "error"
      );
    }
  };

  const handleUpdateSubCategory = async (updatedSubCategory) => {
    console.log("Updating subcategory:", updatedSubCategory);

    if (!updatedSubCategory || !updatedSubCategory._id) {
      Swal.fire(
        "Error!",
        "Subcategory details are missing. Please try again.",
        "error"
      );
      return;
    }

    try {
      await updateSubCategory(updatedSubCategory).unwrap();
      Swal.fire("Updated!", "Subcategory has been updated.", "success");
    } catch {
      Swal.fire(
        "Error!",
        "There was an issue updating the subcategory.",
        "error"
      );
    }
  };

  const columnDefs = [
    {
      field: "name",
      headerName: "Sub Category Name",
      sortable: true,
      filter: true,
      editable: true,
      cellEditorPopup: true,
    },
    {
      field: "categoryName",
      headerName: "Category Name",
      sortable: true,
      valueGetter: (params) => params.data.category?.name,
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
      {isSubCategoryLoading ? <Loading /> : null}
      {isSubCategoryError && <p>Error fetching subcategories</p>}
      {subcategories && (
        <AgGridReact
          rowData={subcategories.map((subcategory) => ({
            ...subcategory,
            categoryName: subcategory.category?.name,
          }))}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
        />
      )}
    </div>
  );
}
