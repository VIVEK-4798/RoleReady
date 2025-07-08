import React, { useEffect } from "react";

import MetaComponent from "@/components/common/MetaComponent";
import { useNavigate } from "react-router-dom";
import VenueTable from "@/components/dashboard/mentor-dashboard/venue";

const metadata = {
  title: "Internships | Startups24x7 - All-in-One Platform for Startup Services",
  description: "Startups24x7 - All-in-One Platform for Startup Services",
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
