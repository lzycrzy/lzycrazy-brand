



import Header from './Header';
import Sidebar from './Sidebar1';
import MainFeed from './MainFeed';
import RightSidebar from './RightSidebar';
import ChatSidebar from './ChatSidebar'; // Coming soon

const Home = () => {
  const posts = [
    {
      user: "Alice Johnson",
      time: "1 hour ago",
      content: "Loving this new community!",
      image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
      likes: 15,
      comments: 4,
      share: 1,
    },
    {
      user: "Bob Smith",
      time: "3 hours ago",
      content: "Check out my latest project!",
      image: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d",
      likes: 28,
      comments: 7,
      share: 3,
    },
  ];
  
  const people = [
    {
      name: "Aarav Mehta",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      follow: false,
    },
    {
      name: "Ishita Roy",
      image: "https://randomuser.me/api/portraits/women/45.jpg",
      follow: true,
    },
    {
      name: "Karan Patel",
      image: "https://randomuser.me/api/portraits/men/52.jpg",
      follow: false,
    },
    {
      name: "Riya Singh",
      image: "https://randomuser.me/api/portraits/women/12.jpg",
      follow: true,
    },
    {
      name: "Neeraj Gupta",
      image: "https://randomuser.me/api/portraits/men/64.jpg",
      follow: false,
    },
  ];
  

  return (
    <div className="h-screen w-screen mt-0 top-0  gap-4 flex flex-col bg-gray-100 font-sans overflow-hidden m-0 p-0">
      <Header />
      <div className="flex flex-1 overflow-hidden gap-4 px-4">
        <Sidebar />
        
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <MainFeed posts={posts} />
        </div>

        <RightSidebar people={people} />
        <ChatSidebar />

      </div>
    </div>
  );
};

export default Home;


