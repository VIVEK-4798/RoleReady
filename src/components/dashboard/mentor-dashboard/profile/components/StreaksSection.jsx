import React, { useEffect, useRef } from "react";
import axios from "axios";
import CalHeatmap from "cal-heatmap";
import "cal-heatmap/cal-heatmap.css";
import Tooltip from "cal-heatmap/plugins/Tooltip";
import { api } from "@/utils/apiProvider";

const StreaksSection = () => {
  const calRef = useRef(null); 

  useEffect(() => {
    const fetchStreakData = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;
  
      try {
        if (calRef.current) {
          await calRef.current.destroy(); // properly wait for cleanup
          calRef.current = null;
          const container = document.getElementById("cal-heatmap");
          if (container) container.innerHTML = ""; // clear the div completely
        }
  
        const response = await axios.get(`${api}/api/user-activity/login-streak/${user.user_id}`);
        const streakData = response.data;
  
        const transformedData = streakData.map(item => ({
          date: item.date,
          value: item.activity_count,
        }));
  
        const cal = new CalHeatmap();
        calRef.current = cal;
  
        cal.paint(
          {
            itemSelector: "#cal-heatmap",
            domain: { type: "month", label: { position: "top" }, gutter: 10 },
            subDomain: { type: "day", radius: 2, width: 12, height: 12 },
            range: 12,
            date: { start: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) },
            scale: { color: { scheme: "YlGn", domain: [0, 1, 2, 3, 4, 5] } },
            data: {
              source: transformedData,
              x: "date",
              y: "value",
            },
          },
          [
            [
              Tooltip,
              {
                text: function (date, value, dayjsDate) {
                  const formattedDate = dayjsDate.format("D MMM");
                  return `${formattedDate} | ${value ? value + " Activities" : "No Activities"}`;
                },
              },
            ],
          ]
        );
      } catch (error) {
        console.error("Failed to fetch streak data", error);
      }
    };
  
    fetchStreakData();
  
    return () => {
      if (calRef.current) {
        calRef.current.destroy().then(() => {
          calRef.current = null;
          const container = document.getElementById("cal-heatmap");
          if (container) container.innerHTML = "";
        });
      }
    };
  }, []);  
  

  return (
    <div className="mb-8">
      <h4 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "10px" }}>
        Contributions in the past year
      </h4>
      <div
        id="cal-heatmap"
        style={{
          width: "100%",
          maxWidth: "100%",
          overflowX: "auto",
          paddingBottom: "10px",
        }}
      ></div>
    </div>
  );
  
};

export default StreaksSection;
