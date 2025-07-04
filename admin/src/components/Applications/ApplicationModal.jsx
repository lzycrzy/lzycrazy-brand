import ReactDOM from "react-dom";
import { FaTimes } from "react-icons/fa";

const ApplicationModal = ({ application, onClose }) => {
  if (!application) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-2">
      <div className="bg-white p-4 md:p-6 rounded-md shadow-md w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
        >
          <FaTimes className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-4 text-center border-b pb-2 border-gray-300">
          Application Details
        </h2>

        {/* Details */}
        <div className="space-y-3 text-sm">
          {/* ID & Name */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
  <p className="text-sm"><strong>ID:</strong> {application.companyId}</p>
  <p className="text-sm"><strong>Name:</strong> {application.name}</p>
</div>

{/* Education & Email */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
  <p className="text-sm"><strong>Education:</strong> {application.education}</p>
  <p className="text-sm"><strong>Email:</strong> {application.email}</p>
</div>

{/* Experience & Job Category */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
  <p className="text-sm"><strong>Experience:</strong> {application.experienceLevel}</p>
  <p className="text-sm"><strong>Job Category:</strong> {application.jobCategory}</p>
</div>

          <p><strong>City:</strong> {application.city}</p>
          <p><strong>About:</strong> {application.introduction}</p>

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
