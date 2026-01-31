import React from "react";
import MetaComponent from "@/components/common/MetaComponent";
import AdminBenchmarksPage from "@/components/dashboard/admin-dashboard/admin-benchmarks";

const metadata = {
  title: "Benchmarks Management | RoleReady Admin",
  description: "Assign skills to roles with importance and weight settings.",
};

export default function AdminBenchmarks() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <AdminBenchmarksPage />
    </>
  );
}
