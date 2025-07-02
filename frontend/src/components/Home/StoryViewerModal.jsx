// const StoryViewerModal = ({ story, onClose }) => {
//     const [viewers, setViewers] = useState([]);
  
//     useEffect(() => {
//       const fetchViewers = async () => {
//         try {
//           const res = await axios.get(`/v1/users/story/view/${story.id}`, {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//             withCredentials: true,
//           });
//           setViewers(res.data);
//         } catch (err) {
//           console.error("Failed to fetch viewers:", err);
//         }
//       };
  
//       fetchViewers();
//     }, [story.id]);
  
//     return (
//       <div className="modal">
//         <div className="modal-content">
//           <button onClick={onClose}>Close</button>
//           <h2>Viewers</h2>
//           <ul>
//             {viewers.map((viewer) => (
//               <li key={viewer.id}>
//                 {viewer.name} viewed at {new Date(viewer.viewedAt).toLocaleString()}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     );
//   };
  