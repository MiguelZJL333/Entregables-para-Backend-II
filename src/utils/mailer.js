import nodemailer from 'nodemailer';

/**
 * Configuración del servicio de email con Nodemailer
 */

const isMailConfigured = process.env.MAIL_USER && process.env.MAIL_PASSWORD;

let transporter;
if (isMailConfigured) {
    transporter = nodemailer.createTransport({
        service: process.env.MAIL_SERVICE || 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        }
    });
} else {
    transporter = nodemailer.createTransport({
        jsonTransport: true
    });
    console.warn('⚠️ Email no configurado (MAIL_USER/MAIL_PASSWORD faltan). Se usa jsonTransport en modo desarrollo (no se envía email real).');
}

/**
 * Envía email de recuperación de contraseña
 */
export const sendPasswordResetEmail = async (email, resetLink, userName) => {
    const mailOptions = {
        from: process.env.MAIL_FROM || process.env.MAIL_USER,
        to: email,
        subject: 'Recuperación de Contraseña - Ecommerce',
        html: `
            <h2>Hola ${userName},</h2>
            <p>Recibimos una solicitud para recuperar tu contraseña.</p>
            <p>Haz clic en el siguiente enlace para establecer una nueva contraseña:</p>
            <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                Recuperar Contraseña
            </a>
            <p>Este enlace expirará en 1 hora.</p>
            <p>Si no solicitaste esta recuperación, ignora este email.</p>
            <hr>
            <p>Saludos,<br>El equipo de Ecommerce</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return { status: 'success', message: 'Email enviado correctamente' };
    } catch (error) {
        console.error('Error al enviar email:', error);
        throw new Error('Error al enviar el email de recuperación');
    }
};

/**
 * Envía email de confirmación de compra
 */
export const sendPurchaseConfirmationEmail = async (email, ticket) => {
    const productsHtml = ticket.products
        .map(p => `<tr>
            <td>${p.title}</td>
            <td>$${p.price.toFixed(2)}</td>
            <td>${p.quantity}</td>
            <td>$${p.subtotal.toFixed(2)}</td>
        </tr>`)
        .join('');

    const mailOptions = {
        from: process.env.MAIL_FROM || process.env.MAIL_USER,
        to: email,
        subject: `Confirmación de Compra - Ticket ${ticket.code}`,
        html: `
            <h2>¡Compra Confirmada!</h2>
            <p>Gracias por tu compra. Aquí está el detalle:</p>
            
            <h3>Número de Ticket: ${ticket.code}</h3>
            <p><strong>Fecha:</strong> ${ticket.purchase_datetime.toLocaleDateString()}</p>
            <p><strong>Total:</strong> $${ticket.amount.toFixed(2)}</p>
            
            <h3>Productos:</h3>
            <table border="1" cellpadding="10">
                <th>Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                ${productsHtml}
            </table>
            
            ${ticket.failedProducts && ticket.failedProducts.length > 0 ? `
                <h3 style="color: orange;">Productos no disponibles:</h3>
                <ul>
                    ${ticket.failedProducts.map(p => `<li>${p.title} - Solicitado: ${p.requestedQuantity}, Disponible: ${p.availableStock}</li>`).join('')}
                </ul>
            ` : ''}
            
            <hr>
            <p>Saludos,<br>El equipo de Ecommerce</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return { status: 'success', message: 'Email de confirmación enviado' };
    } catch (error) {
        console.error('Error al enviar email:', error);
        throw new Error('Error al enviar email de confirmación');
    }
};

/**
 * Verifica la conexión con el servidor de email
 */
export const verifyMailerConnection = async () => {
    if (!isMailConfigured) {
        console.warn('⚠️ Omitiendo la verificación de correo porque no hay credenciales configuradas.');
        return false;
    }

    try {
        await transporter.verify();
        console.log('✓ Conexión a servidor de email verificada');
        return true;
    } catch (error) {
        console.error('✗ Error en conexión de email:', error);
        return false;
    }
};
