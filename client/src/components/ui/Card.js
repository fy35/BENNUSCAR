import React from 'react';
import { Link } from 'react-router-dom';

//icons
import { Icon } from '@iconify/react';

const Card = ({ car }) => {
  return (
    <div className="flex flex-col justify-between bg-white hover:shadow-md px-8 py-3 border">
      <div className="card-header flex flex-row justify-between items-center mb-5">
        <h1 className="text-xl font-medium">{car.name}</h1>
        <Link
          to={`/booking/${car._id}`}
          className="bg-emerald-500 hover:bg-emerald-400 transition-colors rounded-full px-3.5 py-1 text-white hover:text-white hover:text-deco focus:ring-2 ring-emerald-500 flex flex-row items-center justify-between"
        >
          <p className="px-1">Hemen Kirala</p>
          <i className="fa-solid fa-angle-right"></i>
        </Link>
      </div>
      <div className="image mb-5 flex justify-center items-center">
        <img
          src={car.carImage ? `../uploads/cars/${car.carImage}` : '/assets/vehicle-placeholder.png'}
          alt={`${car.name}`}
        />
      </div>
      <div className="features flex flex-row justify-between">
        <div className="w-5/12 border-r-[1px]">
          <span className="font-semibold">Araç Özellikleri</span>
          <ul className="mt-2 text-gray-600">
            {car.capacity && (
              <li className="flex items-center gap-2">
                <Icon icon="bi:people-fill" width="16" />
                {car.capacity} Yetişkin
              </li>
            )}
            {car.bagCapacity && (
              <li className="flex items-center gap-2">
                <Icon icon="fa-solid:suitcase-rolling" width="16" />
                {car.bagCapacity} Büyük Bavul
              </li>
            )}
            {car.passengerAirbag && (
              <li className="flex items-center gap-2">
                <Icon icon="mdi:airbag" width="16" />
                Yolcu Airbag
              </li>
            )}
            {car.brakeABS && (
              <li className="flex items-center gap-2">
                <Icon icon="mdi:car-brake-abs" width="16" />
                ABS
              </li>
            )}
            {car.fuelType && (
              <li className="flex items-center gap-2">
                <Icon icon="maki:fuel" width="16" />
                {car.fuelType}
              </li>
            )}
            {car.gearType && (
              <li className="flex items-center gap-2">
                <Icon icon="icon-park-outline:manual-gear" width="16" />
                {car.gearType}
              </li>
            )}
          </ul>
        </div>
        <div className="w-6/12">
          <span className="font-semibold">Kiralama Koşulları</span>
          <ul className="mt-2 text-gray-600">
            <li className="flex items-center gap-2">
              <Icon icon="radix-icons:calendar" width="16" />
              {car?.driverConditions?.driverAge ? <>{car.driverConditions.driverAge}</> : 25} Yaş ve
              Üstü
            </li>
            <li className="flex items-center gap-2">
              <Icon icon="fa:drivers-license" width="16" />
              Ehliyet Yaşı{' '}
              {car?.driverConditions?.driverLicense ? (
                <>{car.driverConditions.driverLicense}</>
              ) : (
                2
              )}{' '}
              ve Üzeri
            </li>
            <li className="flex items-center gap-2">
              <Icon icon="healthicons:credit-card-outline" width="16" />
              {car?.driverConditions?.creditCard ? 1 : 1} Kredi Kartı
            </li>
          </ul>
        </div>
      </div>
      <div className="self-end flex items-center justify-center gap-2 bg-orange-400 text-white px-2 rounded w-fit">
        <Icon icon="fontisto:tl" width="12" />
        {car?.rentPerDay ? car.rentPerDay : 1} TL Günlük Kira
      </div>
    </div>
  );
};

export default Card;
