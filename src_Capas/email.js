import nodemailer from 'nodemailer'
import { logDebug } from './Errores/Winston.js'

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: 'felipegall1.fg@gmail.com',
        pass: 'utvb evai bvlh nlxc',
    },
})
export const sendGmail = (destino, subject, email) => {
    let result = transport.sendMail({
        from: 'Coder Test <a><felipeGall1.fg@gmail.com></a>',
        to: destino,
        subject: subject,
        html: email,

        attachments: [],
    })
    logDebug(result)
}

//   html: `
//   <div style="max-width: 960px; margin: 0 auto;">
//       <div style="border: 1px solid #dee2e6; background-color: #fff; padding: 1.5rem; margin-top: 1rem;">
//           <h1 style="text-align: center; margin-bottom: 4rem;">Detalles del Ticket</h1>

//           <p style="margin-bottom: 2rem;">Número de Ticket: ${ticket.code}</p>
//           <p style="margin-bottom: 2rem;">Monto Total: $ ${ticket.amount}</p>
//           <p style="margin-bottom: 4rem;">Mail de Facturación: ${ticket.purchaser}</p>

//           <div style="text-align: center;">
//               <a href="/api/carts/ticket/${ticket.code}" style="display: inline-block; padding: 0.5rem 1rem; border: 1px solid #007bff; background-color: #007bff; color: #fff; text-decoration: none; font-size: 1rem; cursor: pointer;">Ver Compra</a>
//           </div>
//       </div>
//   </div>
// `,
