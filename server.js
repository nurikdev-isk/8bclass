const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Статические файлы
app.use(express.static(path.join(__dirname)));

// База сообщений (в памяти)
let messages = [];
let onlineCount = 0;

// Подключение клиента
io.on('connection', (socket) => {
    onlineCount++;
    io.emit('online', onlineCount);

    // Отправка старых сообщений
    socket.emit('oldMessages', messages);

    // Новое сообщение
    socket.on('message', (data) => {
        const message = {
            text: data.text,
            name: `Ученик 8Б`,
            timestamp: new Date(),
            isSent: false
        };
        messages.push(message);
        if (messages.length > 100) messages.shift(); // Ограничиваем 100 сообщений
        io.emit('message', message);
    });

    // Отключение
    socket.on('disconnect', () => {
        onlineCount--;
        io.emit('online', onlineCount);
    });
});

server.listen(3000, () => {
    console.log('🚀 Чат 8Б запущен на http://localhost:3000');
});