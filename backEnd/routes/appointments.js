import express from 'express';
import {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  assignMechanic
} from '../controllers/appointmentController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate, appointmentSchema } from '../middleware/validation.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getAppointments)
  .post(protect, validate(appointmentSchema), createAppointment);

router
  .route('/:id')
  .get(protect, getAppointment)
  .put(protect, updateAppointment)
  .delete(protect, deleteAppointment);

router.put(
  '/:id/assign',
  protect,
  authorize('mechanic', 'admin'),
  assignMechanic
);

export default router;
