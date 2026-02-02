import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'CELPIP Coach <onboarding@resend.dev>';
const SITE_URL = process.env.NEXTAUTH_URL || 'https://celpip.app';

export async function sendVerificationEmail(email: string, token: string, name?: string) {
  const verifyUrl = `${SITE_URL}/auth/verify?token=${token}`;
  
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Verifique sua conta - CELPIP Writing Coach',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 40px 20px;">
        <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">✉️ CELPIP Writing Coach</h1>
          </div>
          
          <!-- Content -->
          <div style="padding: 32px;">
            <h2 style="color: #1e293b; margin: 0 0 16px; font-size: 20px;">
              Olá${name ? `, ${name}` : ''}! 👋
            </h2>
            <p style="color: #475569; line-height: 1.6; margin: 0 0 24px;">
              Obrigado por se cadastrar no CELPIP Writing Coach! Clique no botão abaixo para verificar seu email e ativar sua conta:
            </p>
            
            <a href="${verifyUrl}" style="display: block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; text-align: center; margin-bottom: 24px;">
              Verificar minha conta
            </a>
            
            <p style="color: #94a3b8; font-size: 14px; margin: 0 0 16px;">
              Este link expira em 24 horas.
            </p>
            
            <p style="color: #94a3b8; font-size: 14px; margin: 0;">
              Se você não criou esta conta, pode ignorar este email.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
              © 2024 CELPIP Writing Coach. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  });

  if (error) {
    console.error('Failed to send verification email:', error);
    throw new Error('Failed to send verification email');
  }

  return data;
}

export async function sendPasswordResetEmail(email: string, token: string, name?: string) {
  const resetUrl = `${SITE_URL}/auth/reset-password?token=${token}`;
  
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Recuperação de senha - CELPIP Writing Coach',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 40px 20px;">
        <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">🔐 Recuperação de Senha</h1>
          </div>
          
          <!-- Content -->
          <div style="padding: 32px;">
            <h2 style="color: #1e293b; margin: 0 0 16px; font-size: 20px;">
              Olá${name ? `, ${name}` : ''}!
            </h2>
            <p style="color: #475569; line-height: 1.6; margin: 0 0 24px;">
              Recebemos uma solicitação para redefinir a senha da sua conta. Clique no botão abaixo para criar uma nova senha:
            </p>
            
            <a href="${resetUrl}" style="display: block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; text-align: center; margin-bottom: 24px;">
              Redefinir minha senha
            </a>
            
            <p style="color: #94a3b8; font-size: 14px; margin: 0 0 16px;">
              Este link expira em 1 hora.
            </p>
            
            <p style="color: #94a3b8; font-size: 14px; margin: 0;">
              Se você não solicitou esta recuperação, pode ignorar este email. Sua senha permanecerá a mesma.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
              © 2024 CELPIP Writing Coach. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  });

  if (error) {
    console.error('Failed to send password reset email:', error);
    throw new Error('Failed to send password reset email');
  }

  return data;
}
