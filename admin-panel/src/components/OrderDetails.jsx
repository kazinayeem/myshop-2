import React from "react";
import PropTypes from "prop-types";
import { Disclosure } from "@headlessui/react";

const OrderDetails = ({ orders }) => {
  return (
    <React.Fragment>
      <div className="bg-white shadow-lg rounded-lg p-6 w-full min-w-full max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Order Details</h2>
        {orders.map((order) => (
          <Disclosure key={order._id} as="div">
            {() => (
              <>
                <div className="flex justify-between items-center p-4 cursor-pointer bg-gray-100 rounded-lg mb-2">
                  <Disclosure.Button as="div" className="w-full text-left">
                    <div className="flex justify-between w-full">
                      <p className="font-semibold">Order ID: {order._id}</p>
                      <p className="text-blue-600 font-medium">
                        {order.status}
                      </p>
                      <p className="font-medium">
                        ${order.totalPrice.toFixed(2)}
                      </p>
                    </div>
                  </Disclosure.Button>
                </div>
                <Disclosure.Panel className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Products:</h3>
                  <ul className="list-disc list-inside ml-4">
                    {order.products.map((product) => (
                      <li key={product._id} className="mt-2">
                        {product.productId ? (
                          <>
                            <p className="font-semibold">
                              {product.productId.name}
                            </p>
                            <p>Quantity: {product.quantity}</p>
                            <p>
                              Buying Price: $
                              {product.productId.buyingPrice.toFixed(2)}
                            </p>
                            <p>Selling Price: ${product.price.toFixed(2)}</p>
                          </>
                        ) : (
                          <p className="text-gray-500">
                            Product information not available.
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        ))}
      </div>
    </React.Fragment>
  );
};
OrderDetails.propTypes = {
  orders: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      totalPrice: PropTypes.number.isRequired,
      products: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string.isRequired,
          productId: PropTypes.shape({
            name: PropTypes.string.isRequired,
            buyingPrice: PropTypes.number.isRequired,
          }),
          quantity: PropTypes.number.isRequired,
          price: PropTypes.number.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
};

export default OrderDetails;
