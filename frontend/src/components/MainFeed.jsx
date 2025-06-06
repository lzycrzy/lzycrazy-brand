import Stories from './StorySlider';
import { FaCamera, FaFileAlt } from 'react-icons/fa';

const MainFeed = ({ posts }) => (
  <div className="flex flex-1 flex-col overflow-y-auto p-4">
    <Stories />

    <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
      <div className="flex items-start space-x-4">
        <img src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="User" className="h-11 w-11 rounded-full object-cover" />
        <textarea placeholder="What's on your mind?" className="flex-1 resize-none rounded-xl border bg-gray-50 p-3 text-sm focus:ring-2 focus:ring-blue-400 outline-none" rows={3} />
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        <button className="flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm text-blue-700 hover:bg-blue-200">
          <FaCamera /> Photo/Video
        </button>
        <button className="flex items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700">
          <FaFileAlt /> Post
        </button>
      </div>
    </div>

    {posts.map((post, idx) => (
      <div key={idx} className="mb-6 rounded-xl bg-white p-5 shadow-sm">
        <div className="mb-2 flex items-center">
          <img src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="User" className="mr-3 h-10 w-10 rounded-full" />
          <div>
            <div className="font-semibold">{post.user}</div>
            <div className="text-xs text-gray-500">{post.time}</div>
          </div>
          <div className="ml-auto cursor-pointer">...</div>
        </div>
        <div className="mb-2">{post.content}</div>
        {post.image && <img src={post.image} alt="Post" className="mb-2 h-72 w-full rounded-lg object-cover" />}
        <div className="mt-2 flex justify-around text-sm text-gray-600">
          <div className="flex items-center space-x-1">👍 {post.likes}</div>
          <div className="flex items-center space-x-1">💬 {post.comments}</div>
          <div className="flex items-center space-x-1">🔗 {post.share}</div>
        </div>
      </div>
    ))}
  </div>
);

export default MainFeed;
