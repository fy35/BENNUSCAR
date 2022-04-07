import React from 'react';

const BookingLeft = ({ car }) => {
  return (
    <div className="w-full md:w-5/12 md:mx-2 p-2 flex flex-col justify-center items-center gap-2 ">
      <div className="card-header flex flex-col justify-center items-center mb-5 gap-10">
        <h1 className="text-xl font-medium">{car.name}</h1>
        <div className="image mb-5 ">
          <img
            src={
              car.carImage ? `../uploads/cars/${car.carImage}` : '/assets/vehicle-placeholder.png'
            }
            alt={`${car.name}`}
          />
        </div>
      </div>
    </div>
  );
};

export default BookingLeft;
