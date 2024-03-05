// import { createServer } from 'node:http';
// import { Server } from 'socket.io';
// import { setTimeout } from 'timers';

// export const chatWeb = (server) =>{

// const serverChat = createServer(server);
// const io = new Server(serverChat);
// server.get('/chat/mensaje', (req, res) => {
//     res.render('chat-user.ejs');
// });

// const anonymousChats = new Map();

// io.on('connection', (socket) => {
//   let messageHistory = [];
//   io.emit('mensaje', "hola mundo");

//       // En el lado del servidor, deberías manejar el mensajePrivado así:
//     socket.on('mensajePrivado', (data) => {
//     const destinatario = data.destinatario;
//     const mensaje = data.mensaje;

//     // Aquí puedes usar socket.to(destinatario).emit para enviar el mensaje al destinatario específico
//     io.to(destinatario).emit('mensaje',mensaje);
//     });
//   socket.on('user message', (msg) => {
//       messageHistory.push({ sender: socket.id, message: msg });
//       io.to(socket.id).emit('chat message', msg);

//       anonymousChats.set(socket.id, {
//           socketId: socket.id,
//           lastMessage: msg,
//           messageHistory: messageHistory
//       });
//       io.emit('new message', Array.from(anonymousChats.values()));
//   });

//   // Manejar desconexión
//   socket.on('disconnect', () => {
//       anonymousChats.delete(socket.id);
//       io.emit('new message', Array.from(anonymousChats.values()));
//   });
// });
// const primerEnvio = () => {
//     setTimeout(() => {
//         io.emit('new message', Array.from(anonymousChats.values()));
//         console.log("pase por aca")
//     }, 2000);

// }
// // Dentro de tu lógica del servidor
// server.get('/admin/chat/message', async (req, res) => {
//     res.render('chat-admin');
//     //le tuve que poner un timeOut porque se enviaba antes de cargar la pagina y generaba problemas
//     primerEnvio();
// });

// return serverChat

// }
