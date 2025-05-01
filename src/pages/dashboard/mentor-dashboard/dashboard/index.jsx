import React from "react";
import DashboardPage from "../../../../components/dashboard/mentor-dashboard/dashboard";
import LandingPage from "../../../../components/dashboard/mentor-dashboard/landing-page";

import MetaComponent from "@/components/common/MetaComponent";
import { useNavigate } from "react-router-dom";

const metadata = {
  title: "Vendor Dashboard || GoTrip - Travel & Tour ReactJs Template",
  description: "GoTrip - Travel & Tour ReactJs Template",
};

export default function MentorDashboard() {
  // const navigate = useNavigate();
  const user = sessionStorage.getItem("user");
  const landingSteps = sessionStorage.getItem("landingSteps");

  // useEffect(() => {
  //   const user = sessionStorage.getItem("user");
  //   if (mentor) navigate("/mentor-dashboard/dashboard");
  // }, []);
  
  return (
    <>
      <MetaComponent meta={metadata} />
      {!landingSteps && <LandingPage />}
      {landingSteps && <DashboardPage />}
    </>
  );
}
