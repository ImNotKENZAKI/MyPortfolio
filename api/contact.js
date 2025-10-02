const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).json({ ok: false, error: 'Method not allowed' });
        return;
    }

    try {
        const {
            from_name = '',
            from_email = '',
            mobile = '',
            subject = 'New Portfolio Inquiry',
            message = ''
        } = req.body || {};

        if (!from_name || !from_email || !message) {
            res.status(400).json({ ok: false, error: 'Missing required fields' });
            return;
        }

        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS;
        const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
        const smtpPort = Number(process.env.SMTP_PORT || 465);
        const emailTo = process.env.EMAIL_TO || 'jjmanalo.va@gmail.com';
        const emailFrom = process.env.EMAIL_FROM || smtpUser || 'no-reply@vercel.app';

        if (!smtpUser || !smtpPass) {
            res.status(500).json({ ok: false, error: 'Email server not configured' });
            return;
        }

        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465, // true for 465, false for 587
            auth: { user: smtpUser, pass: smtpPass },
        });

        const html = `
            <h2>New message from your portfolio</h2>
            <p><strong>Name:</strong> ${from_name}</p>
            <p><strong>Email:</strong> ${from_email}</p>
            <p><strong>Mobile:</strong> ${mobile || '—'}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${(message || '').replace(/\n/g, '<br>')}</p>
        `;

        await transporter.sendMail({
            from: emailFrom,
            to: emailTo,
            replyTo: from_email,
            subject: `[Portfolio] ${subject}`,
            html,
        });

        res.status(200).json({ ok: true });
    } catch (err) {
        console.error('Email send failed:', err);
        res.status(500).json({ ok: false, error: 'Failed to send email' });
    }
};


