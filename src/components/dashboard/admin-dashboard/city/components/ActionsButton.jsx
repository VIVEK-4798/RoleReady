import { useState } from "react";
import "../../../../../styles/modals.css"

const ActionsButton = ({ onEdit, onDelete }) => {
  const [activeAction, setActiveAction] = useState(null);

  const handleActionClick = (action) => {
    setActiveAction(action);
    if (action === "edit" && onEdit) {
      onEdit();
    } else if (action === "delete" && onDelete) {
      onDelete();
    }
  };

  const actions = [
    { label: "Edit", value: "edit", icon: "icon-edit" },
    { label: "Delete", value: "delete", icon: "icon-trash" },
  ];

  return (
    <div className="dropdown js-dropdown js-actions-1-active">
      <div
        className="dropdown__button d-flex items-center rounded-4 text-blue-1 bg-blue-1-05 text-14 px-15 py-5"
        data-bs-toggle="dropdown"
        data-bs-auto-close="true"
        aria-expanded="false"
        data-bs-offset="0,10"
      >
        <span className="js-dropdown-title">
          {activeAction
            ? actions.find((a) => a.value === activeAction)?.label || "Actions"
            : "Actions"}
        </span>
        <i className="icon icon-chevron-sm-down text-7 ml-10" />
      </div>
      <div className="toggle-element -dropdown-2 js-click-dropdown dropdown-menu">
        <div className="text-14 fw-500 js-dropdown-list">
          {actions.map((action) => (
            <div key={action.value} className="d-block">
              <button
                className="d-flex items-center js-dropdown-link"
                onClick={() => handleActionClick(action.value)}
              >
                <i className={`${action.icon} mr-10`} />
                {action.label}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActionsButton;
