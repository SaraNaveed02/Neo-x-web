/**
 * Nexura Realtime Server
 * Broadcasts signup, login, and message events to admin dashboards.
 */

const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3001;
const SECRET = process.env.REALTIME_SECRET || 'nexura-realtime-secret-key';

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] }
});

io.on('connection', (socket) => {
    socket.join('admin');
    console.log(`[realtime] client connected: ${socket.id}`);
    socket.on('disconnect', () => console.log(`[realtime] client disconnected: ${socket.id}`));
});

app.get('/health', (_req, res) => {
    res.json({ ok: true, service: 'nexura-realtime' });
});

app.post('/emit', (req, res) => {
    const headerSecret = req.headers['x-realtime-secret'];
    if (headerSecret !== SECRET) {
        return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    const { event, data } = req.body || {};
    if (!event) {
        return res.status(400).json({ success: false, error: 'Event name required' });
    }

    io.to('admin').emit(event, data || {});
    console.log(`[realtime] emitted: ${event}`);
    return res.json({ success: true });
});

server.listen(PORT, () => {
    console.log(`Nexura realtime server running on http://localhost:${PORT}`);
});
