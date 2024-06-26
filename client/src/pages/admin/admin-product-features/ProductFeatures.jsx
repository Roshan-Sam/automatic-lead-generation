import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiEdit, FiTrash } from "react-icons/fi";
import { CiFilter, CiMenuKebab } from "react-icons/ci";
import { Modal } from "react-responsive-modal";
import { MdOutlineCategory, MdOutlineAddCircle, MdClose } from "react-icons/md";
import "react-photo-view/dist/react-photo-view.css";
import { PhotoProvider, PhotoView } from "react-photo-view";
import AdminNav from "../../../components/admin/admin-nav/AdminNav";
import AdminSidebar from "../../../components/admin/admin-sidebar/AdminSidebar";
import { useSidebarContext } from "../../../hooks/useSidebarContext";
import config from "../../../Functions/config";
import "./productfeatures.css";

const ProductFeatures = () => {
  const [products, setProducts] = useState([]);
  const [addProductForm, setAddProductForm] = useState({
    name: "",
    description: "",
    features: "",
    images: [],
  });

  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    features: "",
  });

  const [openDropdown, setOpenDropdown] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const onOpenModal = () => setOpenModal(true);
  const onCloseModal = () => setOpenModal(false);

  const [openEditModal, setOpenEditModal] = useState(false);
  const onOpenEditModal = () => setOpenEditModal(true);
  const onCloseEditModal = () => setOpenEditModal(false);
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    features: "",
    images: "",
  });
  const [editErrors, setEditErrors] = useState({
    name: "",
    description: "",
    features: "",
  });
  const { isSidebarCollapsed, dispatch: sidebarDispatch } = useSidebarContext();

  const sidebarToggle = () => {
    sidebarDispatch({ type: "TOGGLE_SIDEBAR" });
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `${config.baseApiUrl}admin/product-features/`
      );
      if (res.status === 200) {
        setProducts(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleDropdown = (id) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setAddProductForm({ ...addProductForm, [id]: value });

    if (value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [id]: "",
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setAddProductForm({ ...addProductForm, images: files });

    if (files.length > 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        images: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!addProductForm.name) newErrors.name = "Name is required";
    if (!addProductForm.description)
      newErrors.description = "Description is required";
    if (!addProductForm.features) newErrors.features = "Features are required";
    if (addProductForm.images.length === 0)
      newErrors.images = "At least one image is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", addProductForm.name);
      formData.append("description", addProductForm.description);
      formData.append("features", addProductForm.features);
      addProductForm.images.forEach((image, index) => {
        formData.append(`images`, image);
      });

      const res = await axios.post(
        `${config.baseApiUrl}admin/product-features/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 200) {
        setSuccess("Product added successfully.");
        setProducts([res.data, ...products]);
        setTimeout(() => {
          setSuccess("");
          onCloseModal();
        }, 3000);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (!openModal) {
      setAddProductForm({
        name: "",
        description: "",
        features: "",
        images: [],
      });
      setErrors({
        name: "",
        description: "",
        features: "",
        images: "",
      });
    }
  }, [openModal]);

  const handleEdit = (product) => {
    console.log(product);
  };

  const handleDelete = (id) => {};

  console.log(products);
  console.log(addProductForm);
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
            <div className="flex pt-10 px-4">
              <ul className="bg-slate-900 border border-gray-700 rounded-full py-2 px-4 -space-x-4 w-max flex items-center mt-4">
                <li className="bg-gray-800 text-purple-500 hover:underline rounded-full z-40 px-8 py-3 text-base cursor-pointer">
                  <Link to="/admin-dash?tab=dash">Dashboard</Link>
                </li>
                <li className="bg-purple-600 text-white underline rounded-r-full z-10 px-8 py-3 text-base cursor-pointer">
                  <Link to="/admin-dash?tab=plan-pricing">Plan & Pricing</Link>
                </li>
              </ul>
            </div>

            <div className="text-white px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
              <div className="flex flex-col">
                <div className="-m-1.5 overflow-x-auto">
                  <div className="p-1.5 min-w-full inline-block align-middle">
                    <div className="bg-slate-900 shadow-gray-500 border border-gray-700 rounded-xl shadow-sm overflow-hidden dark:bg-neutral-800 dark:border-neutral-700">
                      <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-400 dark:border-neutral-700">
                        <div>
                          <h2 className="text-xl font-semibold text-white dark:text-neutral-200">
                            Products and Features
                          </h2>
                          <p className="text-sm text-white dark:text-neutral-400">
                            Here are the products and can be added, deleted and
                            updated.
                          </p>
                          <div className="sm:col-span-1 mt-2">
                            <label className="sr-only">Search</label>
                            <div className="relative">
                              <input
                                type="text"
                                id="search"
                                name="search"
                                className="py-2 px-3 ps-11 text-white block w-full bg-slate-900 border-gray-700 rounded-lg text-sm focus:border-purple-600 focus:ring-purple-600 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                placeholder="Search by product name"
                                //   value={searchTerm}
                                //   onChange={handleSearchChange}
                              />
                              <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4">
                                <svg
                                  className="flex-shrink-0 size-4 text-slate-400 dark:text-neutral-500"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <circle cx="11" cy="11" r="8" />
                                  <path d="m21 21-4.3-4.3" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-4">
                          <div className="flex md:justify-end">
                            <button
                              onClick={onOpenModal}
                              className="py-3 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-purple-700 text-slate-950 hover:bg-purple-700 bg-purple-600 disabled:opacity-50 disabled:pointer-events-none"
                            >
                              <svg
                                className="flex-shrink-0 size-4"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M5 12h14" />
                                <path d="M12 5v14" />
                              </svg>
                              Add New Product
                            </button>
                          </div>
                          <div className="flex gap-2">
                            <div>
                              <button
                                //   onClick={handleClear}
                                type="button"
                                className="py-2 px-4 text-white inline-flex items-center gap-x-1 hover:bg-gray-800 focus:bg-transparent focus:ring-1 focus:ring-purple-600 focus:border-purple-600 text-sm rounded-lg border border-gray-700 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                              >
                                <CiFilter className="size-4 text-white" />
                                Clear
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <table className="min-w-full divide-y divide-gray-700 dark:divide-neutral-700">
                        <thead className="bg-gray-800 dark:bg-neutral-800">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wide text-white"
                            >
                              No
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wide text-white"
                            >
                              Image
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wide text-white"
                            >
                              Product Name
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wide text-white"
                            >
                              Description
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wide text-white"
                            >
                              Features
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-end text-xs font-semibold uppercase tracking-wide text-white"
                            >
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700 dark:divide-neutral-700">
                          {products.map((product, index) => (
                            <tr key={product.id}>
                              <td className="px-6 py-3 whitespace-nowrap">
                                {index + 1}
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap">
                                {product.images.length > 0 && (
                                  <PhotoProvider
                                    bannerVisible={false}
                                    speed={() => 300}
                                  >
                                    <PhotoView
                                      src={`${config.baseApiImageUrl}${product.images[0].image}`}
                                      key={0}
                                    >
                                      <img
                                        src={`${config.baseApiImageUrl}${product.images[0].image}`}
                                        alt={product.name}
                                        className="w-16 h-16 object-cover rounded-lg cursor-pointer"
                                      />
                                    </PhotoView>

                                    {product.images.length > 1 && (
                                      <div className="flex flex-wrap mt-2 gap-2">
                                        {product.images
                                          .slice(1)
                                          .map((img, idx) => (
                                            <PhotoView
                                              src={`${config.baseApiImageUrl}${img.image}`}
                                              key={idx + 1}
                                            >
                                              <img
                                                src={`${config.baseApiImageUrl}${img.image}`}
                                                alt={product.name}
                                                className="w-10 h-10 object-cover rounded-lg cursor-pointer"
                                              />
                                            </PhotoView>
                                          ))}
                                      </div>
                                    )}
                                  </PhotoProvider>
                                )}
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap">
                                {product.name}
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap">
                                {product.description}
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap">
                                <ul className="list-decimal pl-5">
                                  {product.features
                                    .split(",")
                                    .map((feature, i) => (
                                      <li key={i}>{feature.trim()}</li>
                                    ))}
                                </ul>
                              </td>
                              <td
                                className="px-6 py-3 whitespace-nowrap text-end"
                                onMouseLeave={() => setOpenDropdown(null)}
                              >
                                <div className="relative flex justify-center text-left w-full">
                                  <div className="relative group rounded-xl w-fit border border-gray-700">
                                    <button
                                      onClick={() => toggleDropdown(product.id)}
                                      type="button"
                                      className="bg-primary flex items-center rounded-lg px-3 py-2 text-base font-medium"
                                    >
                                      <CiMenuKebab className="rotate-90 text-white" />
                                    </button>
                                    {openDropdown === product.id && (
                                      <div
                                        onMouseLeave={() =>
                                          setOpenDropdown(null)
                                        }
                                        className="absolute mt-1 right-0 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10"
                                      >
                                        <button
                                          onClick={() => handleEdit(product)}
                                          className="px-4 py-2 text-sm text-blue-600 hover:bg-gray-700 w-full text-left flex items-center"
                                        >
                                          <FiEdit className="mr-2" />
                                          Edit
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleDelete(product.id)
                                          }
                                          className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-700 w-full text-left"
                                        >
                                          <FiTrash className="mr-2" />
                                          Delete
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-400 dark:border-neutral-700">
                        <div>
                          <p className="text-sm text-white dark:text-neutral-400">
                            <span className="font-semibold text-white dark:text-neutral-200">
                              {products.length}{" "}
                            </span>
                            results
                          </p>
                        </div>

                        <div>
                          <div className="inline-flex gap-x-2">
                            <button
                              // onClick={loadMoreProducts}
                              // disabled={!hasMore}
                              type="button"
                              className="py-1.5 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-700 text-white shadow-sm hover:bg-slate-800 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                            >
                              Load Next
                              <svg
                                className="flex-shrink-0 size-4"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M5 9l6 6 6-6" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* add new prodduct modal */}

            <Modal
              open={openModal}
              onClose={onCloseModal}
              center
              classNames={{
                modal: "productfeatures",
              }}
              closeIcon
            >
              <div className="relative flex flex-col bg-gray-900 shadow-lg rounded-xl dark:bg-neutral-800 border-none">
                <div className="relative overflow-hidden min-h-32 bg-gray-900 text-center">
                  <div className="absolute top-2 end-2">
                    <button
                      onClick={onCloseModal}
                      type="button"
                      className="inline-flex flex-shrink-0 justify-center items-center size-8 rounded-md text-gray-500 hover:text-gray-400 focus:outline-none focus:border-none focus:ring-2 focus:ring-purple-600 transition-all text-sm"
                    >
                      <span className="sr-only">Close</span>
                      <MdClose className="flex-shrink-0 size-4" />
                    </button>
                  </div>

                  <figure className="absolute inset-x-0 bottom-0">
                    <svg
                      preserveAspectRatio="none"
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      viewBox="0 0 1920 100.1"
                    >
                      <path
                        fill="currentColor"
                        className="fill-white dark:fill-neutral-800"
                        d="M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z"
                      ></path>
                    </svg>
                  </figure>
                </div>

                <div className="relative z-10 -mt-12">
                  <span className="mx-auto flex justify-center items-center size-[62px] rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400">
                    <MdOutlineCategory className="size-8 text-gray-800" />
                  </span>
                </div>

                <div className="p-4 overflow-y-auto">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-white">
                      Add Product
                    </h3>
                  </div>
                  <div className="px-4 py-10 mx-auto w-full">
                    <div className="mt-0 w-full mx-auto">
                      <div className="flex flex-col border border-gray-700 rounded-xl p-4 sm:p-6 lg:p-8 dark:border-neutral-700">
                        <h2 className="mb-8 text-xl font-semibold text-white">
                          Fill the product details
                        </h2>
                        <div className="mb-2">
                          <label className="block mb-2 text-sm text-white font-medium">
                            Product Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            className="bg-transparent border border-gray-700 text-white text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
                            placeholder="product name"
                            required
                            value={addProductForm.name}
                            onChange={handleChange}
                          />
                          {errors.name && (
                            <p className="text-red-600 text-sm font-medium">
                              {errors.name}
                            </p>
                          )}
                        </div>
                        <div className="mb-2">
                          <label className="block mb-2 text-sm text-white font-medium">
                            Description
                          </label>
                          <textarea
                            id="description"
                            rows="4"
                            className="bg-transparent border border-gray-700 text-white text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
                            placeholder="description"
                            value={addProductForm.description}
                            onChange={handleChange}
                          />
                          {errors.description && (
                            <p className="text-red-600 text-sm font-medium">
                              {errors.description}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block mb-2 text-sm text-white font-medium dark:text-white">
                            Features
                          </label>
                          <textarea
                            id="features"
                            rows="4"
                            className="bg-transparent border border-gray-700 text-white text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
                            placeholder="features"
                            value={addProductForm.features}
                            onChange={handleChange}
                          />
                          <p className="text-xs text-gray-400 mt-1">
                            ( Add commas to separate features )
                          </p>
                          {errors.features && (
                            <p className="text-red-600 text-sm font-medium">
                              {errors.features}
                            </p>
                          )}
                        </div>
                        <div className="mt-3">
                          <label className="block mb-2 text-sm text-white font-medium dark:text-white">
                            Upload Images
                          </label>
                          <input
                            type="file"
                            id="images"
                            name="images"
                            onChange={handleImageChange}
                            className="file-input file-input-bordered border border-gray-700 rounded-md text-white w-full focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600"
                            multiple
                            required
                            accept="image/*"
                          />
                          {errors.images && (
                            <p className="text-red-600 text-sm font-medium">
                              {errors.images}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    {success && (
                      <div
                        className="mt-3 bg-purple-100 border-t-2 border-purple-600 rounded-lg p-4 dark:bg-purple-800/30"
                        role="alert"
                      >
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <span className="inline-flex justify-center items-center size-8 rounded-full border-4 border-purple-100 bg-purple-200 text-purple-800 dark:border-purple-900 dark:bg-purple-800 dark:text-purple-400">
                              <svg
                                className="flex-shrink-0 size-4"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                                <path d="m9 12 2 2 4-4"></path>
                              </svg>
                            </span>
                          </div>
                          <div className="ms-3">
                            <h3 className="text-gray-800 font-semibold dark:text-white">
                              Product and Features.
                            </h3>
                            <p className="text-sm text-gray-700 dark:text-neutral-400">
                              {success}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end gap-x-2">
                    <a
                      onClick={handleSubmit}
                      className="p-2.5 inline-flex items-center gap-x-2 text-sm font-medium cursor-pointer rounded-md border border-gray-700 text-white hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <MdOutlineAddCircle className="size-5" />
                      Add Product
                    </a>
                  </div>
                </div>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductFeatures;
