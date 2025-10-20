import express from 'express';
import {
  getInvoices,
  getInvoice,
  createInvoice,
  createPaymentIntent,
  confirmPayment,
  updateInvoice
} from '../controllers/invoiceController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getInvoices)
  .post(protect, authorize('mechanic', 'admin'), createInvoice);

router
  .route('/:id')
  .get(protect, getInvoice)
  .put(protect, authorize('mechanic', 'admin'), updateInvoice);

router.post('/:id/payment-intent', protect, createPaymentIntent);
router.post('/confirm-payment', protect, confirmPayment);

export default router;
