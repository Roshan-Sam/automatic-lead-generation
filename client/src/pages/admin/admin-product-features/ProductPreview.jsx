import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import config from "../../../Functions/config";
import AdminNav from "../../../components/admin/admin-nav/AdminNav";
import AdminSidebar from "../../../components/admin/admin-sidebar/AdminSidebar";
import { FiCheckCircle, FiTrash2, FiChevronDown } from "react-icons/fi";
import { FaCheckCircle, FaTimes, FaTrashAlt } from "react-icons/fa";
import {
  MdClose,
  MdOutlineFileUpload,
  MdOutlineAddCircle,
} from "react-icons/md";
import { BsImage } from "react-icons/bs";
import { useSidebarContext } from "../../../hooks/useSidebarContext";
import "react-photo-view/dist/react-photo-view.css";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

const ProductPreview = () => {
  const [product, setProduct] = useState({
    product_id: "",
    name: "",
    description: "",
    features: "",
    price: "",
    availability_status: "",
    images: [],
    created_at: "",
    category: {},
  });
  const [products1, setProducts1] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const [availabilityDropdown, setAvailabilityDropdown] = useState(false);
  const [success, setSuccess] = useState("");
  const [success1, setSuccess1] = useState("");
  const [success2, setSuccess2] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    features: "",
    product_id: "",
    price: "",
  });
  const [imageError, setImageError] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [deleteImageModal, setDeleteImageModal] = useState(false);
  const [imageIdToDelete, setImageIdToDelete] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [images, setImages] = useState([]);
  const filePickerRef = useRef();

  const { id } = useParams();
  const { isSidebarCollapsed, dispatch: sidebarDispatch } = useSidebarContext();

  const sidebarToggle = () => {
    sidebarDispatch({ type: "TOGGLE_SIDEBAR" });
  };

  const formatFeatures = (features) => {
    return features
      .split(",")
      .map((feature) => feature.trim())
      .filter((feature) => feature !== "")
      .join(", ");
  };

  const fetchProduct = async () => {
    try {
      const res = await axios.get(
        `${config.baseApiUrl}admin/product-features/details/${id}/`
      );
      setProduct({
        ...res.data,
        features: formatFeatures(res.data.features),
      });
      setSelectedCategory(res.data.category.name);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProducts1 = async () => {
    try {
      const res = await axios.get(
        `${config.baseApiUrl}admin/product-features/`
      );
      if (res.status === 200) {
        const filteredProducts = res.data.products.filter(
          (prod) => prod.id !== parseInt(id)
        );
        setProducts1(filteredProducts);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts1();
  }, [id]);

  const fetchProductImages = async (productId) => {
    try {
      const res = await axios.get(
        `${config.baseApiUrl}product-images/${productId}/`
      );
      setProductImages(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProductImages(id);
  }, [id]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${config.baseApiUrl}admin/add-category/`);
      if (res.status === 200) {
        setCategories(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, id } = e.target;
    setProduct({ ...product, [name]: value });

    let newErrors = { ...errors };

    if (id === "name") {
      newErrors.name = value.trim() ? "" : "Name is required";
    }
    if (id === "description") {
      newErrors.description = value.trim() ? "" : "Description is required";
    }
    if (id === "features") {
      newErrors.features = value.trim() ? "" : "Features are required";
    }
    if (id === "product_id") {
      newErrors.product_id = value.trim() ? "" : "Product ID is required";

      const productExists = products1.some(
        (prod) => prod.product_id === value.trim()
      );
      if (productExists) {
        newErrors.product_id = "Product ID already exists";
      }
    }
    if (id === "price") {
      newErrors.price = value.trim() ? "" : "Price is required";
    }

    setErrors(newErrors);
  };

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    setCategoryDropdown(false);
    setProduct({ ...product, category: categoryName });
  };

  const handleAvailabilitySelect = (status) => {
    setProduct({ ...product, availability_status: status });
    setAvailabilityDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!product.name) newErrors.name = "Name is required";
    if (!product.price) newErrors.price = "Price is required";
    if (!product.description) newErrors.description = "Description is required";
    if (!product.features) newErrors.features = "Features are required";
    if (!product.product_id) newErrors.product_id = "Product ID is required";
    if (products1.some((prod) => prod.product_id === product.product_id)) {
      newErrors.product_id = "Product ID already exists";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formattedFeatures = formatFeatures(product.features);

    try {
      const res = await axios.put(
        `${config.baseApiUrl}admin/product-features/update/${id}/`,
        {
          name: product.name,
          description: product.description,
          features: formattedFeatures,
          price: product.price,
          category: selectedCategory,
          availability_status: product.availability_status,
          product_id: product.product_id,
        }
      );
      if (res.status === 200) {
        setSuccess("Product details updated successfully.");
        fetchProducts1();
        setTimeout(() => {
          setSuccess("");
        }, [3000]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const handleDeleteImage = (imageId) => {
    setImageIdToDelete(imageId);
    setDeleteImageModal(true);
  };

  const confirmDeleteImage = async (imageId) => {
    try {
      const res = await axios.delete(
        `${config.baseApiUrl}delete-product-image/${imageId}/`
      );
      if (res.status === 200) {
        setProductImages(productImages.filter((image) => image.id !== imageId));
        setSuccess1(res.data.message);
        setTimeout(() => {
          setSuccess1("");
          setImageIdToDelete(null);
          setDeleteImageModal(false);
        }, 3000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const supportedFormats = ["image/jpeg", "image/png"];
    const maxFileSize = 1 * 1024 * 1024;

    let validFiles = [];
    let previews = [];
    let error = "";

    if (productImages.length + files.length > 4) {
      error = `You can only upload a maximum of ${
        4 - productImages.length
      } images.`;
      setImages([]);
      setImagePreviews([]);
    } else {
      files.forEach((file) => {
        if (!supportedFormats.includes(file.type)) {
          error += `Unsupported format: ${file.name}. Please upload JPG or PNG files. `;
          setImages([]);
          setImagePreviews([]);
        } else if (file.size > maxFileSize) {
          error += `File size exceeds 1MB: ${file.name}. Please upload smaller files. `;
          setImages([]);
          setImagePreviews([]);
        } else {
          validFiles.push(file);
          previews.push(URL.createObjectURL(file));
        }
      });
    }

    if (validFiles.length > 0) {
      setImages(validFiles);
      setImagePreviews(previews);
    }

    setImageError(error);
  };

  useEffect(() => {
    if (!openImageModal) {
      setImages([]);
      setImagePreviews([]);
      setImageError("");
      setSuccess2("");
    }
  }, [openImageModal]);

  const handleImageSubmit = async () => {
    if (images.length === 0) {
      setImageError("At least one image is required");
      return;
    }

    const formData = new FormData();
    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const res = await axios.post(
        `${config.baseApiUrl}product-images/${id}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.status === 200) {
        if (images.length === 1) {
          setSuccess2("Image uploaded successfully.");
        } else {
          setSuccess2(`${images.length} images uploaded successfully.`);
        }
        fetchProductImages(id);
        setTimeout(() => {
          setOpenImageModal(false);
        }, [3000]);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
            <div className="flex pt-10 px-4 mb-12 overflow-auto">
              <ul className="bg-slate-900 border border-gray-700 rounded-full py-2 px-4 -space-x-4 w-max flex items-center mt-4">
                <li className="bg-gray-800 text-purple-500 hover:underline rounded-l-full z-40 px-8 py-3 text-base cursor-pointer">
                  <Link to="/admin/dashboard">Dashboard</Link>
                </li>
                <li className="bg-gray-800 text-nowrap text-purple-500 hover:underline rounded-r-full z-40 px-8 py-3 text-base cursor-pointer">
                  <Link to="/admin/product-features">Product & Features</Link>
                </li>
                <li className="bg-purple-600 text-nowrap text-white underline rounded-r-full z-10 px-8 py-3 text-base cursor-pointer">
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
                    <div className="flex md:gap-4 md:flex-row flex-col">
                      <div className="mb-4 w-full">
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
                          className="mt-1 block w-full bg-transparent rounded-md border-gray-800 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                        />
                        {errors.product_id && (
                          <p className="text-red-600 text-sm font-medium">
                            {errors.product_id}
                          </p>
                        )}
                      </div>
                      <div className="mb-4 w-full">
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
                          className="mt-1 block w-full bg-transparent rounded-md border-gray-800 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                        />
                        {errors.name && (
                          <p className="text-red-600 text-sm font-medium">
                            {errors.name}
                          </p>
                        )}
                      </div>
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
                        className="mt-1 block w-full bg-transparent rounded-md border-gray-800 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                      />
                      {errors.description && (
                        <p className="text-red-600 text-sm font-medium">
                          {errors.description}
                        </p>
                      )}
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
                        className="mt-1 block w-full bg-transparent rounded-md border-gray-800 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                      />
                      <p className="text-sm text-gray-400 mt-2">
                        ( Add commas to separate features )
                      </p>
                      {errors.features && (
                        <p className="text-red-600 text-sm font-medium">
                          {errors.features}
                        </p>
                      )}
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
                        className="mt-1 block w-full bg-transparent rounded-md border-gray-800 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                      />
                      {errors.price && (
                        <p className="text-red-600 text-sm font-medium">
                          {errors.price}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="availability_status"
                        className="block text-sm font-medium text-white"
                      >
                        Category
                      </label>
                      <div className="mt-2 w-full">
                        <div className="relative  h-fit border border-gray-800 rounded-lg outline-none dropdown-one">
                          <button
                            onClick={() => {
                              setCategoryDropdown(!categoryDropdown);
                              setAvailabilityDropdown(false);
                            }}
                            className="relative flex items-center justify-between w-full px-3 py-2.5 focus:border-purple-600 focus:ring-2 focus:ring-purple-600 rounded-lg hover:bg-gray-800 focus:bg-transparent"
                          >
                            <span className="pr-4 text-sm text-white">
                              {selectedCategory}
                            </span>
                            <FiChevronDown
                              id="rotate1"
                              className="absolute z-10 cursor-pointer right-5 text-white"
                              size={14}
                            />
                          </button>
                          <div
                            onMouseLeave={() => setCategoryDropdown(false)}
                            className={`absolute right-0 z-20 ${
                              categoryDropdown ? "" : "hidden"
                            } w-full px-1 py-2 bg-white border-t border-gray-200 rounded shadow top-12 max-h-28 overflow-y-scroll select`}
                          >
                            {categories.map((category) => (
                              <a key={category.id}>
                                <p
                                  className="p-3 text-sm leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded"
                                  onClick={() =>
                                    handleCategorySelect(category.name)
                                  }
                                >
                                  {category.name}
                                </p>
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="availability_status"
                        className="block text-sm font-medium text-white"
                      >
                        Availability Status
                      </label>
                      <div className="mt-2 w-full">
                        <div className="relative h-fit border border-gray-700 rounded-lg outline-none dropdown-one">
                          <button
                            onClick={() =>
                              setAvailabilityDropdown(!availabilityDropdown)
                            }
                            className="relative flex items-center justify-between w-full px-3 py-2.5 focus:border-purple-600 focus:ring-2 focus:ring-purple-600 rounded-lg hover:bg-gray-800 focus:bg-transparent"
                          >
                            <span className="pr-4 text-sm text-white">
                              {product.availability_status}
                            </span>
                            <FiChevronDown
                              id="rotate2"
                              className="absolute z-10 cursor-pointer right-5 text-white"
                              size={14}
                            />
                          </button>
                          <div
                            onMouseLeave={() => setAvailabilityDropdown(false)}
                            className={`absolute right-0 z-20 ${
                              availabilityDropdown ? "" : "hidden"
                            } w-full px-1 py-2 bg-white border-t border-gray-200 rounded shadow top-12`}
                          >
                            {["In Stock", "Out of Stock", "Pre-Order"].map(
                              (status) => (
                                <p
                                  key={status}
                                  className="p-3 text-sm leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded"
                                  onClick={() =>
                                    handleAvailabilitySelect(status)
                                  }
                                >
                                  {status}
                                </p>
                              )
                            )}
                          </div>
                        </div>
                      </div>
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
                        className="mt-1 block w-full rounded-md bg-gray-800 border-gray-800 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                        value={formatDate(product.created_at)}
                        readOnly
                      />
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
                              Product update
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
                    <div className="mb-4">
                      <label
                        htmlFor="product_images"
                        className="block text-sm font-medium text-white"
                      >
                        Product Images
                      </label>
                      <div className="mt-2 w-full flex sm:gap-4 sm:flex-row flex-col gap-4">
                        {productImages.length > 0 ? (
                          productImages.map((image) => (
                            <div className="group relative" key={image.id}>
                              <PhotoProvider
                                bannerVisible={false}
                                speed={() => 300}
                                key={image.id}
                              >
                                <PhotoView
                                  key={image.id}
                                  src={`${config.baseApiImageUrl}${image.image}`}
                                >
                                  <img
                                    key={image.id}
                                    src={`${config.baseApiImageUrl}${image.image}`}
                                    alt={`Product image ${image.id}`}
                                    className="sm:w-36 sm:h-36 w-full max-h-60 object-cover rounded cursor-pointer"
                                  />
                                </PhotoView>
                              </PhotoProvider>
                              <button
                                onClick={() => handleDeleteImage(image.id)}
                                className="absolute top-1 right-1 bg-gray-900 text-red-700 text-2xl p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-400">No images available.</p>
                        )}
                      </div>
                      <div className="mt-6 flex justify-end">
                        <button
                          disabled={productImages.length === 4}
                          type="button"
                          onClick={() => setOpenImageModal(true)}
                          className="py-2 px-4 border border-gray-700 text-sm font-medium rounded-md text-white bg-transparent hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600 disabled:opacity-50"
                        >
                          Add new images
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* delete image modal */}

      <Modal
        open={deleteImageModal}
        onClose={() => setDeleteImageModal(false)}
        center
        classNames={{
          modal: "deleteModal",
        }}
        closeIcon
      >
        <div className="w-full max-w-lg bg-gray-900 shadow-lg rounded-lg p-6 relative">
          <FaTimes
            className="w-3.5 cursor-pointer shrink-0 fill-gray-400 hover:fill-red-500 float-right"
            onClick={() => setDeleteImageModal(false)}
          />

          <div className="my-4 text-center">
            <FaTrashAlt className="size-16 text-red-600 inline" />
            <h4 className="text-gray-200 text-base font-semibold mt-4">
              Are you sure you want to delete this image?
            </h4>

            <div className="text-center space-x-4 mt-8">
              <button
                onClick={() => setDeleteImageModal(false)}
                type="button"
                className="px-4 py-2 rounded-lg text-gray-800 text-sm bg-gray-200 hover:bg-gray-300 active:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDeleteImage(imageIdToDelete)}
                type="button"
                className="px-4 py-2 rounded-lg text-white text-sm bg-red-600 hover:bg-red-700 active:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
          {success1 && (
            <div
              id="dismiss-alert"
              className="hs-removing:translate-x-5 hs-removing:opacity-0 transition duration-300 bg-purple-50 border border-purple-200 text-sm text-purple-800 rounded-lg p-4 dark:bg-purple-800/10 dark:border-purple-900 dark:text-purple-500"
              role="alert"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <FaCheckCircle className="flex-shrink-0 size-4 mt-0.5 text-purple-500" />
                </div>
                <div className="ms-2">
                  <div className="text-sm font-medium">{success1}</div>
                </div>
                <div className="ps-3 ms-auto">
                  <div className="-mx-1.5 -my-1.5">
                    <button
                      type="button"
                      className="inline-flex bg-purple-50 rounded-lg p-1.5 text-purple-500 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-purple-50 focus:ring-purple-600 dark:bg-transparent dark:hover:bg-purple-800/50 dark:text-purple-600"
                      data-hs-remove-element="#dismiss-alert"
                    >
                      <span className="sr-only">Dismiss</span>
                      <FaTimes className="flex-shrink-0 size-4 mt-1 " />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* upload image modal */}

      <Modal
        open={openImageModal}
        onClose={() => setOpenImageModal(false)}
        center
        classNames={{
          modal: "productfeaturesimagemodal",
        }}
        closeIcon
      >
        <div className="relative flex flex-col bg-gray-900 shadow-lg rounded-xl">
          <div className="relative overflow-hidden min-h-36 bg-gray-900 text-center">
            <div className="absolute top-2 end-2">
              <button
                onClick={() => setOpenImageModal(false)}
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
                  className="fill-white"
                  d="M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z"
                ></path>
              </svg>
            </figure>
          </div>

          <div className="relative z-10 -mt-12">
            <span className="mx-auto flex justify-center items-center size-[62px] rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm">
              <BsImage className="size-8 text-gray-800" />
            </span>
          </div>

          <div className="p-4 overflow-y-auto">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white">
                Add Product Images
              </h3>
            </div>
            <div className="px-4 py-10 mx-auto w-full">
              <div className="mt-0 w-full mx-auto">
                <div className="flex flex-col border border-gray-700 rounded-xl p-8 dark:border-neutral-700">
                  <h2 className="mb-8 text-xl font-semibold text-white">
                    Upload the product images
                  </h2>
                  <div className="mt-3">
                    <label className="block mb-2 text-sm text-white font-medium dark:text-white">
                      Upload Images
                    </label>
                    <input
                      ref={filePickerRef}
                      type="file"
                      id="images"
                      name="images"
                      onChange={handleImageChange}
                      className="file-input file-input-bordered border border-gray-700 rounded-md text-white w-full focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600"
                      multiple
                      required
                      accept="image/*"
                      hidden
                    />
                    <button
                      onClick={() => filePickerRef.current.click()}
                      className="flex items-center gap-4 w-full p-2.5 border border-gray-700 rounded-md text-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600 hover:bg-gray-800"
                    >
                      <MdOutlineFileUpload className="size-5" />
                      <p className="text-sm">
                        Upload single or multiple images
                      </p>
                    </button>
                    <span className="text-gray-400 text-xs">
                      {images.length} file(s) selected
                    </span>
                    <p className="text-xs text-gray-400 mt-1">
                      {`( Please upload images in JPG or PNG format, each not
                      exceeding 1MB in size. You can upload a maximum of ${
                        4 - productImages.length
                      }
                      ${4 - productImages.length === 1 ? "image" : "images"} )`}
                    </p>
                    {imageError && (
                      <p className="text-red-600 text-sm font-medium">
                        {imageError}
                      </p>
                    )}
                    <div className="w-full flex gap-4 flex-wrap mt-2">
                      {imagePreviews.map((preview, index) => (
                        <img
                          key={index}
                          src={preview}
                          alt={`preview-${index}`}
                          className="w-20 object-cover rounded-md h-20"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {success2 && (
                <div
                  className="mt-3 bg-gray-700 border-t-4 border-purple-600 rounded-lg p-4 dark:bg-purple-800/30"
                  role="alert"
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <span className="inline-flex justify-center items-center size-8 rounded-full border-2 border-purple-700 bg-purple-700 dark:border-purple-900 dark:bg-purple-800 dark:text-purple-400">
                        <FiCheckCircle className="flex-shrink-0 size-4 text-white dark:text-neutral-500" />
                      </span>
                    </div>
                    <div className="ms-3">
                      <h3 className="text-white font-semibold dark:text-white">
                        Image Upload.
                      </h3>
                      <p className="text-sm text-white dark:text-neutral-400">
                        {success2}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-x-2">
              <a
                onClick={handleImageSubmit}
                className="p-2.5 inline-flex items-center gap-x-2 text-sm font-medium cursor-pointer rounded-md border border-gray-700 text-white hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none"
              >
                <MdOutlineAddCircle className="size-5" />
                Upload
              </a>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProductPreview;
