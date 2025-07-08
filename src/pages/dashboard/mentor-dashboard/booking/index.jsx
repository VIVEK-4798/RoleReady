import React from "react";
import DashboardPage from "../../../../components/dashboard/mentor-dashboard/booking";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Applicants History || Startups24x7 - All-in-One Platform for Startup Services",
  description: "Startups24x7 - All-in-One Platform for Startup Services",
};

export default function VendorBooking() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <DashboardPage />
    </>
  );
}
