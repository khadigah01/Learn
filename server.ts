import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config();

const FORWARD_RECIPIENTS = [
  'habul6540@gmail.com',
  'khadigah01@gmail.com',
  'bekabecatchoo@gmail.com',
  'eng.hishamatef@gmail.com',
  'noreply18254@gmail.com',
  'noneedtoknow5000@gmail.com'
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 1. Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      domain: 'LearnAcademy.dpdns.org',
      resendConfigured: Boolean(process.env.RESEND_API_KEY),
      recipients: FORWARD_RECIPIENTS
    });
  });

  // 2. Resend Email Forwarding Endpoint
  app.post('/api/forward-notification', async (req, res) => {
    try {
      const {
        type = 'inquiry',
        subject = 'New Notification from Learn Academy',
        senderName = 'Anonymous / Guest',
        senderEmail = '',
        senderPhone = '',
        content = '',
        details = {}
      } = req.body;

      console.log(`[Email Forwarder] Incoming notification: ${type} - "${subject}" from ${senderName}`);

      const emailSubject = `[Learn Academy] ${subject}`;
      const fromAddress = process.env.RESEND_FROM_EMAIL || 'Learn Academy <onboarding@resend.dev>';

      const detailsHtml = Object.entries(details)
        .map(([k, v]) => `<tr><td style="padding: 6px 12px; font-weight: bold; color: #475569; border-bottom: 1px solid #f1f5f9;">${k}</td><td style="padding: 6px 12px; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${v}</td></tr>`)
        .join('');

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
            .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
            .header { background: linear-gradient(135deg, #584ee4 0%, #4338ca 100%); color: #ffffff; padding: 28px 24px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
            .header p { margin: 6px 0 0 0; color: #e0e7ff; font-size: 14px; }
            .body { padding: 28px 24px; }
            .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; background: #fef3c7; color: #92400e; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 16px; }
            .content-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin: 18px 0; font-size: 15px; line-height: 1.6; white-space: pre-wrap; color: #334155; }
            .table-box { width: 100%; border-collapse: collapse; margin-top: 14px; font-size: 14px; }
            .footer { background: #f1f5f9; padding: 18px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
            .footer a { color: #584ee4; text-decoration: underline; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <h1>Learn Academy</h1>
              <p>Official Domain: LearnAcademy.dpdns.org</p>
            </div>
            <div class="body">
              <div class="badge">${type}</div>
              <h2 style="margin: 0 0 12px 0; font-size: 18px; color: #0f172a;">${subject}</h2>
              <p style="margin: 0 0 6px 0; font-size: 14px; color: #64748b;">
                <strong>Sender:</strong> ${senderName} ${senderEmail ? `(&lt;${senderEmail}&gt;)` : ''}
              </p>
              ${senderPhone ? `<p style="margin: 0 0 12px 0; font-size: 14px; color: #64748b;"><strong>Phone:</strong> ${senderPhone}</p>` : ''}
              
              <div class="content-box">${content}</div>

              ${detailsHtml ? `
                <h3 style="margin: 18px 0 8px 0; font-size: 14px; color: #334155; text-transform: uppercase; letter-spacing: 0.05em;">Submission Metadata</h3>
                <table class="table-box">${detailsHtml}</table>
              ` : ''}
            </div>
            <div class="footer">
              <p>Forwarded automatically to academy administrators:</p>
              <p style="font-family: monospace; font-size: 11px; margin: 4px 0 12px 0;">${FORWARD_RECIPIENTS.join(', ')}</p>
              <p>Powered by <a href="https://LearnAcademy.dpdns.org">LearnAcademy.dpdns.org</a> via Resend</p>
            </div>
          </div>
        </body>
        </html>
      `;

      if (!process.env.RESEND_API_KEY) {
        console.warn('[Resend] RESEND_API_KEY not configured in environment. Logged notification payload to console.');
        return res.status(200).json({
          success: true,
          delivered: false,
          note: 'RESEND_API_KEY not configured in Secrets. Notification logged to server console.',
          recipients: FORWARD_RECIPIENTS
        });
      }

      const resend = new Resend(process.env.RESEND_API_KEY);

      const data = await resend.emails.send({
        from: fromAddress,
        to: FORWARD_RECIPIENTS,
        subject: emailSubject,
        html: htmlContent
      });

      console.log('[Resend] Successfully dispatched email via Resend:', data);

      return res.status(200).json({
        success: true,
        delivered: true,
        data,
        recipients: FORWARD_RECIPIENTS
      });
    } catch (err: any) {
      console.error('[Resend Error]', err);
      return res.status(500).json({
        success: false,
        error: err.message || 'Failed to dispatch email via Resend'
      });
    }
  });

  // 3. Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
    console.log(`Configured forwarding recipients: ${FORWARD_RECIPIENTS.join(', ')}`);
  });
}

startServer();
