import { useState, useEffect } from "react";
import {
  MdAdd,
  MdClose,
  MdAttachMoney,
  MdOutlineAddCircle,
} from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";
import { AiOutlineDelete } from "react-icons/ai";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import axios from "axios";
import { CiMenuKebab } from "react-icons/ci";
import { Link } from "react-router-dom";
import { FaTimes, FaTrashAlt, FaCheckCircle } from "react-icons/fa";
import { FiEdit, FiTrash, FiSave } from "react-icons/fi";

import config from "../../Functions/config";

const Sample = () => {
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  return (
    <>
      <div className="mt-20">
        <div className="flex">
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
            Add New Subscription
          </button>
        </div>
      </div>

      <Modal
              open={open}
              onClose={() => setOpen(false)}
              center
              classNames={{
                modal: "customModal",
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
                    <FiBell className="size-8 text-gray-800" />
                  </span>
                </div>

                <div className="p-4 sm:p-7 overflow-y-auto">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-white dark:text-neutral-200">
                      Create Company subscription
                    </h3>
                  </div>
                  <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-10 mx-auto w-full">
                    <div className="mt-0 w-full mx-auto">
                      <div className="flex flex-col border border-gray-700 rounded-xl p-4 sm:p-6 lg:p-8 dark:border-neutral-700">
                        <h2 className="mb-8 text-xl font-semibold text-white dark:text-neutral-200">
                          Fill the subscription details
                        </h2>
                        <div>
                          <div className="flex flex-col">
                            <div>
                              <label className="block mb-2 text-sm text-white font-medium dark:text-white">
                                Company Name
                              </label>
                              <div className="relative h-fit border border-gray-700 rounded-lg outline-none dropdown-one">
                                <button
                                  onClick={
                                    showDropDownMenuOne_form_layout_wizard4
                                  }
                                  className="relative flex items-center justify-between w-full p-2.5 focus:border-purple-600 focus:ring-2 focus:ring-purple-600 rounded-lg"
                                >
                                  <span
                                    className="pr-4 text-sm text-white"
                                    id="drop-down-content-setter-one_form_layout_wizard4"
                                  >
                                    {selectedLayout1}
                                  </span>
                                  <FiChevronDown
                                    id="rotate1"
                                    className="absolute z-10 cursor-pointer right-5"
                                    size={14}
                                    color="white"
                                  />
                                </button>
                                <div
                                  className={`absolute right-0 z-20 ${
                                    dropdownVisible1 ? "" : "hidden"
                                  } w-full px-1 py-2 bg-white border-t border-gray-200 rounded shadow top-12 max-h-24 overflow-y-scroll select`}
                                  id="drop-down-div-one_form_layout_wizard4"
                                >
                                  {companies.map((company, id) => (
                                    <a key={id}>
                                      <p
                                        className="p-3 text-sm leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded"
                                        onClick={
                                          swaptextone_form_layout_wizard4
                                        }
                                      >
                                        {company.company_name}
                                      </p>
                                    </a>
                                  ))}
                                </div>
                              </div>
                              {errors.company_name && (
                                <p className="text-red-600 text-sm font-medium">
                                  {errors.company_name}
                                </p>
                              )}
                            </div>

                            <div className="mt-4">
                              <label className="block mb-2 text-sm text-white font-medium dark:text-white">
                                Subscription Plan
                              </label>
                              <div className="relative h-fit border border-gray-700 rounded-lg outline-none dropdown-one">
                                <button
                                  onClick={
                                    showDropDownMenuOne_form_layout_wizard5
                                  }
                                  className="relative flex items-center justify-between w-full p-2.5 focus:border-purple-600 focus:ring-2 focus:ring-purple-600 rounded-lg"
                                >
                                  <span
                                    className="pr-4 text-sm text-white"
                                    id="drop-down-content-setter-one_form_layout_wizard5"
                                  >
                                    {selectedLayout2}
                                  </span>
                                  <FiChevronDown
                                    id="rotate1"
                                    className="absolute z-10 cursor-pointer right-5"
                                    size={14}
                                    color="white"
                                  />
                                </button>
                                <div
                                  className={`absolute right-0 z-20 ${
                                    dropdownVisible2 ? "" : "hidden"
                                  } w-full px-1 py-2 bg-white border-t border-gray-200 rounded shadow top-12 max-h-24 overflow-y-scroll select`}
                                  id="drop-down-div-one_form_layout_wizard5"
                                >
                                  {subScriptionPlans.map((subscription, id) => (
                                    <a key={id}>
                                      <p
                                        className="p-3 text-sm leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded"
                                        onClick={
                                          swaptextone_form_layout_wizard5
                                        }
                                      >
                                        {subscription.plan_name}
                                      </p>
                                    </a>
                                  ))}
                                </div>
                              </div>
                              {errors.subscription_plan && (
                                <p className="text-red-600 text-sm font-medium">
                                  {errors.subscription_plan}
                                </p>
                              )}
                            </div>

                            <div className="mt-4">
                              <label className="block mb-2 text-sm text-white font-medium dark:text-white">
                                Period
                              </label>
                              <div className="relative h-fit border border-gray-700 rounded-lg outline-none dropdown-one">
                                <button
                                  onClick={
                                    showDropDownMenuOne_form_layout_wizard6
                                  }
                                  className="relative flex items-center justify-between w-full p-2.5 focus:border-purple-600 focus:ring-2 focus:ring-purple-600 rounded-lg"
                                >
                                  <span
                                    className="pr-4 text-sm text-white"
                                    id="drop-down-content-setter-one_form_layout_wizard6"
                                  >
                                    {selectedLayout3}
                                  </span>
                                  <FiChevronDown
                                    id="rotate1"
                                    className="absolute z-10 cursor-pointer right-5"
                                    size={14}
                                    color="white"
                                  />
                                </button>
                                <div
                                  className={`absolute right-0 z-20 ${
                                    dropdownVisible3 ? "" : "hidden"
                                  } w-full px-1 py-2 bg-white border-t border-gray-200 rounded shadow top-12 max-h-24 overflow-y-scroll select`}
                                  id="drop-down-div-one_form_layout_wizard6"
                                >
                                  {periodOptions.map((period, index) => (
                                    <a key={index}>
                                      <p
                                        className="p-3 text-sm leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded"
                                        onClick={
                                          swaptextone_form_layout_wizard6
                                        }
                                      >
                                        {period}
                                      </p>
                                    </a>
                                  ))}
                                </div>
                              </div>
                              {errors.period && (
                                <p className="text-red-600 text-sm font-medium">
                                  {errors.period}
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
                                  Company account.
                                </h3>
                                <p className="text-sm text-gray-700 dark:text-neutral-400">
                                  {success}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-x-2">
                    <a
                      onClick={handleSubmit}
                      className="py-2 inline-flex items-center gap-x-2 px-2 text-sm font-medium cursor-pointer rounded-lg border border-gray-700 bg-transparent text-white hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <FaRegPaperPlane className="size-4" />
                      Create Company Subscription Plan
                    </a>
                  </div>
                </div>
              </div>
            </Modal>
    </>
  );
};

export default Sample;
