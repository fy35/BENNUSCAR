import React, { useState } from 'react';
import Modal from '../../../components/ui/Modal';

const BookingBottom = ({ car }) => {
  const [showModal, setShowModal] = useState(false);

  const totalBookings = useState(car.bookedTimeSlots);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="flex items-center gap-2">
        <button
          className="bg-orange-500 hover:bg-orange-400 transition-colors rounded-full px-3.5 py-1 text-white focus:ring-2 ring-orange-500 flex flex-row items-center justify-between"
          onClick={() => setShowModal(true)}
        >
          <p className="px-1">Uygun Olmayan tarihler</p>
          <i className="fa-solid fa-angle-right"></i>
        </button>

        <Modal showModal={showModal} onClose={() => setShowModal(false)} data={car}>
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <img
                  src={
                    car.carImage
                      ? `../uploads/cars/${car.carImage}`
                      : '/assets/vehicle-placeholder.png'
                  }
                  alt=""
                />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {car.name} (in Progress)
                </h3>
                <div className="mt-2">
                  <ul>
                    {totalBookings[0] === 0 ? (
                      <li>All dates are available.</li>
                    ) : (
                      totalBookings[0]?.map((bookings) => {
                        return (
                          <li
                            key={bookings._id}
                            className="border border-red-400 text-red-400 rounded my-2 px-2"
                          >{`${bookings.from} - ${bookings.to} `}</li>
                        );
                      })
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>

      <div></div>
      <div></div>
    </div>
  );
};

export default BookingBottom;

// const date = moment(new Date()).format('MMM DD yyyy HH:mm');
// if (moment(date).isBetween(bookings.from, bookings.to)) {
//   bookings.from = date;
// }
