const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ========== ABANDONED CART EMAIL ==========
const sendAbandonedCartEmail = async ({ email, name, amount, recoveryLink, cartId }) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: ' Your cart is waiting! Complete your purchase',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                    <h2 style="color: #1a1a1a;">Hello ${name} 👋</h2>
                    <p style="color: #555; font-size: 16px;">
                        We noticed you left items worth <strong>₹${amount}</strong> in your cart!
                    </p>
                    <p style="color: #555; font-size: 16px;">
                        Don't miss out! Complete your purchase now:
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${recoveryLink}" 
                           style="background-color: #6c63ff; color: white; padding: 14px 40px; 
                                  text-decoration: none; border-radius: 6px; font-size: 16px; 
                                  display: inline-block;">
                             Complete Your Order
                        </a>
                    </div>
                    <p style="color: #888; font-size: 14px;">
                        This link will expire in 7 days. Your cart items are waiting!
                    </p>
                    <hr style="border: 1px solid #eee; margin: 20px 0;" />
                    <p style="color: #aaa; font-size: 12px; text-align: center;">
                        This is an automated message from PayRecover AI.
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(` Abandoned cart email sent to ${email}`);
        return { success: true };

    } catch (error) {
        console.error('Abandoned cart email error:', error);
        return { success: false, error: error.message };
    }
};

// ========== PAYMENT RECOVERY EMAIL ==========
const sendRecoveryEmail = async ({ email, name, amount, recoveryLink, orderId, type }) => {
    // If it's an abandoned cart, use the specialized email
    if (type === 'abandoned_cart') {
        return sendAbandonedCartEmail({ email, name, amount, recoveryLink, cartId: orderId });
    }
    
    // Payment recovery email
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Payment Recovery - Complete Your Payment',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                    <h2 style="color: #1a1a1a;">Hello ${name} 👋</h2>
                    <p style="color: #555; font-size: 16px;">
                        We noticed your payment of <strong>₹${amount}</strong> failed for order <strong>#${orderId}</strong>.
                    </p>
                    <p style="color: #555; font-size: 16px;">
                        Don't worry! You can complete your payment using the link below:
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${recoveryLink}" 
                           style="background-color: #6c63ff; color: white; padding: 14px 40px; 
                                  text-decoration: none; border-radius: 6px; font-size: 16px; 
                                  display: inline-block;">
                             Complete Payment Now
                        </a>
                    </div>
                    <p style="color: #888; font-size: 14px;">
                        This link will expire in 7 days. If you have any questions, feel free to contact us.
                    </p>
                    <hr style="border: 1px solid #eee; margin: 20px 0;" />
                    <p style="color: #aaa; font-size: 12px; text-align: center;">
                        This is an automated message from PayRecover AI.
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(` Recovery email sent to ${email}`);
        return { success: true };

    } catch (error) {
        console.error('Email error:', error);
        return { success: false, error: error.message };
    }
};

module.exports = { sendRecoveryEmail, sendAbandonedCartEmail };