import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const MainMenu = ({ style = "" }) => {
  const { pathname } = useLocation();
  const [hoveredMenu, setHoveredMenu] = useState(null);

  // Same logic used in InternshipJobTable
  const createLinkItemWithContext = (text, queryParamKey, sectionTitle) => {
    const isJob = sectionTitle.includes("Jobs");
    const baseUrl = isJob ? "/tour-list-v2" : "/hotel-list-v4";

    const isViewAll = text === "View all internships" || text === "View all jobs";
    const encoded = encodeURIComponent(text.replace(/^(Internship|Jobs) in /, ''));
    const queryParam = isViewAll ? "" : `?${queryParamKey}=${encoded}`;

    return (
      <Link
        to={`${baseUrl}${queryParam}`}
        style={{ color: '#2d3748', textDecoration: 'none' }}
      >
        {text}
      </Link>
    );
  };

  // Updated items using dynamic links
  const internshipItems = [
    {
      title: "Internship by Places",
      items: [
        "Internship in Delhi",
        "Internship in Bangalore",
        "Internship in Hyderabad",
        "Internship in Mumbai",
        "Internship in Chennai",
        "Internship in Gurgaon",
        "Internship in Kolkata",
        "Internship in Pune",
        "Internship in Jaipur",
        "View all internships"
      ].map(item =>
        typeof item === "string"
          ? createLinkItemWithContext(item, "city_name", "Internship by Places")
          : item
      )
    },
    {
      title: "Internship by Category",
      items: [
        "Software Development",
        "Data Analysis",
        "Customer Support",
        "Graphic Design",
        "Human Resources",
        "Sales & Business Development",
        "Content Writing",
        "Finance & Accounting",
        "Digital Marketing",
        "View all internships"
      ].map(item =>
        typeof item === "string"
          ? createLinkItemWithContext(item, "category", "Internship by Category")
          : item
      )
    }
  ];

  const jobItems = [
    {
      title: "Jobs by Places",
      items: [
        "Jobs in Delhi",
        "Jobs in Mumbai",
        "Jobs in Bangalore",
        "Jobs in Jaipur",
        "Jobs in Kolkata",
        "Jobs in Hyderabad",
        "Jobs in Pune",
        "Jobs in Chennai",
        "Jobs in Gurgaon",
        "View all jobs"
      ].map(item =>
        typeof item === "string"
          ? createLinkItemWithContext(item, "city_name", "Jobs by Places")
          : item
      )
    },
    {
      title: "Jobs by Stream",
      items: [
        "Data Analysis",
        "Customer Support",
        "Human Resources",
        "Sales & Business Development",
        "Digital Marketing",
        "Finance & Accounting",
        "Graphic Design",
        "Content Writing",
        "Software Development",
        "View all jobs"
      ].map(item =>
        typeof item === "string"
          ? createLinkItemWithContext(item, "category", "Jobs by Stream")
          : item
      )
    }
  ];

  const renderDropdown = (items) => (
    <div className="dropdown-menu">
      {items.map((column, i) => (
        <div className="dropdown-column" key={i}>
          <h5>{column.title}</h5>
          <ul>
            {column.items.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <nav className="menu js-navList">
      <ul className={`menu__nav ${style} -is-active`}>
        <li
          className="menu-item"
          onMouseEnter={() => setHoveredMenu("internships")}
          onMouseLeave={() => setHoveredMenu(null)}
        >
          <span className={`menu-link ${hoveredMenu === "internships" ? "active" : ""}`}>
            Internships <span className={`arrow ${hoveredMenu === "internships" ? "up" : "down"}`}></span>
          </span>
          {hoveredMenu === "internships" && renderDropdown(internshipItems)}
        </li>

        <li
          className="menu-item"
          onMouseEnter={() => setHoveredMenu("jobs")}
          onMouseLeave={() => setHoveredMenu(null)}
        >
          <span className={`menu-link ${hoveredMenu === "jobs" ? "active" : ""}`}>
            Jobs <span className={`arrow ${hoveredMenu === "jobs" ? "up" : "down"}`}></span>
          </span>
          {hoveredMenu === "jobs" && renderDropdown(jobItems)}
        </li>
      </ul>

      <style jsx="true">{`
        .menu-item {
          position: relative;
          margin-right: 30px;
        }

        .menu-link {
          display: inline-flex;
          align-items: center;
          font-weight: 500;
          color: #2d3748;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .menu-link.active {
          color: #5693c1;
        }

        .arrow {
          margin-left: 6px;
          font-size: 12px;
          transition: transform 0.3s ease;
        }

        .arrow.down::after {
          content: "▼";
        }

        .arrow.up::after {
          content: "▲";
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          display: flex;
          gap: 60px;
          background: white;
          border-radius: 10px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
          padding: 25px 40px;
          z-index: 999;
          min-width: 700px;
        }

        .dropdown-column {
          min-width: 250px;
        }

        .dropdown-column h5 {
          font-size: 14px;
          margin-bottom: 10px;
          color: #5693c1;
        }

        .dropdown-column ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .dropdown-column ul li {
          margin-bottom: 8px;
        }

        .dropdown-column ul li a {
          font-size: 14px;
          color: #2d3748;
          text-decoration: none;
          transition: color 0.3s;
          white-space: nowrap;
        }

        .dropdown-column ul li a:hover {
          color: #5693c1;
        }
      `}</style>
    </nav>
  );
};

export default MainMenu;
