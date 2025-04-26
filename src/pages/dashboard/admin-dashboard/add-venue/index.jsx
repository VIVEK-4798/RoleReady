import React, { useEffect } from "react";
import AddVenue from "../../../../components/dashboard/admin-dashboard/add-hotel";

import MetaComponent from "@/components/common/MetaComponent";
import { useNavigate } from "react-router-dom";

const metadata = {
  title: "Admin Add Venue | Pets24x7 - Your One-Stop Pet Shop Directory.",
  description: "Pets24x7 - Your One-Stop Pet Shop Directory.",
};
const allowedUser = ["admin", "venue-user"];
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
