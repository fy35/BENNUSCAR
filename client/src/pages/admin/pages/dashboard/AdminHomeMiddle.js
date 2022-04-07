import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Loader from '../../../../components/ui/Loader';

//charts
import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip } from 'recharts';

const AdminHomeMiddle = () => {
  const [userStats, setUserStats] = useState([]);
  const [bookingStats, setBookingStats] = useState([]);
  const [loading, setLoading] = useState();

  const MONTHS = useMemo(
    () => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Agu', 'Sep', 'Oct', 'Nov', 'Dec'],
    []
  );

  useEffect(() => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    };
    setLoading(true);
    const getRegisteredUsersByLastYear = async () => {
      try {
        const res = await axios.get(`/api/private/admin/userstats/rubly`, config);

        res.data.data.map((item) =>
          setUserStats((prev) => [
            ...prev,
            { name: MONTHS[item._id - 1], 'Registered User': item.total },
          ])
        );
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    getRegisteredUsersByLastYear();
  }, [MONTHS]);

  useEffect(() => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    };

    const getBookingsByLastYear = async () => {
      try {
        const res = await axios.get(`/api/private/admin/userstats/tbbly`, config);

        res.data.data.map((item) =>
          setBookingStats((prev) => [
            ...prev,
            {
              name: MONTHS[item._id - 1],
              'Total Bookings': item.total,
              'Total Days': item.totalDays,
              'Total Amount': item.totalAmount,
            },
          ])
        );
      } catch (error) {}
    };

    getBookingsByLastYear();
  }, [MONTHS]);

  return (
    <>
      {loading ? (
        <div className="md:col-span-7 flex justify-center">
          <Loader />
        </div>
      ) : (
        <>
          <div className="flex flex-col w-full border p-2 shadow-lg rounded items-center">
            <span className="tracking-wide text-xl font-semibold text-center">Users</span>
            {userStats && (
              <ResponsiveContainer width="90%" aspect={4 / 1}>
                <LineChart data={userStats}>
                  <XAxis dataKey="name" />
                  <Tooltip />
                  <Line type="monotone" dataKey="Registered User" stroke="#047857" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>{' '}
          <div className="flex flex-col w-full border p-2 shadow-lg rounded items-center">
            <span className="tracking-wide text-xl font-semibold text-center">Bookings</span>
            <ResponsiveContainer width="90%" aspect={4 / 1}>
              <LineChart data={bookingStats}>
                <XAxis dataKey="name" />
                <Tooltip />
                <Line type="monotone" dataKey="Total Bookings" stroke="#047857" />
                <Line type="monotone" dataKey="Total Days" stroke="#047857" />
                <Line type="monotone" dataKey="Total Amount" stroke="#0e7490" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </>
  );
};

export default AdminHomeMiddle;
