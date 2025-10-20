import Invoice from '../models/Invoice.js';
import Appointment from '../models/Appointment.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Get all invoices (filtered by role)
export const getInvoices = async (req, res, next) => {
  try {
    let query;

    if (req.user.role === 'user') {
      query = { user: req.user.id };
    } else {
      query = {};
    }

    const invoices = await Invoice.find(query)
      .populate('user', 'name email')
      .populate('appointment', 'serviceType scheduledDate')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: invoices.length,
      data: invoices
    });
  } catch (error) {
    next(error);
  }
};

// Get single invoice
export const getInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('appointment', 'serviceType scheduledDate carInfo');

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    // Make sure user owns invoice or is mechanic/admin
    if (
      invoice.user._id.toString() !== req.user.id &&
      req.user.role !== 'mechanic' &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this invoice'
      });
    }

    res.status(200).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    next(error);
  }
};

// Create invoice (mechanic/admin only)
export const createInvoice = async (req, res, next) => {
  try {
    const { appointmentId, items, tax, notes } = req.body;

    // Verify appointment exists
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Calculate totals
    const subtotal = items.reduce((sum, item) => {
      item.total = item.quantity * item.unitPrice;
      return sum + item.total;
    }, 0);

    const total = subtotal + (tax || 0);

    // Set due date to 30 days from now
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    const invoice = await Invoice.create({
      appointment: appointmentId,
      user: appointment.user,
      items,
      subtotal,
      tax: tax || 0,
      total,
      dueDate,
      notes
    });

    // Update appointment with actual cost
    await Appointment.findByIdAndUpdate(appointmentId, {
      actualCost: total
    });

    res.status(201).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    next(error);
  }
};

// Create Stripe payment intent
export const createPaymentIntent = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    // Make sure user owns invoice
    if (invoice.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to pay this invoice'
      });
    }

    // Check if already paid
    if (invoice.status === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Invoice already paid'
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(invoice.total * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        invoiceId: invoice._id.toString(),
        invoiceNumber: invoice.invoiceNumber
      }
    });

    // Save payment intent ID
    invoice.stripePaymentIntentId = paymentIntent.id;
    await invoice.save();

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    next(error);
  }
};

// Confirm payment
export const confirmPayment = async (req, res, next) => {
  try {
    const { paymentIntentId } = req.body;

    const invoice = await Invoice.findOne({ stripePaymentIntentId: paymentIntentId });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    // Update invoice status
    invoice.status = 'paid';
    invoice.paymentMethod = 'stripe';
    invoice.paidAt = new Date();
    await invoice.save();

    // Update appointment status
    await Appointment.findByIdAndUpdate(invoice.appointment, {
      status: 'completed'
    });

    res.status(200).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    next(error);
  }
};

// Update invoice (mechanic/admin only)
export const updateInvoice = async (req, res, next) => {
  try {
    let invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    next(error);
  }
};
