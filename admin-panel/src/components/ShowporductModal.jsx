import Modal from "react-modal";
import PropTypes from "prop-types";

Modal.setAppElement("#root");

const CategoryModal = ({ isOpen, onClose, category }) => (
  <Modal
    isOpen={isOpen}
    onRequestClose={onClose}
    className="bg-white p-5 rounded-lg shadow-lg w-[70%] relative"
    overlayClassName="fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center"
  >
    <button
      onClick={onClose}
      className="absolute top-2 right-2 text-red-500 text-xl"
    >
      ✖
    </button>
    <h2 className="text-xl font-bold mb-4 text-center">
      Products in {category?.name}
    </h2>
    <div className="max-h-80 overflow-y-auto">
      <ul>
        {category?.product.map((product) => (
          <li
            key={product._id}
            className="border border-amber-100 rounded-lg p-4 shadow-md flex items-center space-x-4"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 object-cover rounded-md"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <div className="flex items-center space-x-2">
                {product.discountPrice ? (
                  <>
                    <span className="text-red-500 font-bold">
                      ${product.discountedPrice}
                    </span>
                    <span className="text-gray-500 line-through">
                      ${product.price} 
                    </span>
                  </>
                ) : (
                  <span className="text-gray-900 font-bold">
                    ${product.price || "N/A"}
                  </span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </Modal>
);
CategoryModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  category: PropTypes.shape({
    name: PropTypes.string,
    product: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        priceByVariant: PropTypes.shape({
          price: PropTypes.number,
        }),
      })
    ),
  }),
};

export default CategoryModal;
