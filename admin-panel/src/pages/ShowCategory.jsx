import { useCallback, useState } from "react";
import { useGetCategoriesQuery } from "../redux/Api/categoryApi";
import { AgGridReact } from "ag-grid-react";
import CategoryModal from "../components/ShowporductModal";

export default function ShowCategory() {
  const { data: categories, isLoading, isError } = useGetCategoriesQuery();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  const columnDefs = [
    {
      field: "name",
      headerName: "Category Name",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Actions",
      cellRenderer: (params) => (
        <button
          onClick={() => handleCategoryClick(params.data)}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          View Products
        </button>
      ),
    },
  ];

  return (
    <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
      {isLoading && <p>Loading...</p>}
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
