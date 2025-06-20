import React, { useEffect, useContext, useState, useCallback } from "react";
import { UserContext } from "./userContext";
import Order from "./order";
import { OrderService, ProductService } from "./service";

//getpreviousOrders
// let getPreviousOrders = (orders) => {
//   return orders.filter((ord) => ord.isPaymentCompleted === true);
// };

// //getCart
// let getCart = (orders) => {
//   return orders.filter((ord) => ord.isPaymentCompleted === false);
// };

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [showOrderDeletedAlert, setShowOrderDeletedAlert] = useState(false);
  const [showOrderPlacedAlert, setShowOrderPlacedAlert] = useState(false);

  //get context
  let userContext = useContext(UserContext);
  console.log(userContext);

  //load data from db function that fetches data from 'orders' api
  const loadDataFromDatabase = useCallback(async () => {
    let ordersResponse = await fetch(
      `/orders?userid=${userContext.user.currentUserId}`,
      { method: "GET" }
    );
    if (ordersResponse.ok) {
      //status code 200
      let ordersResponseBody = await ordersResponse.json();

      //get all data from products
      let productsResponse = await ProductService.fetchProducts();
      if (productsResponse.ok) {
        let productsResponseBody = await productsResponse.json();

        //read all orders data
        ordersResponseBody.forEach((order) => {
          order.product = ProductService.getProductById(
            productsResponseBody,
            order.productId
          );
        });

        console.log(ordersResponseBody);

        setOrders(ordersResponseBody);
      }
    }
  }, [userContext.user.currentUserId]);

  //executes only once - on initial render == componentDidMount method
  useEffect(() => {
    document.title = "Dashboard-eCommerce";

    //ex:- load data from database
    loadDataFromDatabase();
  }, [userContext.user.currentUserId, loadDataFromDatabase]);

  //when the user clicks on buy now button
  let onBuyNowClick = useCallback(
    async (orderId, userId, productId, quantity) => {
      if (window.confirm("DO you want to place order for this product!")) {
        let updateOrder = {
          id: orderId,
          userId: userId,
          productId: productId,
          quantity: quantity,
          isPaymentCompleted: true,
        };

        let orderResponse = await fetch(`/orders/${orderId}`, {
          method: "PUT",
          body: JSON.stringify(updateOrder),
          headers: { "Content-Type": "application/json" },
        });
        let orderResponseBody = await orderResponse.json();
        if (orderResponseBody.ok) {
          console.log("orderResponseBody", orderResponseBody);
          loadDataFromDatabase();
          setShowOrderPlacedAlert(true);
        }
      }
    },
    [loadDataFromDatabase]
  );

  //when user clicks on delete order
  let onDeleteClick = useCallback(
    async (orderId) => {
      if (window.confirm("DO you want to delete this order!")) {
        let orderResponse = await fetch(`/orders/${orderId}`, {
          method: "DELETE",
        });
        if (orderResponse.ok) {
          let orderResponseBody = await orderResponse.json();
          console.log("orderResponseBody-> delete", orderResponseBody);
          loadDataFromDatabase();
          setShowOrderDeletedAlert(true);
        }
      }
    },
    [loadDataFromDatabase]
  );

  return (
    <div className="row">
      <div className="col-12 py-3 header">
        <h4>
          {" "}
          <i className="fa fa-dashboard"></i>Dashboard{" "}
          <button
            className="btn btn-sm btn-info"
            onClick={loadDataFromDatabase}
          >
            <i className="fa fa-refresh"></i>Refresh
          </button>
        </h4>
      </div>
      <div className="col-12">
        <div className="row">
          {/* previous orders starts */}
          <div className="col-lg-6">
            <h4 className="py-2 my-2 text-info border-bottom border-info">
              <i className="fa fa-history"></i>Previous orders{" "}
              <span className="badge bg-info">
                {OrderService.getPreviousOrders(orders).length}
              </span>
            </h4>

            {OrderService.getPreviousOrders(orders).length === 0 ? (
              <div className="text-danger">No Orders</div>
            ) : (
              ""
            )}

            {OrderService.getPreviousOrders(orders).map((order) => {
              return (
                <Order
                  key={order.id}
                  orderId={order.id}
                  productId={order.productId}
                  userId={order.userId}
                  isPaymentCompleted={order.isPaymentCompleted}
                  quantity={order.quantity}
                  productName={order.product.productName}
                  price={order.product.price}
                  onBuyNowClick={onBuyNowClick}
                  onDeleteClick={onDeleteClick}
                />
              );
            })}
          </div>
          {/* previous orders starts */}

          {/* cart starts */}
          <div className="col-lg-6">
            <h4 className="py-2 my-2 text-primary border-bottom border-primary">
              <i className="fa fa-shopping-cart"></i>Cart{" "}
              <span className="badge bg-primary">
                {OrderService.getCart(orders).length}
              </span>
            </h4>

            {showOrderPlacedAlert && (
              <div className="col-12">
                <div
                  className="alert alert-success alert-dismissible fade show mt-2"
                  role="alert"
                >
                  Your order has been placed successfully!
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                  ></button>
                </div>
              </div>
            )}

            {showOrderDeletedAlert && (
              <div className="col-12">
                <div
                  className="alert alert-danger alert-dismissible fade show mt-2"
                  role="alert"
                >
                  Your order has been removed from Cart!
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                  ></button>
                </div>
              </div>
            )}

            {OrderService.getCart(orders).length === 0 ? (
              <div className="text-danger">No Products in your cart!</div>
            ) : (
              ""
            )}

            {OrderService.getCart(orders).map((order) => {
              return (
                <Order
                  key={order.id}
                  orderId={order.id}
                  productId={order.productId}
                  userId={order.userId}
                  isPaymentCompleted={order.isPaymentCompleted}
                  quantity={order.quantity}
                  productName={order.product.productName}
                  price={order.product.price}
                  onBuyNowClick={onBuyNowClick}
                  onDeleteClick={onDeleteClick}
                />
              );
            })}
          </div>
          {/* cart ends */}
        </div>
      </div>
    </div>
  );
}
