import React, { useEffect } from "react";
import AddVendor from "../../../../components/dashboard/mentor-dashboard/add-vendor";

import MetaComponent from "@/components/common/MetaComponent";
import { useNavigate } from "react-router-dom";

const metadata = {
  title: "Mentor Add Job | Startups24x7 - All-in-One Platform for Startup Services",
  description: "Startups24x7 - All-in-One Platform for Startup Services",
};

const allowedUser = ["admin", "vendor-user"];
export default function AdminAddVendor() {
  const navigate = useNavigate();
  // useEffect(()=>{
  //   if (!allowedUser.includes(localStorage.getItem("role"))) {
  //     navigate("/");
  //   }
  // })
  return (
    <>
      <MetaComponent meta={metadata} />
      <AddVendor />
    </>
  );
}
