import React, { useEffect } from "react";
import AddUser from "../../../../components/dashboard/admin-dashboard/add-user";

import MetaComponent from "@/components/common/MetaComponent";
import { useNavigate } from "react-router-dom";

const metadata = {
  title: "Admin Add User | Pets24x7 - Your One-Stop Pet Shop Directory.",
  description: "Pets24x7 - Your One-Stop Pet Shop Directory.",
};
const allowedUser = ["admin"];
export default function AdminAddUser() {
  const navigate = useNavigate();
  // useEffect(()=>{
  //   if (!allowedUser.includes(localStorage.getItem("role"))) {
  //     navigate("/");
  //   }
  // })
  return (
    <>
      <MetaComponent meta={metadata} />
      <AddUser />
    </>
  );
}
