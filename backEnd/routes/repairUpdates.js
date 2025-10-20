import express from 'express';
import {
  getRepairUpdates,
  createRepairUpdate,
  deleteRepairUpdate
} from '../controllers/repairUpdateController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate, repairUpdateSchema } from '../middleware/validation.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router
  .route('/appointment/:appointmentId')
  .get(protect, getRepairUpdates);

router.post(
  '/',
  protect,
  authorize('mechanic', 'admin'),
  upload.array('photos', 5),
  validate(repairUpdateSchema),
  createRepairUpdate
);

router.delete(
  '/:id',
  protect,
  authorize('mechanic', 'admin'),
  deleteRepairUpdate
);

export default router;
