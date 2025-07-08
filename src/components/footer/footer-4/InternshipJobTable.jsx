import { useState } from 'react';
import { Link } from 'react-router-dom';

const InternshipJobTable = () => {
  const [activeColumn, setActiveColumn] = useState(null);

  // Dynamically determines the base URL and query param based on table context
  const createLinkItemWithContext = (text, queryParamKey, tableTitle) => {
    const isJob = tableTitle.includes("Jobs");
    const isInternship = tableTitle.includes("Internship");

    const encoded = encodeURIComponent(text.replace(/^(Internship|Jobs) in /, ''));
    const baseUrl = isJob ? "/tour-list-v2" : "/hotel-list-v4";

    // Handle "View all" links
    const isViewAll = text === "View all internships" || text === "View all jobs";
    const queryParam = isViewAll ? "" : `?${queryParamKey}=${encoded}`;

    return (
      <Link
        to={`${baseUrl}${queryParam}`}
        style={{ color: '#cbd5e0', textDecoration: 'none' }}
      >
        {text}
      </Link>
    );
  };

  // Utility to map items with correct context from table title
  const createMappedItems = (tableTitle, items, queryParamKey) => {
    return items.map(item =>
      typeof item === "string"
        ? createLinkItemWithContext(item, queryParamKey, tableTitle)
        : item
    );
  };

  const tableData = [
    {
      title: "Internship by Places",
      items: createMappedItems("Internship by Places", [
        "Internship in Delhi",
        "Internship in Bangalore",
        "Internship in Hyderabad",
        "Internship in Mumbai",
        "Internship in Chennai",
        "Internship in Gurgaon",
        "Internship in Kolkata",
        "Internship in Pune",
        "Internship in Jaipur",
        <Link to="/hotel-list-v4" style={{ color: '#7ab8e8', fontWeight: '500' }}>View all internships</Link>
      ], "city_name")
    },
    {
      title: "Internship by Category",
      items: createMappedItems("Internship by Category", [
        "Software Development",
        "Data Analysis",
        "Customer Support",
        "Graphic Design",
        "Human Resources",
        "Sales & Business Development",
        "Content Writing",
        "Finance & Accounting",
        "Digital Marketing",
        <Link to="/hotel-list-v4" style={{ color: '#7ab8e8', fontWeight: '500' }}>View all internships</Link>
      ], "category")
    },
    {
      title: "Jobs by Places",
      items: createMappedItems("Jobs by Places", [
        "Jobs in Delhi",
        "Jobs in Mumbai",
        "Jobs in Bangalore",
        "Jobs in Jaipur",
        "Jobs in Kolkata",
        "Jobs in Hyderabad",
        "Jobs in Pune",
        "Jobs in Chennai",
        "Jobs in Gurgaon",
        <Link to="/tour-list-v2" style={{ color: '#7ab8e8', fontWeight: '500' }}>View all jobs</Link>
      ], "city_name")
    },
    {
      title: "Jobs by Stream",
      items: createMappedItems("Jobs by Stream", [
        "Data Analysis",
        "Customer Support",
        "Human Resources",
        "Sales & Business Development",
        "Digital Marketing",
        "Finance & Accounting",
        "Graphic Design",
        "Content Writing",
        "Software Development",
        <Link to="/tour-list-v2" style={{ color: '#7ab8e8', fontWeight: '500' }}>View all jobs</Link>
      ], "category")
    },
  ];

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0d2444 0%, #1a3a6e 100%)',
      color: '#ffffff',
      borderRadius: '12px',
      padding: '40px 20px',
      margin: '40px 0',
      overflowX: 'auto'
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        minWidth: '800px'
      }}>
        <thead>
          <tr>
            {tableData.map((column, index) => (
              <th
                key={index}
                style={{
                  padding: '15px',
                  textAlign: 'left',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  color: '#e2e8f0',
                  fontSize: '16px',
                  fontWeight: '600',
                  borderBottom: '1px solid rgba(255,255,255,0.15)',
                  cursor: 'pointer'
                }}
                onClick={() => setActiveColumn(index)}
                onMouseEnter={() => setActiveColumn(index)}
                onMouseLeave={() => setActiveColumn(null)}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 10 }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {tableData.map((column, colIndex) => (
                <td
                  key={colIndex}
                  style={{
                    padding: '12px 15px',
                    color: '#cbd5e0',
                    fontSize: '14px',
                    backgroundColor:
                      activeColumn === colIndex ? 'rgba(255,255,255,0.03)' : 'transparent',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  {column.items[rowIndex] || ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InternshipJobTable;
