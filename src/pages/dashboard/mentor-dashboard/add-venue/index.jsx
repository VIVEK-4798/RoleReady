import React, { useEffect } from "react";
import AddVenue from "../../../../components/dashboard/mentor-dashboard/add-hotel";

import MetaComponent from "@/components/common/MetaComponent";
import { useNavigate } from "react-router-dom";

const metadata = {
  title: "Mentor Add Internships | Startups24x7",
  description: "Startups24x7 - All-in-One Platform for Startup Services"
};
const allowedUser = ["mentor", "venue-user"];
export default function AdminAddHotel() {
  const navigate = useNavigate();
  // useEffect(()=>{
  //   if (!allowedUser.includes(localStorage.getItem("role"))) {
  //     navigate("/");
  //   }
  // })
  return (
    <>
      <MetaComponent meta={metadata} />
      <AddVenue />
    </>
  );
}
