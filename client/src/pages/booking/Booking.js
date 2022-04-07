import React, { useState, useEffect } from 'react';
import axios from 'axios';

// components
import BookingTop from './bookingcomponents/BookingTop';
import BookingMiddle from './bookingcomponents/BookingMiddle';
import BookingBottom from './bookingcomponents/BookingBottom';
import BookingLeft from './bookingcomponents/BookingLeft';

//ui
import Loader from '../../components/ui/Loader';

const Booking = ({ history, match }) => {
  /***************************
   ****** LIFE CYCYLE *****
   ***************************/
  const carId = match.params.carId;

  const [car, setCar] = useState([]);
  const [loading, setLoading] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      history.push('/login');
    } else {
      const fetchCars = async () => {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        };
        setLoading(true);

        try {
          const res = await axios.get(`/api/private/car/find/${carId}`, config);
          setCar(res.data.data);
          setLoading(false);
        } catch (error) {
          localStorage.removeItem('authToken');
          history.push('/login');
          setLoading(false);
        }
      };
      fetchCars();
    }
  }, [history, carId]);

  return (
    <div className="container min-h-screen my-2 mx-auto overflow-hidden">
      {' '}
      {loading ? (
        <div className="flex justify-center">
          <Loader />
        </div>
      ) : (
        <>
          {car && (
            <div className="grid grid-rows-2 gap-4 my-2">
              <div className="md:flex no-wrap md:mx-2 bg-white rounded border p-2 gap-2 md:divide-x">
                <BookingLeft car={car} />
                <div className="w-full md:w-7/12 md:mx-2 pl-4 ">
                  {' '}
                  <BookingTop car={car} />
                  <hr />
                  {/* range picker */}
                  <BookingMiddle car={car} />
                  <hr />
                  <BookingBottom car={car} />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Booking;
