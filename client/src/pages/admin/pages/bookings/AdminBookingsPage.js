import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pagination } from 'rsuite';

//ui
import Loader from '../../../../components/ui/Loader';

//cumponent
import AdminBookingListItem from '../../ui/AdminBookingListItem';

const AdminBookingsPage = ({ history }) => {
  /***************************
   ****** COMP STATES *****
   ***************************/

  const [limit, setLimit] = useState(6);
  const [page, setPage] = useState(1);

  const handleChangeLimit = (dataKey) => {
    setPage(1);
    setLimit(dataKey);
  };

  /***************************
   ****** FETCH USERS *****
   ***************************/
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState([]);
  const [totalPage, setTotalPage] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      history.push('/login');
    }

    const fetchBookings = async () => {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      };
      setLoading(true);

      try {
        const res = await axios.get(
          `/api/private/admin/bookings?sort=desc&skip=${page}&limit=${limit}}`,
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
  }, [history, page, limit]);

  return (
    <div className="w-full md:mx-1 ">
      <div className="bg-white p-3 shadow hover:shadow-md rounded-sm">
        {loading ? (
          <div className="flex justify-center">
            <Loader />
          </div>
        ) : (
          <>
            {bookings && (
              <>
                {' '}
                {bookings?.map((booking) => (
                  <AdminBookingListItem key={booking._id} booking={booking} />
                ))}
              </>
            )}
          </>
        )}
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
            limitOptions={[8, 15, 20, 30]}
            limit={limit}
            activePage={page}
            onChangePage={setPage}
            onChangeLimit={handleChangeLimit}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminBookingsPage;
