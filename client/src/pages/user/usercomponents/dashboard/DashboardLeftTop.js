import React from 'react';
import { Link } from 'react-router-dom';

const DashboardLeftTop = ({ user }) => {
  return (
    <>
      <div className="w-[150px] h-[150px] relative overflow-hidden rounded-full border-[3px]">
        <img
          className="block my-0 mx-auto h-auto w-auto -ml-0"
          src={user.image ? `/uploads/profiles/${user.image}` : '/assets/null-person.jpg'}
          alt=""
        />
      </div>
      <div className="flex flex-col items-center justify-center">
        <span className="block text-2xl font-semibold tracking-wide px-4 pt-2 text-gray-700 dark:text-white ">
          {user.fullname ? user.fullname : 'BENNUSCAR.'}
        </span>
        <p className="text-sm text-gray-500 hover:text-gray-700 leading-6">
          {user.username ? user.username : 'BENNUSCAR.'}
        </p>
      </div>

      <p className="text-sm text-gray-500 hover:text-gray-700 leading-6">
        {user.bio ? user.bio : 'BENNUSCAR.'}
      </p>

      <Link
        to="/userdashboard/settings"
        className="bg-[#f6f8fa] hover:bg-[#f3f4f6] border border-[rgba(27,31,36,0.15)] rounded-md w-[75%] shadow-sm text-center"
      >
        Edit Profile
      </Link>
    </>
  );
};

export default DashboardLeftTop;
