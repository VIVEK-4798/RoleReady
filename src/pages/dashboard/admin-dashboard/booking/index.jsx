import React from "react";
import DashboardPage from "../../../../components/dashboard/admin-dashboard/booking";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Admin History | Startups24x7 - All-in-One Platform for Startup Services",
  description: "Startups24x7 - All-in-One Platform for Startup Services",
};

export default function AdminBooking() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <DashboardPage />
    </>
  );
}
