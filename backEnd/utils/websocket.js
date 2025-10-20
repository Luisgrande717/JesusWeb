import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';

let wss;
const clients = new Map(); // Map to store client connections with user IDs

export const initWebSocket = (server) => {
  wss = new WebSocketServer({ server });

  wss.on('connection', (ws, req) => {
    console.log('New WebSocket connection');

    // Handle authentication
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);

        // Authenticate user
        if (data.type === 'auth') {
          const token = data.token;
          const decoded = jwt.verify(token, process.env.JWT_SECRET);

          ws.userId = decoded.id;
          ws.userRole = decoded.role;
          clients.set(decoded.id, ws);

          ws.send(JSON.stringify({
            type: 'auth',
            success: true,
            message: 'Authenticated successfully'
          }));

          console.log(`User ${decoded.id} authenticated via WebSocket`);
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Invalid message format'
        }));
      }
    });

    ws.on('close', () => {
      if (ws.userId) {
        clients.delete(ws.userId);
        console.log(`User ${ws.userId} disconnected`);
      }
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  console.log('✓ WebSocket server initialized');
};

// Broadcast to all connected clients
export const broadcast = (data) => {
  if (!wss) return;

  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // OPEN state
      client.send(JSON.stringify(data));
    }
  });
};

// Send message to specific user
export const sendToUser = (userId, data) => {
  const client = clients.get(userId);
  if (client && client.readyState === 1) {
    client.send(JSON.stringify(data));
  }
};

// Notify about repair update
export const notifyRepairUpdate = (appointmentId, userId, update) => {
  sendToUser(userId, {
    type: 'repair_update',
    appointmentId,
    data: update
  });
};

// Notify about appointment status change
export const notifyAppointmentStatus = (appointmentId, userId, status) => {
  sendToUser(userId, {
    type: 'appointment_status',
    appointmentId,
    status
  });
};

// Notify about new invoice
export const notifyNewInvoice = (userId, invoice) => {
  sendToUser(userId, {
    type: 'new_invoice',
    data: invoice
  });
};

export default { initWebSocket, broadcast, sendToUser, notifyRepairUpdate, notifyAppointmentStatus, notifyNewInvoice };
