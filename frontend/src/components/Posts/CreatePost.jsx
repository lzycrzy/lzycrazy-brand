import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ModalOverlay from "../Posts/ModalOverlay";
import LocationModal from "../Posts/LocationModal";
import { useLocation } from 'react-router-dom';
import ImageDetail from "./ImageDetail";
import VideoRecording from "./VideoRecording";
import TagPeople from "./TagPeople";
import { IoMdArrowDropdown } from "react-icons/io";
import { multiInstance } from "../../lib/axios/axiosInstance";
import { useUser } from '../../context/UserContext';


const CreatePost = ({ setUploadModal, onPostCreated}) => {
  // const imageDetailData=useLocation()
  // console.log(imageDetailData);
  const navigate = useNavigate();
  const { user, profilePic, displayName, fetchUser, updateUser } = useUser();
console.log(user)
  
  const [user1, setUser] = useState(null); 
  const [caption, setCaption] = useState(""); 
  const [audience, setAudience] = useState("Public"); 
  const [showDropdown, setShowDropdown] = useState(false); 
  const [image, setImage] = useState(null); // For image preview
  const [imagefile, setImagefile]=useState(null);
  const [video, setVideo] = useState(null); // For video preview
  const [profileImage, setProfileImage] = useState(null); // For profile image
  const [taggedUsers, setTaggedUsers] = useState([]); // For multiple tagged users
 const [showVideoRecorder, setShowVideoRecorder] = useState(false);
 const [showTagBox, setShowTagBox] = useState(false);
const [showTagModal, setShowTagModal] = useState(false);
const [file, setFile]= useState(null);
const[uploading,setUploading]= useState(false);


  const [feeling, setFeeling] = useState(""); 
  const [location, setLocation] = useState(""); 
  const [shareToWhatsApp, setShareToWhatsApp] = useState(false); 
  const [locationModalOpen, setLocationModalOpen] = useState(false); // For location modal
  const [edit, setEdit]=useState(false);
  const [videoFile, setVideoFile] = useState(null);
  // Audience Options (dynamic)
  const [audienceOptions, setAudienceOptions] = useState([]);

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalInputValue, setModalInputValue] = useState("");
  const [showModalInput, setShowModalInput] = useState(false);
  const [modalCallback, setModalCallback] = useState(() => {});

  // Fetch User and Audience Options on Component Mount
  useEffect(() => {
    fetch("/api/user") // Fetch user data from backend (adjust API endpoint)
      .then(response => response.json())
      .then(data => setUser(data));

    fetch("/api/audience-options") // Fetch audience options (adjust API endpoint)
      .then(response => response.json())
      .then(data => setAudienceOptions(data));
  }, []);
console.log("createPost",image, edit)
  // Handle Media Change (image/video)
  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    const fileType = file.type.split("/")[0];
    setFile(file)
    if (fileType === "image") {
      setImage(fileUrl);
      setImagefile(file);
      setVideo(null);
    } else if (fileType === "video") {
      setVideo(fileUrl);
      setImage(null);
    } else {
      openModal("Unsupported File", "Please upload an image or video.");
    }
  };

  // Open Modal (Dynamic)
  const openModal = (type, message, callback = null, input = false) => {
    const modalData = {
      title: type === "tag" ? "Tag Someone" : "Feeling",
      message: message,
      showInput: input,
      callback: callback,
    };

    setModalTitle(modalData.title);
    setModalMessage(modalData.message);
    setShowModalInput(modalData.showInput);
    setModalCallback(() => modalData.callback);
    setModalOpen(true);
  };
 
  // Tag Search and Selection
  const handleTagSearch = (value) => {
    setModalInputValue(value);
    fetch(`/api/users/search?query=${value}`) // Adjust API endpoint for search
      .then(res => res.json())
      .then(data => setFilteredUsers(data));
  };

  // Handle User Tagging
  const handleUserTag = (name) => {
    setTagged(name);
    setModalOpen(false);
  };
  const handleUpload=(event)=>{
    const fileData=event.target.files[0]
    setFile(fileData)
     if (fileData) setProfileImage(URL.createObjectURL(fileData));
  }
 async function handleUploadData(event){
 event.preventDefault()
 const formData=new FormData()
 formData.append("authore_id", user?.profile.id)
 formData.append("file", file)
 formData.append("description",caption)
 formData.append("location",location)
 formData.append("feeling",feeling)
 formData.append("taggedUser",taggedUsers)
 setUploading(true);

const response= await multiInstance.post("/v1/posts/createPost", formData)

  if (onPostCreated) onPostCreated();
    if (onClose) onClose();
setFile(null)
setCaption(null)
setImage(null)
setVideo(null)
setUploading(false);
console.log(response)
 } 
