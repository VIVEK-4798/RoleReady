import React, { useEffect } from "react";

import MetaComponent from "@/components/common/MetaComponent";
import { useNavigate } from "react-router-dom";
import VenueTable from "@/components/dashboard/admin-dashboard/venue";

const metadata = {
  title: "Venues | Pets24x7 - Your One-Stop Pet Shop Directory.",
  description: "Pets24x7 - Your One-Stop Pet Shop Directory.",
};
const allowedUser = ["admin", "venue-user"];

export default function Venue() {
  const navigate = useNavigate();
  // useEffect(()=>{
  //   if (!allowedUser.includes(localStorage.getItem("role"))) {
  //     navigate("/");
  //   }
  // })
  return (
    <>
      <MetaComponent meta={metadata} />
      <VenueTable />
    </>
  );
}
