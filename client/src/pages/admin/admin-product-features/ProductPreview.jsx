// ProductPreview.jsx

import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import config from "../../../Functions/config";
import AdminNav from "../../../components/admin/admin-nav/AdminNav";
import AdminSidebar from "../../../components/admin/admin-sidebar/AdminSidebar";
import { FiCheckCircle, FiX } from "react-icons/fi";
import { useSidebarContext } from "../../../hooks/useSidebarContext";

const ProductPreview = () => {
  const [product, setProduct] = useState({
    product_id: "",
    name: "",
    description: "",
    features: "",
    price: "",
    availability_status: "",
    images: [],
  });
  const [success, setSuccess] = useState("");
  const { id } = useParams();
  const { isSidebarCollapsed, dispatch: sidebarDispatch } = useSidebarContext();

  const sidebarToggle = () => {
    sidebarDispatch({ type: "TOGGLE_SIDEBAR" });
  };

  const fetchProduct = async () => {
    try {
      const res = await axios.get(
        `${config.baseApiUrl}admin/product-features/details/${id}/`
      );
      setProduct(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.put(
        `${config.baseApiUrl}admin/product-features/details/${id}/`,
        product
      );
      setSuccess("Product details updated successfully.");
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  console.log(product);

  return (
    <>
      <div className="bg-[rgb(16,23,42)]">
        <AdminNav />
        <div className="flex min-h-screen pt-20">
          <div className="w-fit md:fixed top-20 left-0 min-h-screen bottom-0 md:block hidden z-50">
            <AdminSidebar sidebarToggle={sidebarToggle} />
          </div>

          <div
            className={`flex-1 min-h-screen overflow-auto transition-all duration-300 z-40 ${
              isSidebarCollapsed ? "md:ml-64 ml-0" : "md:ml-20 ml-0 md:px-16"
            }`}
          >
            <div className="flex pt-10 px-4 mb-12">
              <ul className="bg-slate-900 border border-gray-700 rounded-full py-2 px-4 -space-x-4 w-max flex items-center mt-4">
                <li className="bg-gray-800 text-purple-500 hover:underline rounded-l-full z-40 px-8 py-3 text-base cursor-pointer">
                  <Link to="/admin/dashboard">Dashboard</Link>
                </li>
                <li className="bg-gray-800 text-purple-500 hover:underline rounded-r-full z-40 px-8 py-3 text-base cursor-pointer">
                  <Link to="/admin/product-features">Product & Features</Link>
                </li>
                <li className="bg-purple-600 text-white underline rounded-r-full z-10 px-8 py-3 text-base cursor-pointer">
                  <Link to={`/admin/product-features-details/${id}`}>
                    Product & Features Details
                  </Link>
                </li>
              </ul>
            </div>
            <div className="px-4">
              <div className="text-white bg-slate-900 py-10 px-4 max-w-7xl mx-auto">
                <div className=" bg-slate-900 p-6 rounded-lg shadow-sm border border-gray-700">
                  <h1 className="text-3xl mb-6">Product Details</h1>
                  <div>
                    <div className="mb-4">
                      <label
                        htmlFor="product_id"
                        className="block text-sm font-medium text-white"
                      >
                        Product ID
                      </label>
                      <input
                        type="text"
                        id="product_id"
                        name="product_id"
                        value={product.product_id}
                        onChange={handleInputChange}
                        className="mt-1 block w-full bg-transparent rounded-md border-gray-700 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-white"
                      >
                        Product Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={product.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full bg-transparent rounded-md border-gray-700 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-white"
                      >
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={product.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="mt-1 block w-full bg-transparent rounded-md border-gray-700 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="features"
                        className="block text-sm font-medium text-white"
                      >
                        Features
                      </label>
                      <textarea
                        id="features"
                        name="features"
                        value={product.features}
                        onChange={handleInputChange}
                        rows={4}
                        className="mt-1 block w-full bg-transparent rounded-md border-gray-700 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="price"
                        className="block text-sm font-medium text-white"
                      >
                        Price
                      </label>
                      <input
                        type="text"
                        id="price"
                        name="price"
                        value={product.price}
                        onChange={handleInputChange}
                        className="mt-1 block w-full bg-transparent rounded-md border-gray-700 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="availability_status"
                        className="block text-sm font-medium text-white"
                      >
                        Availability Status
                      </label>
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="product_created_at"
                        className="block text-sm font-medium text-white"
                      >
                        Created Date
                      </label>
                      <input
                        type="text"
                        id="product_created_at"
                        className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                        value={formatDate(product.created_at)}
                        readOnly
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="images"
                        className="block text-sm font-medium text-white"
                      >
                        Images
                      </label>
                      <div className="flex flex-wrap gap-4 mt-2">
                        {product.images &&
                          product.images.map((image, index) => (
                            <img
                              key={index}
                              src={`${config.baseApiImageUrl}${image.image}`}
                              alt={`Product Image ${index + 1}`}
                              className="rounded-lg border border-gray-700"
                              style={{ maxWidth: "150px", maxHeight: "150px" }}
                            />
                          ))}
                      </div>
                    </div>

                    {success && (
                      <div
                        className="mt-3 bg-purple-100 border-t-4 border-purple-600 rounded-lg p-4 dark:bg-purple-800/30"
                        role="alert"
                      >
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <span className="inline-flex justify-center items-center size-8 rounded-full border-4 border-purple-200 bg-purple-200 text-purple-800 dark:border-purple-900 dark:bg-purple-800 dark:text-purple-400">
                              <FiCheckCircle
                                size={24}
                                stroke="currentColor"
                                strokeWidth={2}
                              />
                            </span>
                          </div>
                          <div className="ms-3">
                            <h3 className="text-gray-800 font-semibold dark:text-white">
                              Success
                            </h3>
                            <p className="text-sm text-gray-700 dark:text-neutral-400">
                              {success}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="mt-6 flex justify-end">
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="py-2 px-4 border border-gray-700 text-sm font-medium rounded-md text-white bg-transparent hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductPreview;
