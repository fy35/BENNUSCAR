import { useState, useEffect } from 'react';
import moment from 'moment';
import axios from 'axios';
import StripeCheckout from 'react-stripe-checkout';

//ui
import Loader from '../../../components/ui/Loader';
import DateSelector from '../../../components/ui/DateSelector';
import Message from '../../../components/ui/Message';

//customization
import { Icon } from '@iconify/react';

const BookingMiddle = ({ car }) => {
  /***************************
   ****** COMP STATES *****
   ***************************/
  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const [totalDays, setTotalDays] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  /***************************
   ****** EVENT HANDLERS *****
   ***************************/

  //set selected dates
  const selectedDates = (values) => {
    setFrom(moment(values[0]).format('MMM DD yyyy HH:mm'));
    setTo(moment(values[1]).format('MMM DD yyyy HH:mm'));
    setTotalDays(moment(values[1]).diff(values[0], 'Days'));
  };

  // set total amount
  useEffect(() => {
    setTotalAmount(totalDays * car.rentPerDay);
  }, [totalDays, car.rentPerDay]);

  //stripecheckout and booking car
  const onToken = async (token) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    };
    const data = {
      token,
      car: car._id,
      carName: car.name,
      carVIN: car.carVIN,
      totalDays,
      rentPerDay: car.rentPerDay,
      totalAmount,
      bookedTimeSlots: {
        from,
        to,
      },
    };

    setBookingLoading(true);
    setSuccessMsg();
    setErrorMsg();

    try {
      const res = await axios.post(`/api/private/booking/bookcar`, data, config);

      setBookingLoading(false);
      setSuccessMsg(res.data.data.message);
      setErrorMsg();
    } catch (error) {
      setBookingLoading(false);
      setErrorMsg(error.response.data.error);
      setSuccessMsg();
    }
  };

  return (
    <>
      {bookingLoading && (
        <div className="flex justify-center">
          <Loader />
        </div>
      )}
      <Message successMsg={successMsg} errorMsg={errorMsg} />

      <div className="features flex flex-row justify-between ">
        <div className="w-5/12">
          <span className="font-semibold">Tarih Seçin</span>
          <br />
          <span>
            <DateSelector onChange={selectedDates} car={car} />
          </span>
        </div>
        <div className="w-7/12">
          <div className="font-semibold">Sipariş Bilgileri</div>
          <div className="mt-2 text-gray-600 grid md:grid-cols-2 text-sm">
            {from && to && (
              <>
                <div className="flex items-center gap-2">
                  <Icon icon="bi:people-fill" width="16" />
                  Başlangıç Tarihi{' '}
                </div>
                <div className="flex items-center gap-2">
                  {from && to && (
                    <p className="bg-emerald-600 text-white flex justify-center items-center rounded-md px-5 m-2">
                      {from}
                    </p>
                  )}
                </div>
              </>
            )}
            {from && to && (
              <>
                <div className="flex items-center gap-2">
                  <Icon icon="bi:people-fill" width="16" />
                  Bitiş Tarihi{' '}
                </div>
                <div className="flex items-center gap-2">
                  {from && to && (
                    <p className="bg-emerald-600 text-white flex justify-center items-center rounded-md px-5 m-2">
                      {to}
                    </p>
                  )}
                </div>
              </>
            )}
            {from && to && (
              <>
                <div className="flex items-center gap-2">
                  <Icon icon="bi:people-fill" width="16" />
                  Toplam Seçilen Gün Sayısı{' '}
                </div>
                <div className="flex items-center gap-2">
                  {from && to && (
                    <p className="bg-emerald-600 text-white flex justify-center items-center rounded-md px-5 m-2">
                      {totalDays} gün
                    </p>
                  )}
                </div>
              </>
            )}
            {from && to && (
              <>
                <div className="flex items-center gap-2">
                  <Icon icon="bi:people-fill" width="16" />
                  Günlük Kira{' '}
                </div>
                <div className="flex items-center gap-2">
                  {car.rentPerDay && (
                    <p className="bg-emerald-600 text-white flex justify-center items-center rounded-md px-5 m-2">
                      {`${car.rentPerDay} TL`}
                    </p>
                  )}
                </div>
              </>
            )}

            {from && to && (
              <>
                <div className="flex items-center gap-2">
                  <Icon icon="bi:people-fill" width="16" />
                  Toplam Kira{' '}
                </div>
                <div className="flex items-center gap-2">
                  {from && to && (
                    <p className="bg-emerald-600 text-white flex justify-center items-center rounded-md px-5 m-2">
                      {`${totalAmount} TL`}
                    </p>
                  )}
                </div>
              </>
            )}
            {from && to && (
              <>
                <div className="flex items-center gap-2">
                  <StripeCheckout
                    name="BENNUSCAR."
                    description="It's your car!"
                    image="/assets/stripe-logo.png" // the pop-in header image (default none)
                    shippingAddress
                    amount={totalAmount * 100}
                    currency="TRY"
                    token={onToken}
                    stripeKey="pk_test_51KckStHQluZPbjhTHIeWS6xu88SnjQM30KLlxlb5jYBOWU2CGSH756qIlVqqrkrc2BAjwv0zULcDAAo0Y0eZknNp00L5kav9Cs"
                  >
                    <button className="bg-emerald-500 hover:bg-emerald-400 transition-colors rounded-full px-3.5 py-1 text-white focus:ring-2 ring-emerald-500 flex flex-row items-center justify-between">
                      <p className="px-1">Hemen Kirala</p>
                      <i className="fa-solid fa-angle-right"></i>
                    </button>
                  </StripeCheckout>
                </div>
                <div className="flex items-center gap-2"></div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingMiddle;
