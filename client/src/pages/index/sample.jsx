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
import {
  FaTimes,
  FaTrashAlt,
  FaCheckCircle,
  FaRegPaperPlane,
  FaRegFilePdf,
} from "react-icons/fa";
import {
  FiEdit,
  FiTrash,
  FiSave,
  FiBell,
  FiPlus,
  FiCheckCircle,
} from "react-icons/fi";

import config from "../../Functions/config";

const Sample = () => {
  return (
    <>
      <div className="min-h-screen w-full bg-slate-900 pt-20">
        <div className="flex justify-center"></div>
      </div>
    </>
  );
};

export default Sample;
