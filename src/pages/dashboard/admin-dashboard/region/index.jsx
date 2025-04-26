import React, { useEffect } from "react";
import RegionTable from "../../../../components/dashboard/admin-dashboard/region";

import MetaComponent from "@/components/common/MetaComponent";
import { useNavigate } from "react-router-dom";

const metadata = {
  title: "Regions | Pets24x7 - Your One-Stop Pet Shop Directory.",
  description: "Pets24x7 - Your One-Stop Pet Shop Directory.",
};

export default function Regions() {
  const navigate = useNavigate();
  // useEffect(()=>{
  //   if (localStorage.getItem("role") !== "admin") {
  //     navigate("/")
  //   }
  // })
  return (
    <>
      <MetaComponent meta={metadata} />
      <RegionTable />
    </>
  );
}
