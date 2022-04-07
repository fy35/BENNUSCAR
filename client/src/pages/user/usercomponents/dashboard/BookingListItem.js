import moment from 'moment';

const BookingListItem = ({ booking }) => {
  return (
    <>
      <li className="grid md:grid-cols-12 text-sm border rounded hover:shadow-md my-2 ">
        {' '}
        {/* left */}
        <div className="grid grid-cols-1 col-span-3 h-full">
          <div className="px-4 py-2 font-extrabold h-fit text-center border-b">Car Details</div>
          <div className="grid grid-cols-1 py-2 gap-2">
            <div className="grid grid-rows-5 grid-flow-row">
              <div className="grid grid-cols-2">
                <div className="px-4 font-semibold">Car Name</div>{' '}
                <div className="px-4 relative inline-block tooltip">
                  <p className="hover:text-gray-400">
                    {booking.car.name.length > 10
                      ? booking.car.name.substring(0, 10) + '...'
                      : booking.car.name.substring(0, 15)}
                  </p>
                  <div className="p-2 bg-gray-500 text-white shadow-md rounded-sm z-20 absolute invisible tooltip-item ">
                    <p className="font-semibold break-words">{booking.car.name}</p>
                  </div>
                </div>
              </div>{' '}
              <div className="grid grid-cols-2">
                <div className="px-4 font-semibold">VIN</div>{' '}
                <div className="px-4 relative inline-block tooltip">
                  <p className="hover:text-gray-400">
                    {booking.car.carVIN.length > 10
                      ? booking.car.carVIN.substring(0, 10) + '...'
                      : booking.car.carVIN.substring(0, 15)}
                  </p>
                  <div className="p-2 bg-gray-500 text-white shadow-md rounded-sm z-20 absolute invisible tooltip-item ">
                    <p className="font-semibold break-words">{booking.car.carVIN}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* middle */}
        <div className="grid grid-cols-1 col-span-7 border-x h-full ">
          <div className="px-4 py-2 font-extrabold h-fit text-center border-b">Order Details</div>
          <div className="grid grid-cols-2 py-2 gap-2">
            {/* middleleft */}
            <div className="grid grid-rows-5 grid-flow-row">
              <div className="grid grid-cols-2">
                <div className="px-4 font-semibold">Rented Days</div>
                <div className="px-4">{booking.totalDays}</div>
              </div>
              <div className="grid grid-cols-2 ">
                <div className="px-4 font-semibold">Daily Amount</div>
                <div className="px-4">{`${booking.car.rentPerDay} TL`}</div>
              </div>
              <div className="grid grid-cols-2 ">
                <div className="px-4 font-semibold">Total Amount</div>
                <div className="px-4 ">{`${booking.totalAmount} TL`}</div>
              </div>
            </div>
            {/* middleright */}
            <div className="grid grid-rows-5 grid-flow-row">
              {' '}
              <div className="grid grid-cols-2 ">
                <div className="px-4 font-semibold">Start Date</div>
                <div className="px-4 ">{booking.bookedTimeSlots.from}</div>
              </div>
              <div className="grid grid-cols-2 ">
                <div className="px-4 font-semibold">Finish Date</div>
                <div className="px-4 ">{booking.bookedTimeSlots.to}</div>
              </div>
              <div className="grid grid-cols-2 ">
                <div className="px-4 font-semibold">Order Date</div>
                <div className="px-4">{moment(booking.createdAt).format('MMM DD yyy HH:mm')}</div>
              </div>
              <div className="grid grid-cols-2 ">
                <div className="px-4 font-semibold">Transaction Id</div>
                <div className="px-4 relative inline-block tooltip">
                  <p className="hover:text-gray-400">
                    {booking.transactionId.length > 12
                      ? booking.transactionId.substring(0, 12) + '...'
                      : booking.transactionId.substring(0, 12)}
                  </p>
                  <div className="p-2 bg-gray-500 text-white shadow-md rounded-sm z-20 absolute invisible tooltip-item ">
                    <p className="font-semibold break-words">{booking.transactionId}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 ">
                <p
                  className="px-4 font-semibold cursor-pointer text-blue-700 underline underline-offset-1"
                  onClick={() => {
                    window.open(
                      `${booking.receipt}`,
                      'Popup',
                      'toolbar=no, location=no,resizable=no, statusbar=no, menubar=no, scrollbars=1, resizable=0'
                    );
                  }}
                >
                  Show Receipt
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* right */}
        <div className="grid grid-cols-1 col-span-2 h-full">
          <div className="px-4 py-2 font-extrabold border-b h-fit text-center">Car Photo</div>
          <div className="flex items-center gap-2 h-fit md:h-full p-4">
            <img
              src={
                booking.car.carImage
                  ? `../uploads/cars/${booking.car.carImage}`
                  : '/assets/vehicle-placeholder.png'
              }
              alt=""
            />
          </div>
        </div>
      </li>
    </>
  );
};

export default BookingListItem;
