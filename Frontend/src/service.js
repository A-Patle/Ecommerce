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

export const BrandService = {
  fetchBrands: () => {
    return fetch("/brands", { method: "GET" });
  },
  getBrandByBrandId: (brands, brandId) => {
    return brands.find((brand) => brand.id == brandId);
  },
};

export const CategoriesService = {
  fetchCategoriess: () => {
    return fetch("/categories", { method: "GET" });
  },
  getCategoryByCategoryId: (categorys, categoryId) => {
    return categorys.find((category) => category.id == categoryId);
  },
};

export const SortService = {
  getSortedArray: (elements, sortBy, sortOrder) => {
    if (!elements) return elements;

    let array = [...elements];
    array.sort((a, b) => {
      //a = cat
      // b = dog
      if (a[sortBy] && b[sortBy]) {
        return (
          a[sortBy].toString().toLowerCase() -
          b[sortBy].toString().toLowerCase()
        );
      } else {
        return 0;
      }
    });

    if (sortOrder === "DESC") array.reverse();

    return array;
  },
};
