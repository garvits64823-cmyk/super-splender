const nodemailer = require('nodemailer');
const twilio = require('twilio');

// SMS service using Twilio
class SMSService {
  static getClient() {
    return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }

  static async sendSMS(phone, message) {
    try {
      console.log(`📱 Attempting SMS to ${phone}: ${message}`);
      
      // Real SMS sending enabled
      if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
        console.log('✅ Twilio credentials found, sending SMS...');
        const client = this.getClient();
        const result = await client.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phone
        });
        console.log('✅ SMS sent successfully:', result.sid);
        return { success: true, messageId: result.sid };
      } else {
        console.log('❌ Twilio credentials missing - using mock mode');
      }
      
      return { success: true, messageId: 'mock_sms_' + Date.now() };
    } catch (error) {
      console.error('❌ SMS send error:', error.message);
      console.error('Full SMS error:', error);
      return { success: false, error: error.message };
    }
  }
}

// Email service using Gmail
class EmailService {
  static createTransporter() {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  static async sendEmail(to, subject, text, html) {
    try {
      console.log(`📧 Attempting to send email to ${to}: ${subject}`);
      console.log(`EMAIL_USER: ${process.env.EMAIL_USER}`);
      console.log(`EMAIL_PASS length: ${process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 'undefined'}`);
      
      // Real email sending enabled
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        console.log('✅ Email credentials found, creating transporter...');
        const transporter = this.createTransporter();
        console.log('✅ Transporter created, sending email...');
        
        const result = await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to,
          subject,
          text,
          html
        });
        console.log('✅ Email sent successfully:', result.messageId);
        return { success: true, messageId: result.messageId };
      } else {
        console.log('❌ Email credentials missing - using mock mode');
      }
      
      console.log('Message:', text);
      return { success: true, messageId: 'mock_email_' + Date.now() };
    } catch (error) {
      console.error('❌ Email send error:', error.message);
      console.error('Full error:', error);
      return { success: false, error: error.message };
    }
  }
}

// Notification templates
class NotificationTemplates {
  static getOTPTemplate(otp, type) {
    if (type === 'email') {
      return {
        subject: 'Your Login OTP - Secure Access',
        text: `Your OTP for login is: ${otp}. Valid for 5 minutes. Do not share this code.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">🔐 Login Verification</h1>
            </div>
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; color: #333;">Your secure login OTP is:</p>
              <div style="background: white; border: 2px solid #667eea; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; margin: 20px 0; border-radius: 8px; color: #667eea; letter-spacing: 5px;">
                ${otp}
              </div>
              <p style="color: #666; font-size: 14px;">⏰ This OTP expires in 5 minutes</p>
              <p style="color: #666; font-size: 14px;">🔒 Keep this code secure and don't share it with anyone</p>
              <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
              <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
            </div>
          </div>
        `
      };
    } else {
      return {
        message: `🔐 Your secure login OTP: ${otp}\n⏰ Expires in 5 minutes\n🔒 Keep it confidential`
      };
    }
  }

  static getPasswordResetTemplate(otp, type) {
    if (type === 'email') {
      return {
        subject: 'Password Reset OTP - Security Alert',
        text: `Your password reset OTP is: ${otp}. Valid for 5 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">🔑 Password Reset</h1>
            </div>
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; color: #333;">Your password reset OTP is:</p>
              <div style="background: white; border: 2px solid #ff6b6b; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; margin: 20px 0; border-radius: 8px; color: #ff6b6b; letter-spacing: 5px;">
                ${otp}
              </div>
              <p style="color: #666; font-size: 14px;">⏰ This OTP expires in 5 minutes</p>
              <p style="color: #666; font-size: 14px;">🔒 Use this to reset your password securely</p>
              <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
              <p style="color: #999; font-size: 12px;">If you didn't request this, please contact support immediately.</p>
            </div>
          </div>
        `
      };
    } else {
      return {
        message: `🔑 Password reset OTP: ${otp}\n⏰ Expires in 5 minutes\n🚨 Contact support if you didn't request this`
      };
    }
  }

  static getWelcomeTemplate(name, type) {
    if (type === 'email') {
      return {
        subject: '🎉 Welcome to Our App!',
        text: `Hi ${name}, welcome to our app! Your account has been created successfully.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">🎉 Welcome ${name}!</h1>
            </div>
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; color: #333;">Your account has been created successfully! 🚀</p>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4ecdc4;">
                <p style="margin: 0; color: #333;">✅ Email verified</p>
                <p style="margin: 5px 0 0 0; color: #333;">✅ Phone verified</p>
              </div>
              <p style="color: #666;">You can now login and start using all our features!</p>
              <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
              <p style="color: #999; font-size: 12px;">Thank you for joining us! 🙏</p>
            </div>
          </div>
        `
      };
    } else {
      return {
        message: `🎉 Welcome ${name}! Your account is ready. Start exploring our app now! 🚀`
      };
    }
  }
}

// Main notification service
class NotificationService {
  static async sendOTP(identifier, otp, type) {
    const template = NotificationTemplates.getOTPTemplate(otp, type);
    
    if (type === 'email') {
      return await EmailService.sendEmail(
        identifier,
        template.subject,
        template.text,
        template.html
      );
    } else {
      return await SMSService.sendSMS(identifier, template.message);
    }
  }

  static async sendPasswordResetOTP(identifier, otp, type) {
    const template = NotificationTemplates.getPasswordResetTemplate(otp, type);
    
    if (type === 'email') {
      return await EmailService.sendEmail(
        identifier,
        template.subject,
        template.text,
        template.html
      );
    } else {
      return await SMSService.sendSMS(identifier, template.message);
    }
  }

  static async sendWelcomeMessage(identifier, name, type) {
    const template = NotificationTemplates.getWelcomeTemplate(name, type);
    
    if (type === 'email') {
      return await EmailService.sendEmail(
        identifier,
        template.subject,
        template.text,
        template.html
      );
    } else {
      return await SMSService.sendSMS(identifier, template.message);
    }
  }
}

module.exports = {
  NotificationService,
  EmailService,
  SMSService
};