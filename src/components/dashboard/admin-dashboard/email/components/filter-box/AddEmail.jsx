import { useState } from "react";
import "../../../../../../styles/modals.css";
import axios from "axios";
import { api } from "@/utils/apiProvider";
// import { showAlert } from "@/utils/isTextMatched";

const AddEmail = ({ refreshEmails = () => {} }) => {
  const [showModal, setShowModal] = useState(false);
  const [emailData, setEmailData] = useState({
    subject: "",
    message: "",
    recipients: "", // Comma-separated list of email addresses
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting email data:", emailData);
      const response = await axios.post(
        `${api}/api/email/send-bulk-email`,
        emailData
      );
      console.log("Response:", response);
      if (response.data.success === true) {
        showAlert("Emails sent successfully.", "success");
        setEmailData({
          subject: "",
          message: "",
          recipients: "",
        });
        setShowModal(false);
        refreshEmails();
      } else {
        showAlert("Something went wrong.", "error");
      }
    } catch (error) {
      console.error("Error submitting email data:", error);
      showAlert(error.response?.data?.error || "An error occurred.", "error");
    }
  };

  return (
    <div className="col-auto">
      {/* Send Bulk Email Button */}
      <button
        className="button h-50 px-24 -dark-1 bg-blue-1 text-white"
        onClick={() => setShowModal(true)}
      >
        Send Bulk Email
        <div className="icon-arrow-top-right ml-15"></div>
      </button>

      {/* Send Bulk Email Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Send Bulk Email</h3>
            <form onSubmit={handleSubmit}>
              <label>
                Subject:
                <input
                  type="text"
                  value={emailData.subject}
                  onChange={(e) =>
                    setEmailData((prevEmailData) => ({
                      ...prevEmailData,
                      subject: e.target.value,
                    }))
                  }
                  required
                />
              </label>
              <label>
                Message:
                <textarea
                  value={emailData.message}
                  onChange={(e) =>
                    setEmailData((prevEmailData) => ({
                      ...prevEmailData,
                      message: e.target.value,
                    }))
                  }
                  required
                />
              </label>
              <label>
                Recipients (comma-separated emails):
                <input
                  type="text"
                  value={emailData.recipients}
                  onChange={(e) =>
                    setEmailData((prevEmailData) => ({
                      ...prevEmailData,
                      recipients: e.target.value,
                    }))
                  }
                  required
                />
              </label>
              <div className="modal-actions">
                <button type="submit" className="button bg-blue-1 text-white">
                  Submit
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
    </div>
  );
};

export default AddEmail;
