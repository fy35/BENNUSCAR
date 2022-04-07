import React from 'react';

const DashboardRightTop = ({ user }) => {
  return (
    <>
      {' '}
      <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
        <span className="tracking-wide">About</span>
      </div>
      <div className="text-gray-700">
        <div className="grid md:grid-cols-2 text-sm">
          <div className="grid grid-cols-2">
            <div className="px-4 py-2 font-semibold">Fullname</div>
            <div className="px-4 py-2 ">{user.fullname ? user.fullname : 'BENNUSCAR.'}</div>
          </div>
          <div className="grid grid-cols-2">
            <div className="px-4 py-2 font-semibold">Username</div>
            <div className="px-4 py-2 ">{user.username ? user.username : 'BENNUSCAR.'}</div>
          </div>
          <div className="grid grid-cols-2">
            <div className="px-4 py-2 font-semibold">Email</div>
            <div className="px-4 py-2 break-words ">{user.email ? user.email : 'BENNUSCAR.'}</div>
          </div>
          <div className="grid grid-cols-2">
            <div className="px-4 py-2 font-semibold">Address</div>
            <div className="px-4 py-2 ">{user.address ? user.address : 'BENNUSCAR.'}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardRightTop;
