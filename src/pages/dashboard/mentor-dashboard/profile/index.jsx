import React from "react";
import Profile from "../../../../components/dashboard/vendor-dashboard/profile";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Vendor Dashboard || GoTrip - Travel & Tour ReactJs Template",
  description: "GoTrip - Travel & Tour ReactJs Template",
};

export default function MentorMarketingOverview() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Profile />
    </>
  );
}
