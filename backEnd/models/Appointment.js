import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceType: {
    type: String,
    required: [true, 'Please specify service type'],
    enum: [
      'oil_change',
      'brake_service',
      'tire_rotation',
      'engine_diagnostic',
      'transmission_service',
      'battery_replacement',
      'ac_service',
      'general_inspection',
      'custom'
    ]
  },
  customService: {
    type: String,
    trim: true
  },
  scheduledDate: {
    type: Date,
    required: [true, 'Please provide scheduled date']
  },
  scheduledTime: {
    type: String,
    required: [true, 'Please provide scheduled time']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  assignedMechanic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  estimatedCost: {
    type: Number,
    min: 0
  },
  actualCost: {
    type: Number,
    min: 0
  },
  carInfo: {
    make: String,
    model: String,
    year: Number,
    licensePlate: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
appointmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Appointment', appointmentSchema);