console.log("CreatePost mounted");

 
  return (
    <div className="fixed w-[100vw]  h-[100vh] top-0 left-0 bg-white/60 flex justify-center items-center">
    <div >
  
      <div className="relative bg-white w-full max-w-xl mx-auto rounded-xl shadow-md mt-10 overflow-hidden relative ">
           {/* <button onClick={()=>setUploadModal(false)} className="absolute cursor-pointer bg-slate-200 p-2 rounded-full top-0 right-0">Cancel</button> */}

                <button
                  onClick={() => setUploadModal(false)}
                  className="bg-slate-200 p-2 text-sm  rounded-full flex justify-self-end"
                >
                  ❌ 
                </button>

        {/* Post Header */}
        <div className="border-b px-4 py-3 relative">
          <h2 className="text-lg font-semibold text-center">Create Post</h2>
        </div>

        {/* Post Content */}
        <div className="p-4">
          {/* Profile Image and Audience Dropdown */}
          <div className="flex gap-3 items-start mb-4">
            <div className="relative w-12 h-12">
              <label className="cursor-pointer block w-full h-full">
                <img
                  src={profileImage || "https://via.placeholder.com/100?text=+"}
                  alt="Profile"
                  className="rounded-full w-full h-full object-cover border border-gray-300 hover:opacity-80 transition"
                />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUpload}
                />
              </label>
            </div>

            <div className="flex flex-col">
              <span className="font-semibold text-black text-sm">{user?.profile.name || "User"}</span>
              {/* <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="text-xs bg-gray-100 px-3 py-1 rounded-full inline-flex items-center gap-1 hover:bg-gray-200 mt-1"
              >
                🌐 {audience} <IoMdArrowDropdown/>
              </button>
              {showDropdown && (
                <div className="absolute mt-12 bg-white border rounded shadow w-32 z-50">
                   {audienceOptions.map((option) => (
                    <div
                      key={option}
                      onClick={() => {
                        setAudience(option);
                        setShowDropdown(false);
                      }}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    >
                      {option}
                    </div>
                  ))}  */}
  
                {/* </div>
              )} */}
              <div className="flex flex-col relative audience-dropdown">
  {/* <span className="font-semibold text-black text-sm">{user?.name || "User"}</span> */}

  <button
    onClick={() => setShowDropdown(!showDropdown)}
    className="text-xs bg-gray-100 px-3 py-1 rounded-full inline-flex items-center gap-1 hover:bg-gray-200 mt-1"
  >
    {audience === "Public" && "🌐"}
    {audience === "Friends" && "👥"}
    {audience === "Only Me" && "🔒"} {audience}
    <IoMdArrowDropdown />
  </button>

  {showDropdown && (
    <div className="absolute top-[100%] mt-1 bg-white border rounded shadow w-40 z-50">
      {["Public", "Friends", "Only Me"].map((option) => (
        <div
          key={option}
          onClick={() => {
            setAudience(option);
            setShowDropdown(false);
          }}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center gap-2"
        >
          {option === "Public" && <span>🌐</span>}
          {option === "Friends" && <span>👥</span>}
          {option === "Only Me" && <span>🔒</span>}
          <span>{option}</span>
        </div>
      ))}
    </div>
  )}
