import RepairUpdate from '../models/RepairUpdate.js';
import Appointment from '../models/Appointment.js';

// Get all updates for an appointment
export const getRepairUpdates = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;

    // Verify appointment exists
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check authorization
    if (
      appointment.user.toString() !== req.user.id &&
      req.user.role !== 'mechanic' &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these updates'
      });
    }

    // Filter private updates for non-mechanics
    let query = { appointment: appointmentId };
    if (req.user.role === 'user') {
      query.isPrivate = false;
    }

    const updates = await RepairUpdate.find(query)
      .populate('mechanic', 'name')
      .sort('createdAt');

    res.status(200).json({
      success: true,
      count: updates.length,
      data: updates
    });
  } catch (error) {
    next(error);
  }
};

// Create repair update (mechanic/admin only)
export const createRepairUpdate = async (req, res, next) => {
  try {
    const { appointmentId, message, stage, estimatedCompletion, isPrivate } = req.body;

    // Verify appointment exists
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Handle uploaded photos
    const photos = req.files ? req.files.map(file => ({
      filename: file.filename,
      path: file.path
    })) : [];

    const update = await RepairUpdate.create({
      appointment: appointmentId,
      mechanic: req.user.id,
      message,
      stage,
      photos,
      estimatedCompletion,
      isPrivate: isPrivate || false
    });

    // Update appointment status based on stage
    let appointmentStatus = 'in_progress';
    if (stage === 'completed') {
      appointmentStatus = 'completed';
    }
    await Appointment.findByIdAndUpdate(appointmentId, {
      status: appointmentStatus
    });

    const populatedUpdate = await RepairUpdate.findById(update._id)
      .populate('mechanic', 'name');

    res.status(201).json({
      success: true,
      data: populatedUpdate
    });
  } catch (error) {
    next(error);
  }
};

// Delete repair update (mechanic/admin only)
export const deleteRepairUpdate = async (req, res, next) => {
  try {
    const update = await RepairUpdate.findById(req.params.id);

    if (!update) {
      return res.status(404).json({
        success: false,
        message: 'Update not found'
      });
    }

    // Make sure user created the update or is admin
    if (
      update.mechanic.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this update'
      });
    }

    await update.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
