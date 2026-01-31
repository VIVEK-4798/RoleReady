import React from "react";
import MetaComponent from "@/components/common/MetaComponent";
import AdminSkillsPage from "@/components/dashboard/admin-dashboard/admin-skills";

const metadata = {
  title: "Skills Management | RoleReady Admin",
  description: "Manage the master skills list for the RoleReady platform.",
};

export default function AdminSkills() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <AdminSkillsPage />
    </>
  );
}
