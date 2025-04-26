import { useState, useEffect } from "react";
import axios from "axios";
// import Pagination from "../../common/Pagination";
import ActionsButton from "./ActionsButton";
import { api } from "@/utils/apiProvider";
// import { showAlert } from "@/utils/isTextMatched";

const EmailTable = ({ searchParameter = "", refresh }) => {
  const [emails, setEmails] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [emailData, setEmailData] = useState({
    email_id: null,
    email_subject: "",
    email_body: "",
    recipients: [],
  });

  // Fetch emails
  const fetchEmails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${api}/api/email/get-emails`);
      if (response.data.success) {
        setEmails(response.data.results);
        setFilteredEmails(response.data.results); // Set both main and filtered data
      } else {
        setError("Failed to fetch emails.");
      }
    } catch (err) {
      console.error("Error fetching emails:", err);
      setError("An error occurred while fetching emails.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, [refresh]);

  // Unified Search Logic
  useEffect(() => {
    const lowercasedTerm = searchParameter.toLowerCase();
    const filtered = emails.filter((email) =>
      email.email_subject.toLowerCase().includes(lowercasedTerm)
    );
    setFilteredEmails(filtered);
  }, [searchParameter]);

  // Edit email
  const handleEdit = (email) => {
    setEmailData({
      email_id: email.email_id,
      email_subject: email.email_subject,
      email_body: email.email_body,
      recipients: email.recipients || [],
    });
    setShowModal(true);
  };

  // Update email
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${api}/api/email/update-email/${emailData.email_id}`, emailData);
      showAlert("Email updated successfully.", "success");
      setShowModal(false);
      fetchEmails(); // Refresh emails list
    } catch (error) {
      console.error("Error updating email:", error);
      showAlert(error.response?.data?.error || "An error occurred.", "error");
    }
  };

  // Delete email
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${api}/api/email/delete-email/${id}`);
      showAlert("Email deleted successfully.", "success");
      fetchEmails(); // Refresh emails list
    } catch (error) {
      console.error("Error deleting email:", error);
      showAlert(error.response?.data?.error || "An error occurred.", "error");
    }
  };

  // Send bulk email
  const handleSendBulkEmail = async () => {
    try {
      await axios.post(`${api}/api/email/send-bulk-email`, { emails: filteredEmails });
      showAlert("Bulk email sent successfully.", "success");
    } catch (error) {
      console.error("Error sending bulk email:", error);
      showAlert(error.response?.data?.error || "An error occurred.", "error");
    }
  };

  return (
    <>
      <div className="tabs -underline-2 js-tabs">
        <div className="tabs__content pt-30 js-tabs-content">
          <div className="tabs__pane -tab-item-1 is-tab-el-active">
            {loading ? (
              <p>Loading emails...</p>
            ) : error ? (
              <p className="text-red-1">{error}</p>
            ) : filteredEmails.length === 0 ? (
              <p>No emails available.</p>
            ) : (
              <div className="overflow-scroll scroll-bar-1">
                <table className="table-3 -border-bottom col-12">
                  <thead className="bg-light-2">
                    <tr>
                      <th>Email Subject</th>
                      <th>Email Body</th>
                      <th>Recipients</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmails.map((email, index) => (
                      <tr key={index}>
                        <td>{email.email_subject || "N/A"}</td>
                        <td>{email.email_body || "N/A"}</td>
                        <td>{email.recipients.join(", ") || "N/A"}</td>
                        <td>
                          <ActionsButton
                            email={email}
                            onEdit={() => handleEdit(email)}
                            onDelete={() => handleDelete(email.email_id)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      <button onClick={handleSendBulkEmail} className="button bg-blue-1 text-white">
        Send Bulk Email
      </button>
      {/* Edit Email Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Email</h3>
            <form onSubmit={handleSubmit}>
              <label>
                Email Subject:
                <input
                  type="text"
                  value={emailData.email_subject}
                  onChange={(e) =>
                    setEmailData({ ...emailData, email_subject: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Email Body:
                <textarea
                  value={emailData.email_body}
                  onChange={(e) =>
                    setEmailData({ ...emailData, email_body: e.target.value })
                  }
                  required
                />
              </label>
              <div className="modal-actions">
                <button type="submit" className="button bg-blue-1 text-white">
                  Update
                </button>
                <button
                  type="button"
                  className="button bg-light-2 text-dark-1"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EmailTable;