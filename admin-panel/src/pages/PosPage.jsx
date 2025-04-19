import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa"; // Cart Icon
import CartModal from "../components/CartModal"; // Include the CartModal component
import ProductModal from "../components/ProductModal";
import { useGetProductsQuery } from "../redux/Api/porductApi";
import { useSelector } from "react-redux";
import Loading from "../components/Loading";

export default function PosPage() {
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = useGetProductsQuery({
    search,
    limit,
    page,
  });
  const cartItem = useSelector((state) => state.cart.items);
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleOpenCart = () => {
    setIsCartOpen(true);
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };
  const { totalProducts } = data || {};
  const totalPages = Math.ceil(totalProducts / limit);
  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <button
        onClick={handleOpenCart}
        className="fixed top-6 right-20 bg-blue-600 p-4 rounded-full text-white shadow-lg"
      >
        <FaShoppingCart size={25} />
        {cartItem.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 text-xs">
            {cartItem.length}
          </span>
        )}
      </button>

      {/* Product Search Input */}
      <div className="mb-4 flex justify-baseline items-center">
        <input
          type="text"
          placeholder="Search by name or ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-96 px-4 py-2 border rounded"
        />
        {/* limit select */}
        <select
          value={limit}
          onChange={(e) => {
            setLimit(e.target.value);
            setPage(1);
            refetch();
          }}
          className="ml-4 px-4 py-2 border rounded"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      {/* Product Grid */}
      {isLoading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {data?.products?.map((product) => (
            <div
              key={product._id}
              className="p-4 border rounded shadow cursor-pointer hover:bg-gray-100"
              onClick={() => handleProductClick(product)}
            >
              <img
                src={product.image[0]}
                alt={product.name}
                className="w-full h-32 object-cover mb-2 rounded"
              />
              <h2 className="text-lg font-bold">{product.name}</h2>
              <p className="text-sm text-gray-600">
                ID: {product._id.slice(0, 6)}...
              </p>
            </div>
          ))}
          {/* pagination */}
          <div className="col-span-full flex justify-center mt-4">
            <nav className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setPage(index + 1);
                    refetch();
                  }}
                  className={`px-3 py-1 rounded ${
                    page === index + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={selectedProduct}
        />
      )}

      {/* Cart Modal */}
      {isCartOpen && <CartModal onClose={handleCloseCart} refetch={refetch} />}
    </div>
  );
}
