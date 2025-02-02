import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(7);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [noProducts, setNoProducts] = useState(false);
  const [cartProducts, setCartProducts] = useState([]);
  const [resetFlag, setResetFlag] = useState(false);

  useEffect(() => {
    fetchProducts();
    loadCartFromStorage();
  }, [page, resetFlag]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setNoProducts(false);

      setTimeout(async () => {
        const response = await axios.get("http://localhost:8010/api/product", {
          params: { page, limit, query: searchQuery || "" },
        });

        if (response.data.products.length === 0) {
          setNoProducts(true);
        }

        setProducts(response.data.products);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const resetSearch = async () => {
    setSearchQuery("");
    setPage(1);
    setNoProducts(false);
    setProducts([]);
    setResetFlag((prev) => !prev);
  };

  const loadCartFromStorage = () => {
    const productDetails = JSON.parse(localStorage.getItem("productDetails")) || [];
    setCartProducts(productDetails.map(item => item.id));
  };

  const addToCart = async (product) => {
    try {
      let cartId = localStorage.getItem("cartId");
      if (!cartId) {
        const cartResponse = await axios.post(
          "http://localhost:8010/api/cart/createCart"
        );
        cartId = cartResponse.data.cartId;
        localStorage.setItem("cartId", cartId);
      }

      

      await axios.post("http://localhost:8010/api/cart/addToCart", {
        cartId: parseInt(cartId),
        items: [{ productId: parseInt(product.id), quantity: 1 }],
      });

      const updatedCart = [...cartProducts, product.id];
      const productDetails =
        JSON.parse(localStorage.getItem("productDetails")) || [];

      if (!productDetails.some((item) => item.id === product.id)) {
        productDetails.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1
        });
        localStorage.setItem("productDetails", JSON.stringify(productDetails));
      }

      setCartProducts(updatedCart);
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  const removeFromCart = async (product) => {

    const cartId = localStorage.getItem("cartId");

    await axios.put("http://localhost:8010/api/cart/edit" ,{
      cartId: parseInt(cartId),
      items: [{
        productId: parseInt(product.id),
        quantity: 0
      }]
    })


    const updatedCart = cartProducts.filter((id) => id !== product.id);
   
    const productDetails =
      JSON.parse(localStorage.getItem("productDetails")) || [];
    const updatedProductDetails = productDetails.filter(
      (item) => item.id !== product.id
    );
    localStorage.setItem(
      "productDetails",
      JSON.stringify(updatedProductDetails)
    );
    setCartProducts(updatedCart);
  };


  


  return (
    <div className="container mx-auto p-4 ">
      <div className="text-right text-xl text-gray-600 mb-4">
        {cartProducts.length > 0 ? (
          <div>
            {" "}
            <Link to="cart">🛒 {cartProducts.length}</Link>
          </div>
        ) : (
          <div>
            <Link to="cart">🛒 </Link>
          </div>
        )}
      </div>

      <h1 className="text-2xl font-bold mb-4 text-center md:text-left">
        Books Store
      </h1>

      <form
        className="flex flex-col md:flex-row items-center md:space-x-4 mb-4"
        onSubmit={(e) => {
          e.preventDefault();
          fetchProducts();
        }}
      >
        <div className="w-full md:w-auto">
          <input
            type="search"
            className="p-2 border rounded w-full md:w-72"
            placeholder="Search for books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full md:w-auto mt-2 md:mt-0">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded w-full md:w-auto"
          >
            Search
          </button>
        </div>

        <div className="w-full md:w-auto mt-2 md:mt-0">
          <label className="block md:inline-block text-md md:text-base">
            Items per page:
            <input
              type="number"
              className="ml-2 p-1 border rounded"
              min="1"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
            />
          </label>
        </div>

        <div className="w-full md:w-auto mt-2 md:mt-0">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              fetchProducts();
            }}
            className="bg-yellow-600 text-white px-4 py-2 rounded w-full md:w-auto"
          >
            Filter
          </button>
        </div>
      </form>

      {loading && <div className="text-center">Loading...</div>}
      {noProducts && !loading && (
        <div>
          <div className="text-center text-gray-500">No book in store</div>
          <div className="text-center mt-5">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
              onClick={resetSearch}
            >
              Show all books
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 shadow">
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-500">price: ฿{product.price}</p>
            {cartProducts.includes(product.id) ? (
              <div className="flex items-center space-x-2">
                <button
                  className="text-white bg-gray-500 rounded-lg px-5 py-2.5 cursor-pointer"
                  disabled
                >
                  This book in cart already
                </button>
                <button
                  onClick={() => removeFromCart(product)}
                  className="text-red-500 font-bold px-2 py-1 border border-red-500 rounded cursor-pointer"
                >
                  X
                </button>
              </div>
            ) : (
              <button
                onClick={() => addToCart(product)}
                className="text-white bg-green-700 hover:bg-green-800 rounded-lg px-2 py-2.5 cursor-pointer mt-3"
              >
                add to cart
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
        >
          Prev
        </button>
        <span className="self-center">Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductPage;
