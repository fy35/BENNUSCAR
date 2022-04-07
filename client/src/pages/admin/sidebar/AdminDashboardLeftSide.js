import React from 'react';
import AdminLeftTop from './AdminLeftTop';

const AdminDashboardLeft = () => {
  return (
    <div className="md:w-2/12 md:mx-1 md:h-full">
      <div className="bg-white p-3 shadow rounded gap-2 h-fit md:h-full ">
        <AdminLeftTop />
        <div className="my-2"></div>
      </div>
    </div>
  );
};

export default AdminDashboardLeft;
