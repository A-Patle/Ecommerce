export const OrderService = {
  //getpreviousOrders
  getPreviousOrders: (orders) => {
    return orders.filter((ord) => ord.isPaymentCompleted === true);
  },

  //getCart
  getCart: (orders) => {
    return orders.filter((ord) => ord.isPaymentCompleted === false);
  },
};

export const ProductService = {
  getProductById: (products, productId) => {
    return products.find((product) => product.id === productId);
  },
  fetchProducts: () => {
    return fetch(`/products`, { method: "GET" });
  },
};
