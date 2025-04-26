import React, { useEffect } from "react";
import ServiceTable from "../../../../components/dashboard/admin-dashboard/services";

import MetaComponent from "@/components/common/MetaComponent";
import { useNavigate } from "react-router-dom";

const metadata = {
  title: "Services | Pets24x7 - Your One-Stop Pet Shop Directory.",
  description: "Pets24x7 - Your One-Stop Pet Shop Directory.",
};

export default function Service() {
  const navigate = useNavigate();
  // useEffect(()=>{
  //   if (localStorage.getItem("role") !== "admin") {
  //     navigate("/")
  //   }
  // })
  return (
    <>
      <MetaComponent meta={metadata} />
      <ServiceTable />
    </>
  );
}
