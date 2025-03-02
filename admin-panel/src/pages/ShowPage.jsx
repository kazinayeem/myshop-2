import { AgGridReact } from "ag-grid-react";
import { useState } from "react";

import { useNavigate } from "react-router";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

import PropTypes from "prop-types";
import { useGetProductsQuery } from "../redux/Api/porductApi";

function ImageRenderer(props) {
  const imageUrl = props.value;
  return imageUrl ? (
    <img src={imageUrl} alt="Product" className="max-w-12 max-h-12" />
  ) : null;
}

ImageRenderer.propTypes = {
  value: PropTypes.string,
};

ActionRenderer.propTypes = {
  context: PropTypes.shape({
    handleEdit: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
  }).isRequired,
  data: PropTypes.object.isRequired,
};

function ActionRenderer(props) {
  return (
    <div className="flex gap-2">
      <button
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
        onClick={() => props.context.handleEdit(props.data)}
      >
        Edit
      </button>
      <button
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
        onClick={() => props.context.handleDelete(props.data._id)}
      >
        Delete
      </button>
    </div>
  );
}

export default function ProductTable() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(30);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("asc");
  const { data, isLoading } = useGetProductsQuery({ limit, page, search });
  const handleEdit = (product) => {
    navigate(`/dashboard/edit-product/${product._id}`);
  };

  const handleDelete = (id) => {
    console.log("Delete", id);
  };

  const colDefs = [
    {
      field: "name",
      headerName: "Product Name",
      sortable: true,
      filter: true,
      floatingFilter: true,
      floatingFilterComponentParams: {
        suppressFilterButton: true,
      },
      filterParams: {
        buttons: ["reset"],
      },
    },
    {
      field: "price",
      headerName: "Price",
      sortable: true,
      filter: true,
      floatingFilter: true,
      floatingFilterComponentParams: {
        suppressFilterButton: true,
      },
      filterParams: {
        buttons: ["reset"],
      },
    },
    {
      field: "category.name",
      headerName: "Category",

      sortable: true,
      filter: true,
      floatingFilter: true,
      floatingFilterComponentParams: {
        suppressFilterButton: true,
      },
      filterParams: {
        buttons: ["reset"],
      },
    },
    { field: "stock" },
    {
      headerName: "Image",
      valueGetter: (params) => params.data.image?.[0] || "",
      cellRenderer: ImageRenderer,
    },
    {
      headerName: "Actions",
      cellRenderer: ActionRenderer,
    },
  ];

  return (
    <div className="w-full h-screen p-2 flex flex-col items-center bg-gray-100">
      <div className="flex gap-4 mb-4 w-full max-w-4xl">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="border p-2 rounded"
        >
          <option value={10}>10</option>
          <option value={30}>30</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={data?.totalProducts || 0}>All</option>
        </select>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="ag-theme-alpine w-full max-w-full flex-1">
          <AgGridReact
            rowData={data?.products || []}
            columnDefs={colDefs}
            pagination={true}
            context={{ handleEdit, handleDelete }}
          />
        </div>
      )}

      <div className="flex gap-4 mt-4">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50 hover:bg-gray-400"
        >
          Previous
        </button>
        <span className="text-lg font-semibold">
          Page {page} of {data?.totalPages || 1}
        </span>
        <button
          disabled={page >= data?.totalPages}
          onClick={() => setPage(page + 1)}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50 hover:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
}
