import { AgGridReact } from "ag-grid-react";
import { useEffect, useState } from "react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

function ImageRenderer(props) {
  const imageUrl = props.value;
  return imageUrl ? (
    <img
      src={imageUrl}
      alt="Product"
      style={{ maxWidth: "50px", maxHeight: "50px" }}
    />
  ) : null;
}

export default function ProductTable({ product }) {
  const [rowData, setRowData] = useState([]);
  const [quickFilterText, setQuickFilterText] = useState("");
  const [paginationPageSize, setPaginationPageSize] = useState(10); // Default page size

  useEffect(() => {
    setRowData(product);
  }, [product]);

  const [colDefs, setColDefs] = useState([
    { field: "name" },
    { field: "price" },
    { field: "category.name", headerName: "Category" },
    { field: "stock" },
    {
      headerName: "Image",
      valueGetter: (params) => params.data.image?.[0] || "",
      cellRenderer: ImageRenderer,
    },
  ]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={quickFilterText}
        onChange={(e) => setQuickFilterText(e.target.value)}
        style={{ marginBottom: "10px" }}
      />
      <select
        value={paginationPageSize}
        onChange={(e) => setPaginationPageSize(Number(e.target.value))}
        style={{ marginLeft: "10px", marginBottom: "10px" }}
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
      </select>
      <div
        className="ag-theme-alpine"
        style={{ height: "500px", width: "100%" }}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          pagination={true}
          paginationPageSize={paginationPageSize}
          quickFilterText={quickFilterText}
        />
      </div>
    </div>
  );
}
