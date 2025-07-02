import React, { useState, useEffect, useMemo } from "react";
import { BrandService, CategoriesService, SortService } from "../src/service";
export default function ProductList() {
  let [search, setSearch] = useState(""); //represent the value of searchbox
  let [products, setProducts] = useState([]); //represent the array of the products to show in the grid
  let [orignalproducts, setOriginalsProducts] = useState([]); //stores the actual array of the products loaded from the server
  let [sortBy, setSortBy] = useState("productName"); //represent the name of sort column selected by the user
  let [sortOrder, setSortOrder] = useState("ASC"); //ASC-DeSC : represents the order of sorting either ascending or descending
  let [brands, setBrands] = useState([]); // stores all brands data from server
  let [selectedBrand, setSelectedBrand] = useState(""); // respresent the brand selected by user

  //useEffect - execute a callback functions when the component is rendred for the first time
  useEffect(() => {
    (async () => {
      //get data from brands database
      let brandResponse = await BrandService.fetchBrands();
      let brandResponseBody = await brandResponse.json();
      setBrands(brandResponseBody);

      //request to categores table
      let categoriesResponse = await CategoriesService.fetchCategoriess();
      let categoriesResponseBody = await categoriesResponse.json();

      //request to product table
      let productsResponse = await fetch(
        `/products?productName_like=${search}&_sort=${sortBy}&_order=${sortOrder}`,
        { method: "GET" }
      );
      let productsResponseBody = await productsResponse.json();

      //set "catergory" and "brand" poperty to each product
      productsResponseBody.forEach((product) => {
        product.category = CategoriesService.getCategoryByCategoryId(
          categoriesResponseBody,
          product.categoryId
        );
        product.brand = BrandService.getBrandByBrandId(
          brandResponseBody,
          product.brandId
        );
      });

      setOriginalsProducts(productsResponseBody);
      setProducts(productsResponseBody);
    })();
  }, [search]);

  let filteredproducts = useMemo(() => {
    // console.log("filtered products", orignalproducts, selectedBrand);

    return orignalproducts.filter(
      (product) => product.brand.brandName.indexOf(selectedBrand) >= 0
    );
  }, [orignalproducts, selectedBrand]);

  //when the user clicks on column name to sort
  let onSortColumnNameClick = (event, columnName) => {
    event.preventDefault(); // avoid refresh
    setSortBy(columnName);
    let negatedSortedOrder = sortOrder === "ASC" ? "DESC" : "ASC";
    setSortOrder(negatedSortedOrder);
  };

  useEffect(() => {
    setProducts(
      SortService.getSortedArray(filteredproducts, sortBy, sortOrder)
    );
  }, [filteredproducts, sortBy, sortOrder]);

  let getColumnHeader = (columnName, displayName) => {
    return (
      <React.Fragment>
        <a
          href="/#"
          onClick={(event) => {
            onSortColumnNameClick(event, columnName);
          }}
        >
          {displayName}
        </a>{" "}
        {sortBy === columnName && sortOrder === "ASC" ? (
          <i className="fa fa-sort-up"></i>
        ) : (
          ""
        )}
        {sortBy === columnName && sortOrder === "DESC" ? (
          <i className="fa fa-sort-down"></i>
        ) : (
          ""
        )}
      </React.Fragment>
    );
  };

  return (
    <div className="row">
      <div className="col-12">
        <div className="row p-3 header">
          <div className="col-lg-3">
            <h4>
              <i className="fa fa-suitcase"></i>
              &nbsp; Products&nbsp;
              <span className="badge bg-secondary">{products.length}</span>
            </h4>
          </div>

          <div className="col-lg-6">
            <input
              type="search"
              placeholder="Search box here"
              className="form-control"
              autoFocus="autoFocus"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="col-lg-3">
            <select
              className="form-control"
              value={selectedBrand}
              onChange={(event) => setSelectedBrand(event.target.value)}
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option value={brand.brandName} key={brand.id}>
                  {brand.brandName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="col-lg-10 mx-auto mb-12">
        <div className="card my-2 shadow">
          <div className="card-body">
            <table className="table">
              <thead>
                <tr>
                  <th>{getColumnHeader("productName", "Product Name")}</th>
                  <th>{getColumnHeader("price", "Price")}</th>
                  <th>{getColumnHeader("brand", "Brand")}</th>
                  <th>{getColumnHeader("category", "Category")}</th>
                  <th>{getColumnHeader("rating", "Rating")}</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => {
                  return (
                    <tr key={product.id}>
                      <td>{product.productName}</td>
                      <td>{product.price}</td>
                      <td>{product.brand.brandName}</td>
                      <td>{product.category.categoryName}</td>
                      <td>
                        {[...Array(product.rating).keys()].map((n) => (
                          <i className="fa fa-star text-warning" key={n}></i>
                        ))}
                        {[...Array(5 - product.rating).keys()].map((n) => (
                          <i className="fa fa-star-o text-warning" key={n}></i>
                        ))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
