import Appointment from '../models/Appointment.js';

// Get all appointments (filtered by role)
export const getAppointments = async (req, res, next) => {
  try {
    let query;

    // If user is regular user, show only their appointments
    if (req.user.role === 'user') {
      query = { user: req.user.id };
    }
    // If mechanic, show assigned appointments
    else if (req.user.role === 'mechanic') {
      query = { assignedMechanic: req.user.id };
    }
    // Admin can see all
    else {
      query = {};
    }

    const appointments = await Appointment.find(query)
      .populate('user', 'name email phone')
      .populate('assignedMechanic', 'name specialization')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};

// Get single appointment
export const getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('assignedMechanic', 'name specialization');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Make sure user owns appointment or is mechanic/admin
    if (
      appointment.user._id.toString() !== req.user.id &&
      req.user.role !== 'mechanic' &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this appointment'
      });
    }

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// Create new appointment
export const createAppointment = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    // If user has car info saved, use it as default
    if (!req.body.carInfo && req.user.carInfo) {
      req.body.carInfo = req.user.carInfo;
    }

    const appointment = await Appointment.create(req.body);

    res.status(201).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// Update appointment
export const updateAppointment = async (req, res, next) => {
  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Make sure user owns appointment or is mechanic/admin
    if (
      appointment.user.toString() !== req.user.id &&
      req.user.role !== 'mechanic' &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this appointment'
      });
    }

    appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// Delete appointment
export const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Make sure user owns appointment or is admin
    if (
      appointment.user.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this appointment'
      });
    }

    await appointment.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// Assign mechanic to appointment (admin/mechanic only)
export const assignMechanic = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        assignedMechanic: req.body.mechanicId,
        status: 'confirmed'
      },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};
