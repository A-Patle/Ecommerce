import React, { useState } from "react";

export function Product(props) {
  const [product] = useState(props.product);

  return (
    <div className="col-lg-6">
      <div className="card m-1">
        <div className="card-body">
          <h5>
            <i className="fa fa-arrow-right"></i>
            {product.productName}
          </h5>
          <div>${product.price.toFixed(2)}</div>
          <div className="mt-2 text-muted">
            #{product.brand.brandName} #{product.category.categoryName}
          </div>
          <div>
            {[...Array(product.rating).keys()].map((n) => (
              <i className="fa fa-star text-warning" key={n}></i>
            ))}
            {[...Array(5 - product.rating).keys()].map((n) => (
              <i className="fa fa-star-o text-warning" key={n}></i>
            ))}
          </div>

          <div className="float-end">
            {product.isOrdered ? (
              <span className="text-primary">Added to cart!</span>
            ) : (
              <button
                className="btn btn-sm btn-primary"
                onClick={() => props.onAddToCartClick(product)}
              >
                <i className="fa fa-cart-plus"></i> Add to cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
