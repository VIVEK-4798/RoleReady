import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../../../styles/modals.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState();
  const [openDropdowns, setOpenDropdowns] = useState({});

  const userRole = localStorage.getItem("role");

  const sidebarData = [
    {
      icon: "/img/dashboard/sidebar/booking.svg",
      title: "Booking Manager",
      href: "booking",
      allowedRole: ["admin", "venue-user", "vendor-user"],
    },
    {
      icon: "/img/dashboard/sidebar/house.svg",
      title: "Internships",
      allowedRole: ["admin", "venue-user"],
      links: [
        { title: "All Internships", href: "venues", allowedRole: ["admin", "venue-user"] },
        { title: "Add Internship", href: "venue/add", allowedRole: ["admin", "venue-user"] },
      ],
    },
    {
      icon: "/img/dashboard/sidebar/house.svg",
      title: "Jobs",
      // title: userRole === "admin" ? "Vendor" : userRole === "vendor-user" ? "Services" : "",
      allowedRole: ["admin", "vendor-user"],
      links: [
        { title: "All Jobs", href: "vendors", allowedRole: ["admin"] },
        { title: "Add Job", href: "vendor/add", allowedRole: ["admin"] },
        // { title: "All Services", href: "vendors", allowedRole: ["vendor-user"] },
        // { title: "Add Sevice", href: "vendor/add", allowedRole: ["vendor-user"] },
      ],
    },
    {
      icon: "/img/dashboard/sidebar/house.svg",
      title: "Users",
      allowedRole: ["admin"],
      links: [
        { title: "All Users", href: "users", allowedRole: ["admin"] },
        { title: "Add User", href: "user/add", allowedRole: ["admin"] },
      ],
    },
    {
      icon: "/img/dashboard/sidebar/gear.svg",
      title: "Packages",
      href: "packages",
      allowedRole: ["admin"],
    },
    
    {
      icon: "/img/dashboard/sidebar/gear.svg",
      title: "E-Mail",
      href: "mail",
      allowedRole: ["admin"],
    },
    {
      icon: "/img/dashboard/sidebar/gear.svg",
      title: "City",
      href: "city",
      allowedRole: ["admin"],
    },
    {
      icon: "/img/dashboard/sidebar/gear.svg",
      title: "Regions",
      href: "regions",
      allowedRole: ["admin"],
    },
    {
      icon: "/img/dashboard/sidebar/gear.svg",
      title: "Internships Category",
      href: "categories",
      allowedRole: ["admin"],
    },
    {
      icon: "/img/dashboard/sidebar/gear.svg",
      title: "Jobs Category",
      href: "services",
      allowedRole: ["admin"],
    },
    // ============================================
    // 📊 READINESS CONFIGURATION SECTION
    // ============================================
    {
      icon: "/img/dashboard/sidebar/compass.svg",
      title: "Readiness Config",
      allowedRole: ["admin"],
      links: [
        { title: "📌 Roles", href: "admin-roles", allowedRole: ["admin"] },
        { title: "📌 Skills", href: "admin-skills", allowedRole: ["admin"] },
        { title: "📌 Benchmarks", href: "admin-benchmarks", allowedRole: ["admin"] },
      ],
    },
    {
      icon: "/img/dashboard/sidebar/gear.svg",
      title: "Settings",
      href: "settings",
      allowedRole: ["admin", "venue-user", "vendor-user"],
    }
  ];

  useEffect(() => {
    const currentUrl = window.location.href;
    const regex = /admin-dashboard\/(.+)/;
    const match = currentUrl.match(regex);
    if (match && match[1]) {
      setTab(match[1]);
      
      // Auto-open dropdown if current tab is in one
      sidebarData.forEach((item, index) => {
        if (item.links && item.links.some((link) => match[1] === link.href)) {
          setOpenDropdowns(prev => ({ ...prev, [index]: true }));
        }
      });
    } else {
      setTab("No match found");
    }
  }, []);

  const handleRoute = (path, newTab) => {
    setTab(newTab);
    navigate(path);
  };

  const toggleDropdown = (index) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="sidebar -dashboard" id="vendorSidebarMenu">
      {/* Static Items */}
      <div className="sidebar__item">
        <a
          onClick={() => handleRoute("/admin-dashboard/dashboard", "dashboard")}
          className={`${tab === "dashboard" ? "side_current" : ""} cursor sidebar__button d-flex items-center text-15 lh-1 fw-500`}
        >
          <img src="/img/dashboard/sidebar/compass.svg" alt="image" className="mr-15" />
          Dashboard
        </a>
      </div>

      {/* <div className="sidebar__item">
        <a
          onClick={() => handleRoute("/admin-dashboard/booking", "Booking Manager")}
          className={`${tab === "Booking Manager" ? "side_current" : ""} cursor sidebar__button d-flex items-center text-15 lh-1 fw-500`}
        >
          <img src="/img/dashboard/sidebar/booking.svg" alt="image" className="mr-15" />
          Booking Manager
        </a>
      </div> */}

{sidebarData.map((item, index) => {
  if (item.links) {
    // Render dropdown items like Venues and Vendors
    return (
      // item.allowedRole.includes(localStorage.getItem("role")) && ( // <-- Commented out role check
      <div className="sidebar__item" key={index}>
        <div className="accordion -db-sidebar js-accordion">
          <div className="accordion__item">
            <div
              className={`accordion__button ${
                item.links.some((link) => tab === link.href) ? "side_current" : ""
              }`}
              onClick={() => toggleDropdown(index)}
              style={{ cursor: 'pointer' }}
            >
              <div className="sidebar__button col-12 d-flex items-center justify-between">
                <div className="d-flex items-center text-15 lh-1 fw-500">
                  <img src={item.icon} alt="image" className="mr-10" />
                  {item.title}
                </div>
                <div className={`icon-chevron-sm-down text-7 ${openDropdowns[index] ? 'rotate-180' : ''}`} />
              </div>
            </div>
            <div
              className={openDropdowns[index] ? "show" : ""}
              style={{
                display: openDropdowns[index] ? 'block' : 'none',
                transition: 'all 0.3s ease',
                overflow: 'hidden'
              }}
            >
              <ul className="list-disc pb-5 pl-40">
                {item.links.map((link, linkIndex) => {
                  return (
                    // link.allowedRole.includes(localStorage.getItem("role")) && ( // <-- Commented out link role check
                    <li key={linkIndex}>
                      <a
                        onClick={() =>
                          handleRoute(`/admin-dashboard/${link.href}`, link.href)
                        }
                        className={`text-15 ${
                          tab === link.href ? "side_current" : ""
                        } cursor`}
                      >
                        {link.title}
                      </a>
                    </li>
                    // )
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
      // )
    );
  } else {
    // Render standalone items
    return (
      // item.allowedRole.includes(localStorage.getItem("role")) && ( // <-- Commented out role check
      <div className="sidebar__item" key={index}>
        <a
          onClick={() => handleRoute(`/admin-dashboard/${item.href}`, item.href)}
          className={`${
            tab === item.href ? "side_current" : ""
          } cursor sidebar__button d-flex items-center text-15 lh-1 fw-500`}
        >
          <img src={item.icon} alt="image" className="mr-15" />
          {item.title}
        </a>
      </div>
      // )
    );
  }
})}


      {/* Logout */}
      <div className="sidebar__item">
  <button
    onClick={logout}
    className="sidebar__button d-flex items-center text-15 lh-1 fw-500"
    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
  >
    <img src="/img/dashboard/sidebar/log-out.svg" alt="image" className="mr-15" />
    Logout
  </button>
</div>

    </div>
  );
};

export default Sidebar;
