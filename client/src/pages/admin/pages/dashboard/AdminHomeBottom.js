import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

//components
import AdminBookingListItem from '../../ui/AdminBookingListItem';

//ui
import Loader from '../../../../components/ui/Loader';

//customization
import Avatar from 'rsuite/Avatar';
import VisibleIcon from '@rsuite/icons/Visible';

const AdminHomeBottom = () => {
  const history = useHistory();

  const [latestUsers, setLatestUsers] = useState();
  const [latestBookings, setLatestBookings] = useState();
  const [loading, setLoading] = useState();

  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      history.push('/login');
    }

    const fetchLatestUsers = async () => {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      };

      try {
        const res = await axios.get(`/api/private/admin/users?new=true`, config);
        setLatestUsers(res.data.data.users);
      } catch (error) {
        console.log(error);
      }
    };

    fetchLatestUsers();
  }, [history]);

  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      history.push('/login');
    }

    const fetchLatestBookings = async () => {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      };
      setLoading(true);
      try {
        const res = await axios.get(`/api/private/admin/bookings?new=true`, config);
        setLatestBookings(res.data.data.bookings);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchLatestBookings();
  }, [history]);

  return (
    <>
      {loading ? (
        <div className="md:col-span-7 flex justify-center">
          <Loader />
        </div>
      ) : (
        <>
          {/* latest users */}
          <div className="md:col-span-2 border rounded p-2 grid grid-cols-1 gap-1">
            <span className="tracking-wide text-xl font-semibold w-full h-min border-b text-center">
              Latest Users
            </span>
            <ul className="grid grid-cols-1 gap-1">
              {latestUsers?.map((user) => (
                <li key={user._id} className="grid grid-cols-8 border divide-x items-center p-2">
                  <Avatar
                    circle
                    src={
                      user.image ? `../uploads/profiles/${user.image}` : '/assets/null-person.png'
                    }
                    alt={user.name}
                    className="col-span-1"
                  />
                  <span className="col-span-2 flex justify-center items-center text-center">
                    {user.fullname}
                  </span>
                  <span className="col-span-4 flex justify-center items-center text-center">
                    {user.email}
                  </span>
                  <div className="col-span-1 flex justify-center">
                    <button className="col-span-1 p-1 w-fit flex justify-center items-center bg-emerald-500 text-white border rounded-full text-xl">
                      <VisibleIcon />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* latest bookings */}
          <div className="md:col-span-5 border rounded p-2 grid grid-cols-1 gap-1 place-content-start">
            <span className="tracking-wide text-xl font-semibold w-full h-min border-b text-center">
              Latest Bookings
            </span>
            <ul className="grid grid-cols-1 gap-1">
              {latestBookings?.map((booking) => (
                <AdminBookingListItem key={booking._id} booking={booking} />
              ))}
            </ul>
          </div>
        </>
      )}
    </>
  );
};

export default AdminHomeBottom;
