import { useState, useEffect } from 'react';
import DateRangePicker from 'rsuite/DateRangePicker';
import moment from 'moment';

const { beforeToday, combine } = DateRangePicker;

const DateSelector = ({ onChange, car }) => {
  //get unavailable dates

  const [disabledDates, setDisabledDates] = useState([]);

  const bookedTimes = car?.bookedTimeSlots;

  useEffect(() => {
    if (bookedTimes) {
      var dateArray = [];
      for (var booking of bookedTimes) {
        var currentDate = moment(booking.from);
        var stopDate = moment(booking.to);
        while (currentDate <= stopDate) {
          dateArray.push(moment(currentDate).format('yyyy-MM-DD'));
          currentDate = moment(currentDate).add(1, 'days');
        }
      }
    }
    setDisabledDates(dateArray);
  }, [bookedTimes]);

  const getDates = (date) => {
    if (disabledDates.includes(date)) {
      return true;
    }
  };

  return (
    <>
      {!car && (
        <DateRangePicker
          onChange={onChange}
          placeholder="Select Date"
          format="yyyy-MM-dd HH:mm"
          disabledDate={beforeToday()}
        />
      )}
      {car && (
        <DateRangePicker
          onChange={onChange}
          placeholder="Select Date"
          format="yyyy-MM-dd HH:mm"
          disabledDate={combine(
            (date) => getDates(moment(date).format('yyyy-MM-DD')),
            beforeToday()
          )}
        />
      )}
    </>
  );
};

export default DateSelector;
