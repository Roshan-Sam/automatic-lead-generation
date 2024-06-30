import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiEdit,
  FiTrash,
  FiSearch,
  FiPlus,
  FiChevronDown,
  FiCheckCircle,
} from "react-icons/fi";
import { CiFilter, CiMenuKebab } from "react-icons/ci";
import { Modal } from "react-responsive-modal";
import {
  MdOutlineCategory,
  MdOutlineAddCircle,
  MdClose,
  MdOutlineFileUpload,
} from "react-icons/md";
import "react-photo-view/dist/react-photo-view.css";
import { PhotoProvider, PhotoView } from "react-photo-view";
import AdminNav from "../../../components/admin/admin-nav/AdminNav";
import AdminSidebar from "../../../components/admin/admin-sidebar/AdminSidebar";
import { useSidebarContext } from "../../../hooks/useSidebarContext";
import config from "../../../Functions/config";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { RiFileExcelLine } from "react-icons/ri";
import "./productfeatures.css";

const ProductFeatures = () => {
  const [products, setProducts] = useState([]);
  const [products1, setProducts1] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [addProductForm, setAddProductForm] = useState({
    name: "",
    description: "",
    features: "",
    images: [],
    product_id: "",
    category: "",
    price: "",
  });
  const [addCategoryForm, setAddCategoryForm] = useState({ name: "" });
  const [imagePreviews, setImagePreviews] = useState([]);

  const [openDropdown, setOpenDropdown] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);

  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    features: "",
    images: "",
    category: "",
    product_id: "",
    price: "",
  });
  const [categoryError, setCategoryError] = useState({ name: "" });

  const { isSidebarCollapsed, dispatch: sidebarDispatch } = useSidebarContext();

  const [selectedCategory, setSelectedCategory] = useState("Choose Category");
  const [selectedCategory1, setSelectedCategory1] = useState("Category");
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const [categoryDropdown1, setCategoryDropdown1] = useState(false);
  const [offset, setOffset] = useState(0);
  const LIMIT = 2;
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const filePickerRef = useRef();
  const navigate = useNavigate();

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    setCategoryDropdown(false);
    setAddProductForm({ ...addProductForm, category: categoryName });
    setErrors((prevErrors) => ({
      ...prevErrors,
      category: "",
    }));
  };

  const handleCategorySelect1 = (categoryName) => {
    setSelectedCategory1(categoryName);
    setCategoryDropdown1(false);
    setOffset(0);
  };

  const handleClear = () => {
    setSearchTerm("");
    setSelectedCategory1("Category");
    setOffset(0);
  };

  const sidebarToggle = () => {
    sidebarDispatch({ type: "TOGGLE_SIDEBAR" });
  };

  const fetchProducts1 = async () => {
    try {
      const res = await axios.get(
        `${config.baseApiUrl}admin/product-features/`
      );
      if (res.status === 200) {
        setProducts1(res.data.products);
      }
    } catch (errors) {
      console.log(errors);
    }
  };

  useEffect(() => {
    fetchProducts1();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `${config.baseApiUrl}admin/product-features/`,
        {
          params: {
            limit: LIMIT,
            offset: offset,
            search: searchTerm,
            category: selectedCategory1 === "Category" ? "" : selectedCategory1,
          },
        }
      );
      if (res.status === 200) {
        const { products: newProducts, total_count } = res.data;
        setProducts(newProducts);
        setTotalCount(total_count);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [offset, searchTerm, selectedCategory1]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setOffset(0);
  };

  const handleNext = () => {
    if (offset + LIMIT < totalCount) {
      setOffset((prevOffset) => prevOffset + LIMIT);
    }
  };

  const handlePrevious = () => {
    if (offset > 0) {
      setOffset((prevOffset) => prevOffset - LIMIT);
    }
  };

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

  const toggleDropdown = (id) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setAddProductForm({ ...addProductForm, [id]: value });

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
        (product) => product.product_id === value.trim()
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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const supportedFormats = ["image/jpeg", "image/png"];
    const maxFileSize = 1 * 1024 * 1024;
    const maxImages = 4;

    let validFiles = [];
    let previews = [];
    let errors = { images: "" };

    if (files.length > maxImages) {
      errors.images = `You can only upload a maximum of ${maxImages} images.`;
      setAddProductForm({ ...addProductForm, images: [] });
      setImagePreviews([]);
    } else {
      files.forEach((file) => {
        if (!supportedFormats.includes(file.type)) {
          errors.images += `Unsupported format: ${file.name}. Please upload JPG or PNG files. `;
          setAddProductForm({ ...addProductForm, images: [] });
          setImagePreviews([]);
        } else if (file.size > maxFileSize) {
          errors.images += `File size exceeds 1MB: ${file.name}. Please upload smaller files. `;
          setAddProductForm({ ...addProductForm, images: [] });
          setImagePreviews([]);
        } else {
          validFiles.push(file);
          previews.push(URL.createObjectURL(file));
        }
      });
    }

    if (validFiles.length > 0 && validFiles.length <= maxImages) {
      setAddProductForm({ ...addProductForm, images: validFiles });
      setImagePreviews(previews);
    }

    setErrors((prevErrors) => ({ ...prevErrors, ...errors }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!addProductForm.name) newErrors.name = "Name is required";
    if (!addProductForm.price) newErrors.price = "Price is required";
    if (!addProductForm.description)
      newErrors.description = "Description is required";
    if (!addProductForm.features) newErrors.features = "Features are required";
    if (addProductForm.images.length === 0)
      newErrors.images = "At least one image is required";
    if (
      !addProductForm.category ||
      addProductForm.category === "Choose Category"
    )
      newErrors.category = "Category is required";
    if (!addProductForm.product_id)
      newErrors.product_id = "Product ID is required";
    if (
      products1.some(
        (product) => product.product_id === addProductForm.product_id
      )
    ) {
      newErrors.product_id = "Product ID already exists";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", addProductForm.name);
      formData.append("description", addProductForm.description);
      formData.append("features", addProductForm.features);
      formData.append("category", addProductForm.category);
      formData.append("price", addProductForm.price);
      formData.append("product_id", addProductForm.product_id);
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
        setOffset(0);
        fetchProducts1();
        setTimeout(() => {
          setSuccess("");
          setOpenModal(false);
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
        category: "",
        product_id: "",
        price: "",
      });
      setErrors({
        name: "",
        description: "",
        features: "",
        images: "",
        product_id: "",
        category: "",
        price: "",
      });
      setSelectedCategory("Choose Category");
      setCategoryDropdown(false);
      setImagePreviews([]);
    }
  }, [openModal]);

  const handleCategoryChange = (e) => {
    const { id, value } = e.target;
    setAddCategoryForm({ ...addCategoryForm, [id]: value });
    if (value.trim().length > 0) {
      if (
        categories.some(
          (category) =>
            category.name.toLowerCase() === value.trim().toLowerCase()
        )
      ) {
        setCategoryError({ ...categoryError, name: "Category already exists" });
      } else {
        setCategoryError({ ...categoryError, name: "" });
      }
    } else {
      setCategoryError({ ...categoryError, name: "Category name is required" });
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();

    if (!addCategoryForm.name.trim()) {
      setCategoryError({ ...errors, name: "Category name is required" });
      return;
    }
    if (
      categories.some(
        (category) =>
          category.name.toLowerCase() ===
          addCategoryForm.name.trim().toLowerCase()
      )
    ) {
      setCategoryError({ ...categoryError, name: "Category already exists" });
      return;
    }

    try {
      const res = await axios.post(
        `${config.baseApiUrl}admin/add-category/`,
        addCategoryForm
      );
      if (res.status === 200) {
        setSuccess("Category added successfully.");
        setTimeout(() => {
          setSuccess("");
          setOpenCategoryModal(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  useEffect(() => {
    if (!openCategoryModal) {
      setAddCategoryForm({ name: "" });
      setCategoryError({ name: "" });
    }
  }, [openCategoryModal]);

  useEffect(() => {
    setExcelData(
      products.map(
        ({
          name,
          description,
          features,
          product_id,
          availability_status,
          price,
          created_at,
          category,
          images,
          id,
          ...rest
        }) => ({
          PRODUCT_ID: product_id,
          NAME: name,
          DESCRIPTION: description,
          FEATURES: features,
          PRICE: price,
          AVAILABILITY_STATUS: availability_status,
          CATEGORY: category.name,
          CREATED_AT: new Date(created_at).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        })
      )
    );
  }, [products]);

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(blob, "products-details.xlsx");
  };

  const handleEdit = (product) => {
    navigate(`/admin/product-features-details/${product.id}`);
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
            <div className="flex pt-10 px-4">
              <ul className="bg-slate-900 border border-gray-700 rounded-full py-2 px-4 -space-x-4 w-max flex items-center mt-4">
                <li className="bg-gray-800 text-purple-500 hover:underline rounded-full z-40 px-8 py-3 text-base cursor-pointer">
                  <Link to="/admin/dashboard">Dashboard</Link>
                </li>
                <li className="bg-purple-600 text-white underline rounded-r-full z-10 px-8 py-3 text-base cursor-pointer">
                  <Link to="/admin/product-features">Product & Features </Link>
                </li>
              </ul>
            </div>

            <div className="text-white px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
              <div className="flex flex-col">
                <div className="-m-1.5 overflow-x-auto">
                  <div className="p-1.5 min-w-full inline-block align-middle">
                    <div className="bg-slate-900 shadow-gray-500 border border-gray-700 rounded-xl shadow-sm overflow-hidden dark:bg-neutral-800 dark:border-neutral-700">
                      <div className="px-6 py-4 gap-3 flex xl:flex-row flex-col xl:justify-between xl:items-center border-b border-gray-400 dark:border-neutral-700">
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
                                value={searchTerm}
                                onChange={handleSearchChange}
                              />
                              <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4">
                                <FiSearch className="flex-shrink-0 size-4 text-slate-400 dark:text-neutral-500" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col xl:items-end items-start gap-4">
                          <div className="flex md:justify-end gap-2">
                            <button
                              onClick={() => setOpenModal(true)}
                              className="py-3 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-purple-700 text-slate-950 hover:bg-purple-700 bg-purple-600 disabled:opacity-50 disabled:pointer-events-none"
                            >
                              <FiPlus className="flex-shrink-0 size-4 text-slate-950 dark:text-neutral-500" />
                              Add new product
                            </button>
                            <button
                              onClick={() => setOpenCategoryModal(true)}
                              className="py-3 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-purple-700 text-slate-950 hover:bg-purple-700 bg-purple-600 disabled:opacity-50 disabled:pointer-events-none"
                            >
                              <FiPlus className="flex-shrink-0 size-4 text-slate-950 dark:text-neutral-500" />
                              Add new category
                            </button>
                          </div>
                          <div className="flex gap-2 md:justify-end">
                            <div className="relative w-48  h-fit border border-gray-700 rounded-lg outline-none dropdown-one">
                              <button
                                onClick={() =>
                                  setCategoryDropdown1(!categoryDropdown1)
                                }
                                className="relative flex items-center justify-between w-full px-5 py-2 focus:border-purple-600 focus:ring-2 focus:ring-purple-600 rounded-lg hover:bg-gray-800 focus:bg-transparent"
                              >
                                <span className="pr-4 text-sm text-white">
                                  {selectedCategory1}
                                </span>
                                <FiChevronDown
                                  id="rotate1"
                                  className="absolute z-10 cursor-pointer right-5 text-white"
                                  size={14}
                                />
                              </button>
                              <div
                                className={`absolute right-0 z-20 ${
                                  categoryDropdown1 ? "" : "hidden"
                                } w-full px-1 py-2 bg-white border-t border-gray-200 rounded shadow top-12 max-h-28 overflow-y-scroll select`}
                              >
                                {categories.map((category) => (
                                  <a key={category.id}>
                                    <p
                                      className="p-3 text-sm leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded"
                                      onClick={() =>
                                        handleCategorySelect1(category.name)
                                      }
                                    >
                                      {category.name}
                                    </p>
                                  </a>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={handleClear}
                                type="button"
                                className="py-2 px-4 text-white inline-flex items-center gap-x-1 hover:bg-gray-800 focus:bg-transparent focus:ring-1 focus:ring-purple-600 focus:border-purple-600 text-sm rounded-lg border border-gray-700 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                              >
                                <CiFilter className="size-4 text-white" />
                                Clear
                              </button>
                              <button
                                onClick={handleDownloadExcel}
                                type="button"
                                className="py-2 px-4 text-white inline-flex items-center gap-x-1 hover:bg-gray-800 focus:bg-transparent focus:ring-1 focus:ring-purple-600 focus:border-purple-600 text-sm rounded-lg border border-gray-700 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                              >
                                <RiFileExcelLine className="size-4 fill-white" />
                                Export
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
                              PID
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
                              Category
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wide text-white"
                            >
                              Status
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wide text-white"
                            >
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700 dark:divide-neutral-700">
                          {products.map((product, index) => (
                            <tr key={product.id}>
                              <td className="px-6 py-3 whitespace-nowrap">
                                {product.product_id}
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
                                  </PhotoProvider>
                                )}
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap">
                                {product.name}
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap">
                                {product.category.name}
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap">
                                <span
                                  className={`px-2.5 py-0.5 rounded text-sm font-semibold ${
                                    product.availability_status === "In Stock"
                                      ? "text-green-400 border border-green-400"
                                      : product.availability_status ===
                                        "Out of Stock"
                                      ? "text-red-400 border border-red-400"
                                      : "text-yellow-400 border border-yellow-400"
                                  }`}
                                >
                                  {product.availability_status}
                                </span>
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
                          <div className="flex justify-between items-center gap-1">
                            <button
                              onClick={handlePrevious}
                              disabled={offset === 0}
                              className="py-1.5 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-700 text-white shadow-sm hover:bg-gray-800 disabled:opacity-50"
                            >
                              Previous
                            </button>
                            <button
                              onClick={handleNext}
                              disabled={offset + LIMIT >= totalCount}
                              className="py-1.5 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-700 text-white shadow-sm hover:bg-gray-800 disabled:opacity-50"
                            >
                              Next
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
          {/* add new prodduct modal */}

          <Modal
            open={openModal}
            onClose={() => setOpenModal(false)}
            center
            classNames={{
              modal: "productfeatures",
            }}
            closeIcon
          >
            <div className="relative flex flex-col bg-gray-900 shadow-lg rounded-xl">
              <div className="relative overflow-hidden min-h-36 bg-gray-900 text-center">
                <div className="absolute top-2 end-2">
                  <button
                    onClick={() => setOpenModal(false)}
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
                    <div className="flex flex-col border border-gray-700 rounded-xl p-8 dark:border-neutral-700">
                      <h2 className="mb-8 text-xl font-semibold text-white">
                        Fill the product details
                      </h2>
                      <div className="flex md:flex-row flex-col md:gap-4">
                        <div className="mb-2 w-full">
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
                        <div className="mb-2 w-full">
                          <label className="block mb-2 text-sm text-white font-medium">
                            Product ID
                          </label>
                          <input
                            type="text"
                            id="product_id"
                            className="bg-transparent border border-gray-700 text-white text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
                            placeholder="product id"
                            required
                            value={addProductForm.product_id}
                            onChange={handleChange}
                          />
                          {errors.product_id && (
                            <p className="text-red-600 text-sm font-medium">
                              {errors.product_id}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex md:flex-row flex-col md:gap-4">
                        <div className="mb-2 w-full">
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
                        <div className="w-full">
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
                      </div>
                      <div className="flex md:flex-row flex-col md:gap-4">
                        <div className="mt-2 w-full">
                          <label className="block mb-2 text-sm text-white font-medium">
                            Category
                          </label>
                          <div className="relative  h-fit border border-gray-700 rounded-lg outline-none dropdown-one">
                            <button
                              onClick={() =>
                                setCategoryDropdown(!categoryDropdown)
                              }
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
                          {errors.category && (
                            <p className="text-red-600 text-sm font-medium">
                              {errors.category}
                            </p>
                          )}
                        </div>
                        <div className="mt-2 w-full">
                          <label className="block mb-2 text-sm text-white font-medium">
                            Product Price
                          </label>
                          <input
                            type="number"
                            id="price"
                            className="bg-transparent border border-gray-700 text-white text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
                            placeholder="product price"
                            required
                            value={addProductForm.price}
                            onChange={handleChange}
                          />
                          {errors.price && (
                            <p className="text-red-600 text-sm font-medium">
                              {errors.price}
                            </p>
                          )}
                        </div>
                      </div>
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
                          {addProductForm.images.length} file(s) selected
                        </span>
                        <p className="text-xs text-gray-400 mt-1">
                          ( Please upload images in JPG or PNG format, each not
                          exceeding 1MB in size. You can upload a maximum of 4
                          images )
                        </p>
                        {errors.images && (
                          <p className="text-red-600 text-sm font-medium">
                            {errors.images}
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
                  {success && (
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
                            Product and Features.
                          </h3>
                          <p className="text-sm text-white dark:text-neutral-400">
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

          {/* add category modal */}

          <Modal
            open={openCategoryModal}
            onClose={() => setOpenCategoryModal(false)}
            center
            classNames={{
              modal: "productfeaturescategory",
            }}
            closeIcon
          >
            <div className="relative flex flex-col bg-gray-900 shadow-lg rounded-xl dark:bg-neutral-800 border-none">
              <div className="relative overflow-hidden min-h-32 bg-gray-900 text-center">
                <div className="absolute top-2 end-2">
                  <button
                    onClick={() => setOpenCategoryModal(false)}
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
                    Add Category
                  </h3>
                </div>
                <div className="px-4 py-10 mx-auto w-full">
                  <div className="mt-0 w-full mx-auto">
                    <div className="flex flex-col border border-gray-700 rounded-xl p-4 sm:p-6 lg:p-8 dark:border-neutral-700">
                      <h2 className="mb-8 text-xl font-semibold text-white">
                        Fill the category name
                      </h2>
                      <div className="mb-2">
                        <label className="block mb-2 text-sm text-white font-medium">
                          Category Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="bg-transparent border border-gray-700 text-white text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
                          placeholder="Category name"
                          required
                          value={addCategoryForm.name}
                          onChange={handleCategoryChange}
                        />
                        {categoryError.name && (
                          <p className="text-red-600 text-sm font-medium">
                            {categoryError.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  {success && (
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
                            Product and Features.
                          </h3>
                          <p className="text-sm text-white dark:text-neutral-400">
                            {success}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-x-2">
                  <a
                    onClick={handleCategorySubmit}
                    className="p-2.5 inline-flex items-center gap-x-2 text-sm font-medium cursor-pointer rounded-md border border-gray-700 text-white hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <MdOutlineAddCircle className="size-5" />
                    Add Category
                  </a>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default ProductFeatures;
