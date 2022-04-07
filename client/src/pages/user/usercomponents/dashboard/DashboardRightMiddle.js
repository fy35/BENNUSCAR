import BookingListItem from './BookingListItem';

const DashboardRightMiddle = ({ bookings }) => {
  return (
    <>
      {' '}
      <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
        <span className="tracking-wide">Order History</span>
      </div>
      <ul className="text-gray-700">
        {bookings.map((booking) => (
          <BookingListItem key={booking._id} booking={booking} />
        ))}
      </ul>
    </>
  );
};

export default DashboardRightMiddle;
