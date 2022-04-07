import React from 'react';

//customization
import { Icon } from '@iconify/react';

const BookingTop = ({ car }) => {
  return (
    <>
      {' '}
      <div className="features flex flex-row justify-between">
        <div className="w-5/12">
          <span className="font-semibold text-center">Araç Özellikleri</span>
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
            {car.driverConditions?.driverAge && (
              <li className="flex items-center gap-2">
                <Icon icon="radix-icons:calendar" width="16" />
                {car.driverConditions?.driverAge ? <>{car.driverConditions.driverAge}</> : 25} Yaş
                ve Üstü
              </li>
            )}
            {car.driverConditions?.driverLicense && (
              <li className="flex items-center gap-2">
                <Icon icon="fa:drivers-license" width="16" />
                Ehliyet Yaşı{' '}
                {car.driverConditions.driverLicense ? (
                  <>{car.driverConditions.driverLicense}</>
                ) : (
                  2
                )}{' '}
                ve Üzeri
              </li>
            )}
            {car.driverConditions?.creditCard && (
              <li className="flex items-center gap-2">
                <Icon icon="healthicons:credit-card-outline" width="16" />
                {car.driverConditions.creditCard ? 1 : 1} Kredi Kartı
              </li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default BookingTop;
