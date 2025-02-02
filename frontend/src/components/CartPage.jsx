import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const cartId = localStorage.getItem("cartId");
  const storedProducts = localStorage.getItem("productDetails");

  useEffect(() => {
    try {
      if (storedProducts) {
        try {
          const productDetails = JSON.parse(storedProducts);
          if (Array.isArray(productDetails)) {
            setCartProducts(productDetails);
          } else {
            throw new Error("Invalid data format");
          }
        } catch (parseError) {
          console.error("Error parsing localStorage data:", parseError);
          setCartProducts([]);
          localStorage.removeItem("productDetails");
        }
      } else {
        setCartProducts([]);
      }
    } catch (error) {
      console.error("Unexpected error accessing localStorage:", error);
      setCartProducts([]);
    }
  }, []);

  const removeFromCart = async (product) => {
    await axios.put("http://localhost:8010/api/cart/edit", {
      cartId: parseInt(cartId),
      items: [
        {
          productId: parseInt(product.id),
          quantity: 0,
        },
      ],
    });

    const updatedCart = cartProducts.filter((item) => item.id !== product.id);
    try {
      localStorage.setItem("productDetails", JSON.stringify(updatedCart));
      setCartProducts(updatedCart);
    } catch (error) {
      console.error("Error updating localStorage:", error);
    }
  };

  const confirmProductCart = async () => {
    if (!cartProducts.length) return;

    const items = cartProducts.map((product) => ({
      productId: parseInt(product.id),
      quantity: product.quantity || 1,
    }));

    try {
      await axios.put("http://localhost:8010/api/cart/edit", {
        cartId: parseInt(cartId),
        items,
      });
      console.log("Cart confirmed successfully!");
    } catch (error) {
      console.error("Error confirming cart:", error);
    }
  };

  const handleCheckout = async () => {
    try {
      await confirmProductCart();

      await axios.post(`http://localhost:8010/api/cart/confirm/${cartId}`);
      localStorage.clear();
      setShowSuccess(true);

      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  const sortedCartProducts = cartProducts.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const addProductCount = (product) => {
    const updatedCart = cartProducts.map((item) =>
      item.id === product.id
        ? { ...item, quantity: (item.quantity || 1) + 1 }
        : item
    );

    setCartProducts(updatedCart);

    try {
      localStorage.setItem("productDetails", JSON.stringify(updatedCart));
    } catch (error) {
      console.error("error in update localStorage:", error);
    }
  };

  const removeProductCount = (product) => {
    const updatedCart = cartProducts.map((item) =>
      item.id === product.id && (item.quantity || 1) > 1
        ? { ...item, quantity: (item.quantity || 1) - 1 }
        : item
    );
    setCartProducts(updatedCart);

    try {
      localStorage.setItem("productDetails", JSON.stringify(updatedCart));
    } catch (error) {
      console.error("error in update localStorage:", error);
    }
  };

  const calculateDiscount = () => {
    let totalDiscount = 0;

    if (!Array.isArray(cartProducts)) return 0;

    const uniqueProductIds = new Set(cartProducts.map((item) => item.id));
    const uniqueProductCount = uniqueProductIds.size;

    cartProducts.forEach((product) => {
      let discount = 0;

      switch (uniqueProductCount) {
        case 1:
          discount = 0;
          break;
        case 2:
          discount = 0.1 * 2 * product.price;
          break;
        case 3:
          discount = 0.2 * 3 * product.price;
          break;
        case 4:
          discount = 0.3 * 4 * product.price;
          break;
        case 5:
          discount = 0.4 * 5 * product.price;
          break;
        case 6:
          discount = 0.5 * 6 * product.price;
          break;
        case 7:
          discount = 0.6 * 7 * product.price;
          break;
        default:
          discount = 0;
      }

      totalDiscount = parseInt(discount);
    });

    return totalDiscount;
  };

  const calculatePriceNoDiscount = () => {
    if (!Array.isArray(cartProducts)) return 0;

    return cartProducts.reduce((total, product) => {
      return total + product.price * (product.quantity || 1);
    }, 0);
  };

  const totalPrice = () => {
    return calculatePriceNoDiscount() - calculateDiscount();
  };

  return (
    <section className="py-12 relative">
      <div className="w-full max-w-6xl px-4 md:px-5 lg:px-6 mx-auto">
        <h2 className="title font-manrope font-bold text-3xl md:text-4xl leading-8 md:leading-10 mb-6 text-center text-black">
          Shopping Cart
        </h2>

        {cartProducts.length === 0 ? (
          <div className="text-center text-gray-500">
            No books in the cart.{" "}
            <Link to="/" className="text-blue-500">
              Continue shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center text-gray-500 mb-3">
              Do you want more books?{" "}
              <Link to="/" className="text-blue-500">
                Books Store
              </Link>
            </div>
            {sortedCartProducts.map((product) => (
              <div
                key={product.id}
                className="rounded-2xl border-2 border-gray-200 p-4 lg:p-6 grid grid-cols-12 mb-6 gap-y-4"
              >
                <div className="col-span-12 lg:col-span-2 img box"></div>
                <div className="col-span-12 lg:col-span-10 detail w-full lg:pl-3">
                  <div className="flex items-center justify-between w-full mb-3">
                    <h5 className="font-manrope font-bold text-xl md:text-2xl leading-6 md:leading-9 text-gray-900">
                      {product.name}
                    </h5>
                    <button
                      onClick={() => removeFromCart(product)}
                      className="rounded-full cursor-pointer group flex items-center justify-center focus:outline-blue-500 bg-red-500 text-white text-xl w-8 h-8"
                    >
                      X
                    </button>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => removeProductCount(product)}
                        className="group cursor-pointer rounded-[50px] border border-gray-200 shadow-sm p-2 flex items-center justify-center bg-white"
                      >
                        <svg
                          className="stroke-gray-900 transition-all duration-500 group-hover:stroke-black"
                          width="16"
                          height="17"
                          viewBox="0 0 18 19"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4.5 9.5H13.5"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                      <div className="border border-gray-200 rounded-full w-8 md:w-10 aspect-square outline-none text-gray-900 font-semibold text-sm py-2 px-3 bg-gray-100 text-center">
                        {product.quantity}
                      </div>
                      <button
                        onClick={() => addProductCount(product)}
                        className="group cursor-pointer rounded-[50px] border border-gray-200 shadow-sm p-2 flex items-center justify-center bg-white"
                      >
                        <svg
                          className="stroke-gray-900 transition-all duration-500 group-hover:stroke-black"
                          width="16"
                          height="17"
                          viewBox="0 0 18 19"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3.75 9.5H14.25M9 14.75V4.25"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    </div>
                    <h6 className="text-blue-600 font-manrope font-bold text-xl md:text-2xl leading-6 md:leading-9 text-right">
                      ฿{product.price * product.quantity}
                    </h6>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex flex-col md:flex-row items-center justify-between lg:px-6 pb-6  border-gray-200">
              <h5 className="text-green-900 font-manrope font-semibold text-xl md:text-2xl leading-6 w-full max-md:text-center max-md:mb-4">
                Price No Discount
              </h5>
              <div className="flex items-center justify-between gap-5">
                <h6 className="font-manrope mb-4 font-bold text-2xl md:text-3xl text-green-600">
                  ฿{calculatePriceNoDiscount()}
                </h6>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between lg:px-6 pb-6  border-gray-200">
              <h5 className="text-red-900 font-manrope font-semibold text-xl md:text-2xl leading-6 w-full max-md:text-center max-md:mb-4">
                Discount
              </h5>
              <div className="flex items-center justify-between gap-5">
                <h6 className="font-manrope mb-4 font-bold text-2xl md:text-3xl text-red-600">
                  ฿{calculateDiscount()}
                </h6>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between lg:px-6 pb-6 border-b border-gray-200">
              <h5 className="text-gray-900 font-manrope font-semibold text-xl md:text-2xl leading-6 w-full max-md:text-center max-md:mb-4">
                Total Price
              </h5>
              <div className="flex items-center justify-between gap-5">
                <h6 className="font-manrope font-bold text-2xl md:text-3xl text-blue-600">
                  ฿{totalPrice()}
                </h6>
              </div>
            </div>

            <div className="max-lg:max-w-lg max-lg:mx-auto text-center mt-4">
              <button
                onClick={handleCheckout}
                className="rounded-full cursor-pointer py-3 px-5 bg-blue-600 text-white font-semibold text-lg w-full text-center transition-all duration-500 hover:bg-blue-700"
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>

      {showSuccess && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-opacity-50 z-10">
          <div className="bg-white p-10 rounded-lg shadow-lg text-center">
            <div className="bg-green-500 p-5 rounded-full mb-4">
              <svg
                className="w-12 h-12 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Buy success!
            </h2>
            <p className="text-lg text-gray-500">go to Books Store...</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default CartPage;
