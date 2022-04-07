import React from 'react';
import AdminHomeTop from '../dashboard/AdminHomeTop';
import AdminHomeMiddle from '../dashboard/AdminHomeMiddle';
import AdminHomeBottom from '../dashboard/AdminHomeBottom';

const AdminAnalyticsPage = () => {
  return (
    <div className="w-full md:mx-1 ">
      <div className="bg-white p-3 shadow hover:shadow-md rounded-sm">
        {' '}
        <div className="grid md:grid-cols-3 text-sm p-2 place-items-center gap-4">
          <AdminHomeTop />
        </div>
      </div>
      <div className="py-1"></div>
      <div className="bg-white p-3 shadow rounded-sm">
        <div className="grid md:grid-cols-2 text-sm gap-4">
          <AdminHomeMiddle />
        </div>
      </div>

      <div className="py-1"></div>
      <div className="bg-white p-3 shadow rounded-sm">
        <div className="grid md:grid-cols-7 text-sm gap-4">
          <AdminHomeBottom />
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
