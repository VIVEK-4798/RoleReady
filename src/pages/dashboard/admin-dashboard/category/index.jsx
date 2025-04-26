import React, { useEffect } from "react";

import MetaComponent from "@/components/common/MetaComponent";
import { useNavigate } from "react-router-dom";
import CategoryTable from "@/components/dashboard/admin-dashboard/category";

const metadata = {
  title: "Categories | Pets24x7 - Your One-Stop Pet Shop Directory.",
  description: "Pets24x7 - Your One-Stop Pet Shop Directory.",
};

export default function Category() {
  const navigate = useNavigate();
  // useEffect(()=>{
  //   if (localStorage.getItem("role") !== "admin") {
  //     navigate("/")
  //   }
  // })
  return (
    <>
      <MetaComponent meta={metadata} />
      <CategoryTable />
    </>
  );
}
