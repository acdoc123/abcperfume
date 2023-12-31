import { useState, useEffect } from "react";
import { getToken } from "../../apis/auth";
import { listCarts } from "../../apis/cart";
import MainLayout from "../../components/layout/MainLayout";
import Loading from "../../components/ui/Loading";
import Error from "../../components/ui/Error";
import Success from "../../components/ui/Success";
import StoreSmallCard from "../../components/card/StoreSmallCard";
import ListCartItemsForm from "../../components/list/ListCartItemsForm";

const CartPage = (props) => {
  const [isloading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [run, setRun] = useState(false);

  const [carts, setCarts] = useState([]);

  const { _id, accessToken } = getToken();

  const init = () => {
    setError("");
    setSuccess("");
    setIsLoading(true);
    listCarts(_id, accessToken, { limit: "1000", page: "1" })
      .then((data) => {
        if (data.error) setError(data.error);
        else if (data.carts.length <= 0) setSuccess("Your cart is empty.");
        else setCarts(data.carts);
        setIsLoading(false);
      })
      .catch((error) => {
        setError("Server error");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    init();
  }, [run]);

  return (
    <MainLayout>
      <div className="position-relative">
        {isloading && <Loading />}
        {error ? (
          <Error msg={error} />
        ) : success ? (
          <Success msg={success} />
        ) : (
          <div className="accordion" id="accordionPanelsStayOpen">
            {carts.map((cart, index) => (
              <div className="accordion-item" key={index}>
                <h2
                  className="accordion-header"
                  id={`panelsStayOpen-heading-${index}`}
                >
                  <button
                    className="accordion-button btn"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#panelsStayOpen-collapse-${index}`}
                    aria-expanded="true"
                    aria-controls={`panelsStayOpen-collapse-${index}`}
                  >
                    <StoreSmallCard store={cart.storeId} />
                  </button>
                </h2>
                <div
                  id={`panelsStayOpen-collapse-${index}`}
                  className="accordion-collapse collapse show"
                  aria-labelledby={`panelsStayOpen-collapse-${index}`}
                >
                  <div className="accordion-body px-2">
                    {cart.storeId && !cart.storeId.isActive && (
                      <Error msg="This store is banned by ABCPerfume!" />
                    )}

                    {cart.storeId &&
                      cart.storeId.isActive &&
                      !cart.storeId.isOpen && (
                        <Error msg="This store is closed, can't order in this time!" />
                      )}

                    {cart.storeId &&
                      cart.storeId.isActive &&
                      cart.storeId.isOpen && (
                        <ListCartItemsForm
                          cartId={cart._id}
                          storeId={cart.storeId._id}
                          userId={cart.userId._id}
                          onRun={() => setRun(!run)}
                        />
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CartPage;
