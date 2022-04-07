const mongoose = require('mongoose');

const CarShema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    carVIN: { type: String, required: true, unique: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    type: { type: mongoose.Schema.Types.ObjectId, ref: 'Type', required: true },
    carImage: { type: String, required: true },
    capacity: { type: Number, required: true },
    bagCapacity: { type: Number, required: true },
    passengerAirbag: { type: Boolean, required: true, default: false },
    fuelType: { type: String, required: true, default: 'Benzin' },
    gearType: { type: String, required: true, default: 'Manuel' },
    brakeABS: { type: Boolean, required: true, default: false },
    bookedTimeSlots: [
      {
        from: { type: String, required: true },
        to: { type: String, required: true },
      },
    ],
    driverConditions: {
      driverAge: { type: Number, required: true },
      driverLicense: { type: Number, required: true },
      creditCard: { type: Boolean, required: true },
    },

    rentPerDay: { type: Number, required: true },
    monthlyCost: { type: Number, required: true },
  },
  { timestamps: true }
);

const Car = mongoose.model('Car', CarShema);

module.exports = Car;
