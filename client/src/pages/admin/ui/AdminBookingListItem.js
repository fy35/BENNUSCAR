import React from 'react';
import moment from 'moment';
import VisibleIcon from '@rsuite/icons/Visible';

const AdminBookingListItem = ({ booking }) => {
  return (
    <li key={booking._id} className="grid md:grid-cols-16 border divide-x items-center py-2 gap-2">
      {/* 1 */}
      <div className="col-span-2 flex justify-center items-center p-2">
        <img
          src={
            booking.car.carImage
              ? `../uploads/cars/${booking.car.carImage}`
              : '/assets/vehicle-placeholder.png'
          }
          alt="ss"
        />
      </div>
      {/* 2 */}
      <div className="col-span-2 flex flex-col content-center px-2">
        <div className="relative inline-block tooltip">
          <p className="hover:text-gray-400">
            {booking.car.name.length > 10
              ? booking.car.name.substring(0, 10) + '...'
              : booking.car.name.substring(0, 15)}
          </p>
          <div className="px-2 w-max bg-gray-500 text-white shadow-md rounded-sm z-20 absolute invisible tooltip-item ">
            <p className="font-semibold break-words">{booking.car.name}</p>
          </div>
        </div>
        <div className="relative inline-block tooltip">
          <p className="hover:text-gray-400">
            {booking?.car?.carVIN?.length > 10
              ? booking.car.carVIN.substring(0, 10) + '...'
              : booking.car.carVIN.substring(0, 15)}
          </p>
          <div className="p-2 bg-gray-500 text-white shadow-md rounded-sm z-20 absolute invisible tooltip-item ">
            <p className="font-semibold break-words">{booking.car.carVIN}</p>
          </div>
        </div>
      </div>
      {/* 3 */}
      <div className="col-span-5 grid grid-cols-2 content-center px-2">
        <div className="grid grid-cols-1">
          <span>{booking.user.username}</span>
          <span>{booking.customer.email}</span>
        </div>{' '}
        <div className="relative inline-block tooltip">
          <p className="hover:text-gray-400">
            {booking.customer.address.length > 10
              ? booking.customer.address.substring(0, 30) + '...'
              : booking.customer.address.substring(0, 35)}
          </p>
          <div className="p-2 bg-gray-500 text-white shadow-md rounded-sm z-20 absolute invisible tooltip-item ">
            <p className="font-semibold break-words">{booking.customer.address}</p>
          </div>
        </div>
      </div>
      {/* 4 */}
      <div className="col-span-6 grid grid-cols-3 content-center px-2">
        {/* 4-1 */}
        <div className="grid grid-cols-1">
          <div className="relative inline-block tooltip">
            <p className="hover:text-gray-400">Order Date</p>
            <div className="px-2 w-max bg-gray-500 text-white shadow-md rounded-sm z-20 absolute invisible tooltip-item ">
              <p className="font-semibold break-words">
                Order Date: {moment(booking.createdAt).format('MMM DD yyy HH:mm')}
              </p>
            </div>
          </div>{' '}
          <div className="relative inline-block tooltip">
            <p className="hover:text-gray-400">Start Date</p>
            <div className="px-2 w-max bg-gray-500 text-white shadow-md rounded-sm z-20 absolute invisible tooltip-item ">
              <p className="font-semibold break-words">
                Start Date: {booking.bookedTimeSlots.from}
              </p>
            </div>
          </div>{' '}
          <div className="relative inline-block tooltip">
            <p className="hover:text-gray-400">Finish Date</p>
            <div className="px-2 w-max bg-gray-500 text-white shadow-md rounded-sm z-20 absolute invisible tooltip-item ">
              <p className="font-semibold break-words">Finish Date: {booking.bookedTimeSlots.to}</p>
            </div>
          </div>
        </div>

        {/* 4-2 */}
        <div className="grid grid-cols-1">
          <div className="relative inline-block tooltip">
            <p className="hover:text-gray-400">Today Days</p>
            <div className="px-2 w-max bg-gray-500 text-white shadow-md rounded-sm z-20 absolute invisible tooltip-item ">
              <p className="font-semibold break-words">Today Days: {booking.totalDays}</p>
            </div>
          </div>{' '}
          <div className="relative inline-block tooltip">
            <p className="hover:text-gray-400">Rent Per Day</p>
            <div className="px-2 w-max bg-gray-500 text-white shadow-md rounded-sm z-20 absolute invisible tooltip-item ">
              <p className="font-semibold break-words">Rent Per Day: {booking.car.rentPerDay} TL</p>
            </div>
          </div>{' '}
          <div className="relative inline-block tooltip">
            <p className="hover:text-gray-400">Total Amount</p>
            <div className="px-2 w-max bg-gray-500 text-white shadow-md rounded-sm z-20 absolute invisible tooltip-item ">
              <p className="font-semibold break-words">Total Amount: {booking.totalAmount} TL</p>
            </div>
          </div>
        </div>

        {/* 4-3 */}
        <div className="grid grid-cols-1">
          <div className="relative inline-block tooltip">
            <p className="hover:text-gray-400">Transaction ID</p>
            <div className="px-2 w-max bg-gray-500 text-white shadow-md rounded-sm z-20 absolute invisible tooltip-item ">
              <p className="font-semibold break-words">{booking.transactionId}</p>
            </div>
          </div>{' '}
          <div>
            <p
              className="font-semibold cursor-pointer text-blue-600 underline underline-offset-1"
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
          </div>{' '}
          <div className="w-fit h-fit"></div>
        </div>
      </div>
      {/* 5 */}
      <div className="col-span-1 flex justify-center items-center">
        <button className="p-1 w-fit flex justify-center items-center bg-emerald-500 text-white border rounded-full text-xl">
          <VisibleIcon />
        </button>
      </div>
    </li>
  );
};

export default AdminBookingListItem;
