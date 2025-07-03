import React, { useEffect, useState } from "react";
import { FaEye, FaTrash, FaPlay } from "react-icons/fa";
import ApplicationModal from "./ApplicationModal";
import instance from '../../utils/axios';

const ApplicationsList = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [forFilterApplication, setForFilterApplication] = useState([]);

  const fetchApplications = async () => {
    try {
      const res = await instance.get("/admin/applications");
      setApplications(res.data);
      setForFilterApplication(res.data);
      console.log(applications)
    } catch (err) {
      console.error("Error fetching applications", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await instance.delete(`/admin/applications/${id}`);
      setApplications(applications.filter((a) => a._id !== id));
      setForFilterApplication(applications.filter((a) => a._id !== id))
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  function FilterOnChange(e) {
    const name = e.target.name;
    const filteredApplications = forFilterApplication.filter((application) => application[name].toLowerCase().includes(e.target.value.toLowerCase()));
    setApplications(filteredApplications);
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center py-4">
          <input type="text" name='id' placeholder="search lzycrazyid." className="outline-none border-2 border-gray-400 p-2 rounded-md" onChange={(e) => FilterOnChange(e)}/>
          <input type="text" name='name' placeholder="search name" className="outline-none border-2 border-gray-400 p-2 rounded-md" onChange={(e) => FilterOnChange(e)}/>
          <input type="text" name="jobCategory" placeholder="Job Category" className="outline-none border-2 border-gray-400 p-2 rounded-md" onChange={(e) => FilterOnChange(e)}/>
          <input type="text" name="email" placeholder="search mail" className="outline-none border-2 border-gray-400 p-2 rounded-md" onChange={(e) => FilterOnChange(e)}/>
        </div>
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
            <tbody className="divide-y divide-gray-200 overflow-y-scroll">
            {applications.length == 0 && <tr className="text-center w-full"><td className="py-10" colSpan={6}>No Applications</td></tr>}
              {applications.map((app, index) => (
                <tr
                  key={app._id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  onClick={() => setSelectedApp(app)}
                >
                  <td className="px-4 py-3">
                    <div className="w-30 h-16 bg-gray-200 flex rounded-md justify-center items-center overflow-hidden">
                      {app.videoUrl ? (
                        <div className="relative rounded-md">
                          <video src={app.videoUrl} className="w-full h-full object-cover object-center rounded-md" />
                          <div className="absolute top-1/2  opacity-50 left-1/2 bg-gray-200 rounded-md -translate-1/2 backdrop-blur-xs w-full h-full flex cursor-pointer justify-center items-center">
                            <img src={playBtn} width={20} />
                          </div>
                        </div>
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
