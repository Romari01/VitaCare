const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

const sendVerificationEmail = async (email, name, code) => {
  try {
    await transporter.sendMail({
      from: `"VitaCare" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: '🔐 Código de verificación — VitaCare',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <div style="background: #0d9488; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">VitaCare</h1>
            <p style="color: #ccfbf1; margin: 5px 0 0 0; font-size: 14px;">Centro de Salud Jorge Chávez</p>
          </div>
          <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0;">
            <h2 style="color: #1e293b; margin: 0 0 10px 0;">Hola, ${name} 👋</h2>
            <p style="color: #64748b; margin: 0 0 20px 0;">Tu código de verificación para activar tu cuenta es:</p>
            <div style="background: white; border: 2px solid #0d9488; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0;">
              <span style="font-size: 36px; font-weight: bold; color: #0d9488; letter-spacing: 8px;">${code}</span>
            </div>
            <p style="color: #94a3b8; font-size: 13px; margin: 0;">
              Este código expira en <strong>10 minutos</strong>.<br/>
              Si no solicitaste esto, ignora este correo.
            </p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
              © 2026 VitaCare — Centro de Salud Jorge Chávez, Juliaca, Perú
            </p>
          </div>
        </div>
      `
    })
    return true
  } catch (error) {
    console.error('Error enviando email verificacion:', error)
    return false
  }
}

const sendWelcomeEmail = async (email, name) => {
  try {
    await transporter.sendMail({
      from: `"VitaCare" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: '✅ Bienvenido a VitaCare',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <div style="background: #0d9488; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">VitaCare</h1>
            <p style="color: #ccfbf1; margin: 5px 0 0 0; font-size: 14px;">Centro de Salud Jorge Chávez</p>
          </div>
          <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0;">
            <h2 style="color: #1e293b; margin: 0 0 10px 0;">¡Bienvenido, ${name}! 🎉</h2>
            <p style="color: #64748b; margin: 0 0 20px 0;">
              Tu cuenta ha sido verificada exitosamente. Ya puedes acceder a VitaCare y gestionar tus citas médicas.
            </p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="https://vita-care-amber.vercel.app/login"
                style="background: #0d9488; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                Iniciar sesión →
              </a>
            </div>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
              © 2026 VitaCare — Centro de Salud Jorge Chávez, Juliaca, Perú
            </p>
          </div>
        </div>
      `
    })
    return true
  } catch (error) {
    console.error('Error enviando email bienvenida:', error)
    return false
  }
}

const sendPasswordResetEmail = async (email, name, code) => {
  try {
    await transporter.sendMail({
      from: `"VitaCare" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: '🔑 Recuperar contraseña — VitaCare',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <div style="background: #0d9488; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">VitaCare</h1>
            <p style="color: #ccfbf1; margin: 5px 0 0 0; font-size: 14px;">Centro de Salud Jorge Chávez</p>
          </div>
          <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0;">
            <h2 style="color: #1e293b; margin: 0 0 10px 0;">Hola, ${name} 👋</h2>
            <p style="color: #64748b; margin: 0 0 20px 0;">
              Recibimos una solicitud para restablecer tu contraseña. Tu código es:
            </p>
            <div style="background: white; border: 2px solid #f59e0b; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0;">
              <span style="font-size: 36px; font-weight: bold; color: #f59e0b; letter-spacing: 8px;">${code}</span>
            </div>
            <p style="color: #94a3b8; font-size: 13px; margin: 0;">
              Este código expira en <strong>10 minutos</strong>.<br/>
              Si no solicitaste esto, ignora este correo.
            </p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
              © 2026 VitaCare — Centro de Salud Jorge Chávez, Juliaca, Perú
            </p>
          </div>
        </div>
      `
    })
    return true
  } catch (error) {
    console.error('Error enviando email reset:', error)
    return false
  }
}

module.exports = { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail }