import React from "react";
import {
  FaUserFriends,
  FaClipboardList,
  FaBriefcase,
  FaBuilding,
  FaHandshake,
  FaAward,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const stats = [
  {
    title: "Active Users",
    value: "24M+",
    icon: <FaUserFriends className="benefit-icon" />,
    color: "#4361ee",
  },
  {
    title: "Assessments",
    value: "22.3M+",
    icon: <FaClipboardList className="benefit-icon" />,
    color: "#4cc9f0",
  },
  {
    title: "Opportunities",
    value: "130K+",
    icon: <FaBriefcase className="benefit-icon" />,
    color: "#f72585",
  },
  {
    title: "Brands trust us",
    value: "800+",
    icon: <FaAward className="benefit-icon" />,
    color: "#7209b7",
  },
  {
    title: "Organisations",
    value: "42K+",
    icon: <FaBuilding className="benefit-icon" />,
    color: "#3a0ca3",
  },
  {
    title: "Partners",
    value: "78+",
    icon: <FaHandshake className="benefit-icon" />,
    color: "#4895ef",
  },
];

const BenefitsBar = () => {
  return (
    <div className="benefits-bar">
      <div className="benefits-container">
        {stats.map((item, index) => (
          <div
            key={index}
            className="benefit-card"
            style={{ "--benefit-color": item.color }}
          >
            <div className="icon-wrapper">{item.icon}</div>
            <h2 className="benefit-value">{item.value}</h2>
            <p className="benefit-title">{item.title}</p>
            <div className="hover-effect"></div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .benefits-bar {
          background: #f9f9f9;
          padding: 60px 20px;
        }

        .benefits-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 30px;
        }

        @media (min-width: 768px) {
          .benefits-container {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .benefits-container {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (min-width: 1280px) {
          .benefits-container {
            grid-template-columns: repeat(6, 1fr);
          }
        }

        .benefit-card {
          background: white;
          border-radius: 12px;
          padding: 30px 20px;
          text-align: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
        }

        .benefit-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }

        .icon-wrapper {
          font-size: 32px;
          margin-bottom: 12px;
          color: var(--benefit-color);
        }

        .benefit-value {
          font-size: 28px;
          font-weight: 700;
          color: #2d3748;
          margin: 8px 0;
        }

        .benefit-title {
          font-size: 14px;
          font-weight: 500;
          color: #4a5568;
        }
      `}</style>
    </div>
  );
};

export default BenefitsBar;
