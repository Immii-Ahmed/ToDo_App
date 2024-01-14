// models/userSchema.js
const mongoose = require('mongoose');

// user's and doctors 
const listItems = new mongoose.Schema({
  item: { type: String, required: true },
  status: { type: String, enum: ['Checked', 'Pending'], required: true, default: 'Pending'  },
  createdAt: { type: Date, default: Date.now }
});



// Export both schemas
const ListItems = mongoose.model('ListItems', listItems);
// const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = {
    ListItems
  };