</div>

            </div>
          </div>

          {/* Caption Textarea */}
          <textarea
            className="w-full border border-gray-300 rounded-md p-3 resize-none max-h-[4rem] focus:outline-blue-400 mb-3"
            rows={4}f-
            placeholder="What's on your mind?"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          {/* Image Preview */}
          {image && (
            <div className="mb-4 relative">
              <p className="text-sm text-gray-500 mb-1">📷 Image Preview</p>
              <img src={image} alt="Uploaded" className="w-full max-h-[30vh] rounded-md" />
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  // onClick={() => navigate("/image-detail", { state: { image } })}
                    onClick={() => setEdit(true)}
                  className="bg-white px-3 py-1 text-sm rounded shadow border hover:bg-blue-100"
                >
                  ✏️ Edit
                </button>
                
      {edit&&<ImageDetail
      setImagefile={setImagefile}
      setImage={setImage}
      image={image}
      setEdit={setEdit}
      />}
     
                <button
                  onClick={() => setImage(null)}
                  className="bg-white px-3 py-1 text-sm rounded shadow border hover:bg-red-100"
                >
                  ❌ Delete
                </button>
              </div>
            </div>
          )}

          {/* Video Preview */}
           {video && (
            <div className="mb-4 relative">
              <p className="text-sm text-gray-500 mb-1">🎥 Video Preview</p>
              <video src={video} controls className="w-full max-h-[30vh] rounded-md" />
              <div className="absolute top-2 right-2 flex gap-2">
                {/* <button
                  onClick={() => navigate("/video", { state: { video } })}
                  className="bg-white px-3 py-1 text-sm rounded shadow border hover:bg-blue-100"
                >
                  ✏️ Edit
                </button> */}
                <button
                  onClick={() => setVideo(null)}
                  className="bg-white px-3 py-1 text-sm rounded shadow border hover:bg-red-100"
                >
                  ❌ Delete
                </button>
              </div>
            </div>
          )} 

          {/* Tagged Users, Feeling, Location, and WhatsApp Options */}
          <div className="space-y-1 text-gray-600 text-sm mb-3">
           

           
            {feeling && <p>😊 Feeling: {feeling}</p>}
            {location && <p>📍 Location: {location}</p>}
            {shareToWhatsApp && <p>🟢 Will share to WhatsApp</p>}
          </div>

          {/* Media Options */}
          <div className="border rounded-lg px-4 py-3 bg-gray-50 flex justify-between items-center">
            <p className="text-sm font-medium text-gray-700">Add to your post</p>
            <div className="flex gap-4 text-xl text-gray-600">
              <label className="cursor-pointer hover:text-blue-600" title="Upload image/video">
                📷
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={handleMediaChange}
                />
              </label>
             <button
  onClick={() => setShowVideoRecorder(true)}
  title="Record Video"
  className="hover:text-blue-600"
>
  🎥</button>
{/* </button>{video && (
  <div className="mb-4 relative">
    <p className="text-sm text-gray-500 mb-1">🎥 Video Preview</p>
    <video src={video} controls className="w-full rounded-md" />
    <div className="absolute top-2 right-2 flex gap-2">
      <button
        onClick={() => setVideo(null)}
        className="bg-white px-3 py-1 text-sm rounded shadow border hover:bg-red-100"
      >
        ❌ Delete
      </button>
    </div>
  </div>
)} */}
<button onClick={() => setShowTagModal(true)} title="Tag People">👥</button>


<TagPeople
  isOpen={showTagModal}
  onClose={() => setShowTagModal(false)}
  taggedUsers={taggedUsers}
  setTaggedUsers={setTaggedUsers}
  searchUrl="/v1/users/friends/search"
  title="👥 Tag Your Friends"
  placeholder="Type a friend's name..."
/>


              <button onClick={() => openModal("Feeling", "How are you feeling?", setFeeling, true)}>😊</button>
              <button onClick={() => setLocationModalOpen(true)}>📍</button> {/* Updated */}
              <button
                onClick={() => setShareToWhatsApp((prev) => !prev)}
                className={shareToWhatsApp ? "text-green-500" : ""}
                title="Toggle WhatsApp Share"
              >
                🟢
              </button>
            </div>
          </div>
        </div>

        {/* Next Button */}
        <div className="px-4 pb-4">
          {uploading?<button className="w-full bg-blue-600 text-white text-sm px-6 py-2 rounded hover:bg-blue-700 transition">
            Uploading...
          </button>:<button  onClick={handleUploadData} className="w-full bg-blue-600 text-white text-sm px-6 py-2 rounded hover:bg-blue-700 transition">
            Next
          </button>}
        </div>
      </div>
 {/* <div className="fixed h-[100vh] w-[100vw] bg-red-500 top-0"> */}

 {/* </div> */}
      {/* Modals */}
      <ModalOverlay
        isOpen={modalOpen}
        title={modalTitle}
        message={modalMessage}
        showInput={showModalInput}
        inputValue={modalInputValue}
        setInputValue={setModalInputValue}
        onClose={() => setModalOpen(false)}
        onConfirm={() => {
          if (modalCallback) modalCallback(modalInputValue);
          setModalOpen(false);
        }}
      />

      {/* Location Modal */}
      <LocationModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        onSelect={(loc) => setLocation(loc)}
      />
      {/* <div className="fixed w-[100vw] h-[100vh] flex justify-center items-center bg-red"> */}

      {/* <       <button
  o/div> */}

      {/* Show Video Recorder Modal */}
{showVideoRecorder && (
  <VideoRecording
    onClose={() => setShowVideoRecorder(false)}
    // onVideoRecorded={(file) => {
    //   const url = URL.createObjectURL(file);
    //   setVideo(url);
    //   setVideoFile(file);
    //   setShowVideoRecorder(false);
    // }}
    setFile={setFile}
  />
)}
     
    </div>
    </div>
  );
};

export default CreatePost;
