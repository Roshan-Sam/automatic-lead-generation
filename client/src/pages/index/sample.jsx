import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import config from "../../Functions/config";
import { FiChevronDown } from "react-icons/fi";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import emailjs from "@emailjs/browser";
import gmailIcon from "../../icons/gmail_icon.png";
import whatsAppIcon from "../../icons/whatsapp-icon.png";
import { MdClear } from "react-icons/md";
import { WhatsappShareButton } from "react-share";
import { useMediaQuery } from "react-responsive";

const Sample = () => {
  return (
    <div>
      <h1>Sample</h1>
    </div>
  );
};

export default Sample;
