import { AgGridReact } from "ag-grid-react";
import { useEffect, useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

import PropTypes from 'prop-types';

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
  const [rowData, setRowData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(30);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("asc");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `http://localhost:4000/api/products?page=${page}&limit=${limit}&search=${search}&sort=${sort}`
      )
      .then((res) => {
        setRowData(res.data.products);
        setTotalPages(res.data.totalPages);
        setLoading(false);
      })
      .catch(() => {
        setRowData([]);
        setTotalPages(1);
        setLoading(false);
      });
  }, [page, limit, search, sort]);

  const handleEdit = (product) => {
    navigate(`/dashboard/edit-product/${product._id}`);
  };

  const handleDelete = (id) => {
    console.log("Delete", id);
  };

  const colDefs = [
    { field: "name" },
    { field: "price" },
    { field: "category.name", headerName: "Category" },
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
        </select>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="ag-theme-alpine w-full max-w-full flex-1">
          <AgGridReact
            rowData={rowData}
            columnDefs={colDefs}
            pagination={false}
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
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50 hover:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
}
