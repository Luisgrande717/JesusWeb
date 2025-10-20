import mongoose from 'mongoose';

const repairUpdateSchema = new mongoose.Schema({
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  mechanic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: [true, 'Please provide an update message'],
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  stage: {
    type: String,
    enum: ['inspection', 'diagnosis', 'parts_ordered', 'in_repair', 'quality_check', 'completed'],
    required: true
  },
  photos: [{
    filename: String,
    path: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  estimatedCompletion: Date,
  isPrivate: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('RepairUpdate', repairUpdateSchema);
