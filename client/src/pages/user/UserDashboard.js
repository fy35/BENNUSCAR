import { useState, useEffect } from 'react';
import axios from 'axios';
import { Pagination } from 'rsuite';
//ui
import Loader from '../../components/ui/Loader';

//components
import DashboardLeftTop from './usercomponents/dashboard/DashboardLeftTop';
import DashboardRightTop from './usercomponents/dashboard/DashboardRightTop';
import DashboardRightMiddle from './usercomponents/dashboard/DashboardRightMiddle';

const UserDashboard = ({ history }) => {
  const token = localStorage.getItem('authToken');
  const [loading, setLoading] = useState(false);
  /***************************
   ****** LIFECYCYLE *****
   ***************************/
  //getting user info
  const [user, setUser] = useState([]);

  useEffect(() => {
    if (!token) {
      history.push('/login');
    } else {
      const fetchUser = async () => {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            ownertype: `user`,
          },
        };
        setLoading(true);
        try {
          const res = await axios.get(`/api/private/user`, config);
          setUser(res.data.user);
          setLoading(false);
        } catch (error) {
          localStorage.removeItem('authToken');
          history.push('/login');
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [history, token]);

  //getting bookings
  const [limit, setLimit] = useState(3);
  const [page, setPage] = useState(1);

  const handleChangeLimit = (dataKey) => {
    setPage(1);
    setLimit(dataKey);
  };

  const [bookings, setBookings] = useState([]);
  const [totalPage, setTotalPage] = useState(0);

  useEffect(() => {
    if (!token) {
      history.push('/login');
    } else {
      const fetchBookings = async () => {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
        setLoading(true);

        try {
          const res = await axios.get(
            `/api/private/booking/getUserBookings?sort=desc&skip=${page}&limit=${limit}}`,
            config
          );
          setBookings(res.data.data.bookings);
          setTotalPage(res.data.data.total);
          setLoading(false);
        } catch (error) {
          localStorage.removeItem('authToken');
          history.push('/login');
          setLoading(false);
        }
      };

      fetchBookings();
    }
  }, [history, token, page, limit]);

  return (
    <div className="bg-gray-100 min-w-screen">
      <div className="container m-auto overflow-hidden">
        {loading ? (
          <div className="flex justify-center">
            <Loader />
          </div>
        ) : (
          <div className="grid grid-rows-2 gap-4 my-2">
            <div className="md:flex no-wrap md:mx-1 rounded border p-2 gap-2">
              {/* LEFT SIDE */}
              <div className="w-full md:w-3/12 md:mx-1 md:h-full">
                <div className="bg-white p-3 shadow rounded flex flex-col place-content-start items-center gap-2 h-fit md:h-full ">
                  <DashboardLeftTop user={user} />
                </div>

                <div className="my-2"></div>
              </div>

              {/* RIGHT SIDE */}
              <div className="w-full md:w-9/12 md:mx-1 ">
                <div className="bg-white p-3 shadow rounded-sm gap-2">
                  <DashboardRightTop user={user} />
                </div>
                <div className="my-2"></div>

                <div className="bg-white p-3 shadow rounded-sm">
                  <DashboardRightMiddle bookings={bookings} />
                  <div style={{ padding: 20 }}>
                    <Pagination
                      prev
                      next
                      first
                      last
                      ellipsis
                      boundaryLinks
                      maxButtons={5}
                      size="xs"
                      layout={['total', '-', 'limit', '|', 'pager', 'skip']}
                      total={totalPage}
                      limitOptions={[3, 6, 10, 15, 20, 50]}
                      limit={limit}
                      activePage={page}
                      onChangePage={setPage}
                      onChangeLimit={handleChangeLimit}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
