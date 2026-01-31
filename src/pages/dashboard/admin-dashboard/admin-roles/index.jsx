import React from "react";
import MetaComponent from "@/components/common/MetaComponent";
import AdminRolesPage from "@/components/dashboard/admin-dashboard/admin-roles";

const metadata = {
  title: "Roles Management | RoleReady Admin",
  description: "Manage roles and categories for the RoleReady platform.",
};

export default function AdminRoles() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <AdminRolesPage />
    </>
  );
}
