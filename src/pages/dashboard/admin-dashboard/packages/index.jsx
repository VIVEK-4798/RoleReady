import React, { useEffect } from "react";
import PackagesTable from "../../../../components/dashboard/admin-dashboard/packages";
import MetaComponent from "@/components/common/MetaComponent";
import { useNavigate } from "react-router-dom";

const metadata = {
  title: "Packages | Pets24x7 - Your One-Stop Pet Shop Directory.",
  description: "Pets24x7 - Your One-Stop Pet Shop Directory.",
};

export default function Packages() {
  const navigate = useNavigate();
  // useEffect(()=>{
  //   if (localStorage.getItem("role") !== "admin") {
  //     navigate("/")
  //   }
  // })
  return (
    <>
      <MetaComponent meta={metadata} />
      <PackagesTable />
    </>
  );
}
