import React from 'react'
import { Link } from 'react-router';

const tabs = [
    { name: 'About Us', path: '/about' },
    { name: 'LzyCrazy Services', path: '/services' },
    { name: 'LzyCrazy Marketplace', path: '/market' },
    { name: 'Careers', path: '/careers' },
    { name: 'LzyCrazy News', path: '/news' },
  ];

function Navbar() {
  return (
    <div className='w-full flex justify-center items-center gap-5 h-16 border-b border-gray-200'>

        {tabs.map((tab, index) => (
            <div key={index} className='relative group flex flex-col items-center'>
            <Link to={tab.path} className='text-lg font-semibold text-slate-700'>
                {tab.name}
            </Link>

            <div className={`absolute -bottom-2 hidden group-hover:block w-full h-1 bg-blue-500`}></div>
            </div>
        ))}
        
    </div>
  )
}

export default Navbar