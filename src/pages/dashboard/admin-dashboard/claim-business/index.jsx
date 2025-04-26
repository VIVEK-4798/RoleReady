import React, { useEffect } from "react";
import ClaimbusinessTable from "../../../../components/dashboard/admin-dashboard/claim-business";

import MetaComponent from "@/components/common/MetaComponent";
import { useNavigate } from "react-router-dom";

const metadata = {
  title: "Claimed Business | Pets24x7 - Your One-Stop Pet Shop Directory.",
  description: "Pets24x7 - Your One-Stop Pet Shop Directory.",
};

export default function ClaimedBusiness() {
  const navigate = useNavigate();
  // useEffect(()=>{
  //   if (localStorage.getItem("role") !== "admin") {
  //     navigate("/")
  //   }
  // },[])

  return (
    <>
      <MetaComponent meta={metadata} />
      <ClaimbusinessTable />
    </>
  );
}
