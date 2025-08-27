import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY!);

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  // Email sending temporarily disabled - forms still save to Airtable
  console.log(`[EMAIL DISABLED] Would send email to: ${params.to} | Subject: ${params.subject}`);
  return true; // Return true so forms continue to work normally
}

// Email templates
export function getEarlyAccessConfirmationEmail(firstName: string, email: string) {
  return {
    to: email,
    from: 'noreply@alchemynetwork.com', // You'll need to verify this domain in SendGrid
    subject: 'Welcome to Alchemy Network - Early Access Confirmed!',
    text: `Hi ${firstName},

Thank you for joining Alchemy Network's exclusive early access program!

We're excited to have you as part of our premium EV charging community. You'll be among the first to experience our luxury charging stations and cutting-edge technology.

What's next:
• We'll notify you as soon as early access spots become available
• You'll receive exclusive updates about new premium locations
• Priority access to our network of luxury charging stations

Questions? Reply to this email and our team will get back to you.

Welcome aboard!
The Alchemy Network Team`,
    html: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #DAA520, #B8860B); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; background: #f9f9f9; }
        .footer { padding: 20px; text-align: center; background: #333; color: white; }
        .cta-button { background: #DAA520; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to Alchemy Network!</h1>
            <p>Premium EV Charging Network</p>
        </div>
        <div class="content">
            <h2>Hi ${firstName},</h2>
            <p>Thank you for joining Alchemy Network's exclusive early access program!</p>
            <p>We're excited to have you as part of our premium EV charging community. You'll be among the first to experience our luxury charging stations and cutting-edge technology.</p>
            
            <h3>What's next:</h3>
            <ul>
                <li>We'll notify you as soon as early access spots become available</li>
                <li>You'll receive exclusive updates about new premium locations</li>
                <li>Priority access to our network of luxury charging stations</li>
            </ul>
            
            <p>Questions? Reply to this email and our team will get back to you.</p>
            <p><strong>Welcome aboard!</strong><br>The Alchemy Network Team</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Alchemy Network. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`
  };
}

export function getHostApplicationConfirmationEmail(contactFirstName: string, businessName: string, email: string) {
  return {
    to: email,
    from: 'noreply@alchemynetwork.com',
    subject: 'Alchemy Network Host Application Received',
    text: `Hi ${contactFirstName},

Thank you for your interest in becoming an Alchemy Network host partner!

We've received your application for ${businessName} and our partnership team will review it within 2-3 business days.

Our team will contact you soon to discuss:
• Partnership opportunities and revenue sharing
• Installation timeline and requirements
• Technical specifications for your location

We're excited about the possibility of partnering with you to expand our premium charging network.

Best regards,
The Alchemy Network Partnership Team`,
    html: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #DAA520, #B8860B); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; background: #f9f9f9; }
        .footer { padding: 20px; text-align: center; background: #333; color: white; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Host Application Received</h1>
            <p>Alchemy Network Partnership Team</p>
        </div>
        <div class="content">
            <h2>Hi ${contactFirstName},</h2>
            <p>Thank you for your interest in becoming an Alchemy Network host partner!</p>
            <p>We've received your application for <strong>${businessName}</strong> and our partnership team will review it within 2-3 business days.</p>
            
            <h3>Our team will contact you soon to discuss:</h3>
            <ul>
                <li>Partnership opportunities and revenue sharing</li>
                <li>Installation timeline and requirements</li>
                <li>Technical specifications for your location</li>
            </ul>
            
            <p>We're excited about the possibility of partnering with you to expand our premium charging network.</p>
            <p><strong>Best regards,</strong><br>The Alchemy Network Partnership Team</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Alchemy Network. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`
  };
}