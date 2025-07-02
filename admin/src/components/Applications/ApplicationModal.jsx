import ReactDOM from "react-dom";
import { FaTimes } from "react-icons/fa";

const ApplicationModal = ({ application, onClose }) => {
  if (!application) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
<<<<<<< HEAD
      <div className="bg-white p-6 rounded-md shadow-md w-[90%] max-h-[80%] overflow-y-scroll max-w-lg relative">
=======
      <div className="bg-white p-6 rounded-md shadow-md w-[90%] max-w-lg relative">
>>>>>>> Bikash2
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
        >
          <FaTimes className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold mb-2">Application Details</h2>
        <div className="space-y-2 text-sm">
          <p><strong>ID:</strong> {application.lycrazyId}</p>
          <p><strong>Email:</strong> {application.email}</p>
          <p><strong>Phone:</strong> {application.phone}</p>
          <p><strong>Job Category:</strong> {application.jobCategory}</p>
          <p><strong>Experience:</strong> {application.experience}</p>
          <p><strong>Education:</strong> {application.education}</p>
          <p><strong>Age:</strong> {application.age}</p>
          <p><strong>City:</strong> {application.city}</p>
<<<<<<< HEAD
          <p><strong>About:</strong> {application.introduction}</p>
=======
          <p><strong>About:</strong> {application.about}</p>
>>>>>>> Bikash2
          {application.videoUrl && (
            <div className="mt-4">
              <video src={application.videoUrl} controls className="w-full rounded" />
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ApplicationModal;
