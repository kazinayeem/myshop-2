import { AgGridReact } from "ag-grid-react";
import { useGetSubCategoriesQuery } from "../redux/Api/subcategoryApi";
import Loading from "../components/Loading";

export default function ShowSubCategory() {
  const {
    data: subcategories,
    isLoading,
    isError,
  } = useGetSubCategoriesQuery();

  const columnDefs = [
    {
      field: "name",
      headerName: "Sub Category Name",
      sortable: true,
      filter: true,
    },
  ];

  return (
    <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
      {isLoading && <Loading />}
      {isError && <p>Error fetching categories</p>}
      {subcategories && (
        <AgGridReact
          rowData={subcategories}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
        />
      )}
    </div>
  );
}
