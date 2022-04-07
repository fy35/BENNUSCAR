const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const BookingShema = new mongoose.Schema(
  {
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    customer: { type: Object, required: true },
    bookedTimeSlots: {
      from: { type: String, required: true },
      to: { type: String, required: true },
    },
    totalDays: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    transactionId: { type: String, required: true },
    receipt: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', BookingShema);

module.exports = Booking;
