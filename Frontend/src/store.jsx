import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "./userContext";
import { BrandService, CategoriesService, ProductService } from "./service";
import { Product } from "./Product";

export function Store() {
  //get user context
  let userContext = useContext(UserContext);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsToShow, setProductsToShow] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      //get brands from db
      let brandResponse = await BrandService.fetchBrands();
      let brandResponseBody = await brandResponse.json();
      brandResponseBody.forEach((brand) => {
        brand.isChecked = true;
      });
      setBrands(brandResponseBody);

      //get categories from db
      let categoriesResponse = await CategoriesService.fetchCategoriess();
      let categoriesResponseBody = await categoriesResponse.json();
      categoriesResponseBody.forEach((categories) => {
        categories.isChecked = true;
      });
      setCategories(categoriesResponseBody);

      //get products from db
      let productResponse = await fetch(
        `/products?productName_like=${search}`,
        { method: "GET" }
      );
      let productResponseBody = await productResponse.json();
      if (productResponse.ok) {
        productResponseBody.forEach((product) => {
          //set brand
          product.brand = BrandService.getBrandByBrandId(
            brandResponseBody,
            product.brandId
          );

          //set category
          product.category = CategoriesService.getCategoryByCategoryId(
            categoriesResponseBody,
            product.categoryId
          );

          product.isOrdered = false;
        });
        setProducts(productResponseBody);
        setProductsToShow(productResponseBody);
        document.title = "Store - eCommerce";
      }
    })();
  }, [search]);

  //updateProductToShow
  let updateProductToShow = () => {
    setProductsToShow(
      products
        .filter((product) => {
          return (
            categories.filter(
              (category) =>
                category.id === product.categoryId && category.isChecked
            ).length > 0
          );
        })
        .filter((product) => {
          return (
            brands.filter(
              (brand) => brand.id === product.brandId && brand.isChecked
            ).length > 0
          );
        })
    );
  };

  //updateBrandsIsChecked
  let updateBrandsIsChecked = (brandId) => {
    let brandsData = brands.map((brand) => {
      if (brand.id === brandId) brand.isChecked = !brand.isChecked;
      return brand;
    });
    setBrands(brandsData);
    updateProductToShow();
  };

  //updateCategoryIsChecked
  let updateCategoryIsChecked = (categoryId) => {
    let categoriesData = categories.map((category) => {
      if (category.id === categoryId) category.isChecked = !category.isChecked;
      return category;
    });
    setBrands(categoriesData);
    updateProductToShow();
  };

  //when the user clicks on add to Cart button
  let onAddToCartClick = (product) => {
    (async () => {
      let newOrder = {
        userId: userContext.user.currentUserId,
        productId: product.id,
        quantity: 1,
        isPaymentCompleted: false,
      };

      let orderResponse = await fetch("/orders", {
        method: "POST",
        body: JSON.stringify(newOrder),
        headers: { "Content-Type": "application/json" },
      });
      if (orderResponse.ok) {
        await orderResponse.json();

        //isOrdered = true
        let prods = products.map((p) => {
          if (p.id === product.id) p.isOrdered = true;
          return p;
        });
        setProducts(prods);
        updateProductToShow();
      } else {
        // console.log(orderResponse);
      }
    })();
  };

  return (
    <div>
      <div className="row py-3 header">
        <div className="col-lg-3">
          <h4>
            <i className="fa fa-shopping-bag"></i>Store{" "}
            <span className="badge bg-secondary">{productsToShow.length}</span>
          </h4>
        </div>
        <div className="col-lg-9">
          <input
            type="search"
            value={search}
            placeholder="Search"
            className="form-control"
            autoFocus="autoFocus"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-lg-3 py-2">
          <div className="my-2">
            <h5>Brands</h5>
            <ul className="list-group list-group-flush">
              {brands.map((brand) => (
                <li className="list-group-item" key={brand.id}>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      value="true"
                      checked={brand.isChecked}
                      onChange={() => {
                        updateBrandsIsChecked(brand.id);
                      }}
                      id={`brand${brand.id}`}
                    />
                    <label
                      htmlFor={`brand${brand.id}`}
                      className="form-check-label"
                    >
                      {" "}
                      {brand.brandName}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="my-2">
            <h5>Categories</h5>
            <ul className="list-group list-group-flush">
              {categories.map((category) => (
                <li className="list-group-item" key={category.id}>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      value="true"
                      checked={category.isChecked}
                      onChange={() => {
                        updateCategoryIsChecked(category.id);
                      }}
                      id={`category${category.id}`}
                    />
                    <label
                      htmlFor={`category/${category.id}`}
                      className="form-check-label"
                    >
                      {" "}
                      {category.categoryName}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-lg-9 py-2">
          <div className="row">
            {productsToShow.map((product) => (
              <Product
                key={product.id}
                product={product}
                onAddToCartClick={onAddToCartClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
