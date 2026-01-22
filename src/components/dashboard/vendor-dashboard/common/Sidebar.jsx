import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  function logoutHandler(e) {
    e.preventDefault();
    sessionStorage.clear();
    navigate("/login");
  }
  const sidebarData = [
    {
      icon: "/img/dashboard/sidebar/compass.svg",
      title: "Marketing",
      links: [
        { title: "Overview", href: "overview" },
        { title: "Google Ads", href: "google_ads" },
        { title: "Facebook Ads", href: "facebook_ads" },
      ],
    },
  ];

  return (
    <>
      <div className="sidebar -dashboard" id="vendorSidebarMenu">
        <div className="sidebar__item ">
          <Link
            to="/vendor-dashboard/dashboard"
            className="sidebar__button d-flex items-center text-15 lh-1 fw-500"
          >
            <img
              src="/img/dashboard/sidebar/booking.svg"
              alt="image"
              className="mr-15"
            />
            Dashboard
          </Link>
        </div>
        <div className="sidebar__item ">
          <Link
            to="/vendor-dashboard/profile"
            className="sidebar__button d-flex items-center text-15 lh-1 fw-500"
          >
            <img
              src="/img/avatars/5.png"
              alt="profile icon"
              style={{ width: "26px", height: "26px", objectFit: "cover" }}
              className="mr-15"
            />
            Profile
          </Link>
        </div>
        {/* End accordion__item */}

        {/* <div className="sidebar__item ">
          <a
            href="/vendor-dashboard/booking"
            className="sidebar__button d-flex items-center text-15 lh-1 fw-500"
          >
            <img
              src="/img/dashboard/sidebar/booking.svg"
              alt="image"
              className="mr-15"
            />
            Bussiness Profile
          </a>
        </div> */}
        {/* End accordion__item */}

        {/* <div className="sidebar__item ">
          <a
            href="/vendor-dashboard/webpage"
            className="sidebar__button d-flex items-center text-15 lh-1 fw-500"
          >
            <img
              src="/img/dashboard/sidebar/gear.svg"
              className="h-auto w-auto mr-10 "
              alt="icon"
              style={{ maxHeight: "3vh" }}
            />
            Manage Webpage
          </a>
        </div> */}

        {/* {sidebarData.map((item, index) => (
          <div className="sidebar__item" key={index}>
            <div className="accordion -db-sidebar js-accordion">
              <div className="accordion__item">
                <div
                  className="accordion__button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#sidebarItem${index}`}
                >
                  <div className="sidebar__button col-12 d-flex items-center justify-between">
                    <div className="d-flex items-center text-15 lh-1 fw-500">
                      <img src={item.icon} alt="image" className="mr-10" />
                      {item.title}
                    </div>
                    <div className="icon-chevron-sm-down text-7" />
                  </div>
                </div>
                <div
                  id={`sidebarItem${index}`}
                  className="collapse"
                  data-bs-parent="#vendorSidebarMenu"
                >
                  <ul className="list-disc pt-15 pb-5 pl-40">
                    {item.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <a href={link.href} className="text-15">
                          {link.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))} */}

        {/* <div className="sidebar__item ">
          <a
            href="/vendor-dashboard/instagram"
            className="sidebar__button d-flex items-center text-15 lh-1 fw-500"
          >
            <img
              src="/img/dashboard/icons/instagram.svg"
              className="h-auto w-auto mr-10 "
              alt="icon"
              style={{ maxHeight: "3vh" }}
            />
            Instagram
          </a>
        </div>

        <div className="sidebar__item ">
          <a
            href="/vendor-dashboard/facebook"
            className="sidebar__button d-flex items-center text-15 lh-1 fw-500"
          >
            <img
              src="/img/dashboard/icons/facebook.svg"
              className="h-auto w-auto mr-10 "
              alt="icon"
              style={{ maxHeight: "3vh" }}
            />
            Facebook
          </a>
        </div> */}

        <div className="sidebar__item ">
          <a
            href="#"
            onClick={(e) => logoutHandler(e)}
            className="sidebar__button d-flex items-center text-15 lh-1 fw-500"
          >
            <img
              src="/img/dashboard/sidebar/log-out.svg"
              alt="image"
              className="mr-15"
            />
            Logout
          </a>
        </div>
        {/* End accordion__item */}
      </div>
    </>
  );
};

export default Sidebar;
