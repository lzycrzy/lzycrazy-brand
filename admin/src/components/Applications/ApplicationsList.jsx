import React, { useEffect, useState } from "react";
import { FaEye, FaTrash, FaPlay } from "react-icons/fa";
import ApplicationModal from "./ApplicationModal";
import instance from '../../utils/axios';

const ApplicationsList = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);

  const fetchApplications = async () => {
    try {
      const res = await instance.get("/admin/applications");
      setApplications(res.data);
    } catch (err) {
      console.error("Error fetching applications", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await instance.delete(`/admin/applications/${id}`);
      setApplications(applications.filter((a) => a._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-600">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-white">Video</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white">Job Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white">Age</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {applications.map((app, index) => (
                <tr
                  key={app._id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  onClick={() => setSelectedApp(app)}
                 
                >
                  <td className="px-4 py-4">
                    <div className="w-20 h-12 bg-gray-200 rounded overflow-hidden">
                      {app.videoUrl ? (
                        <video src={app.videoUrl} className="w-full h-full object-cover" controls />
                      ) : (
                        <div className="w-full h-full bg-blue-900 flex items-center justify-center">
                          <FaPlay className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">{app.lycrazyId}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{app.jobCategory}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{app.age}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{app.email}</td>
                  <td className="px-4 py-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // prevent modal open
                        handleDelete(app._id);
                      }}
                      className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                    >
                      <FaTrash className="w-4 h-4" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedApp && (
        <ApplicationModal
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
        />
      )}
    </div>
  );
};

export default ApplicationsList;
