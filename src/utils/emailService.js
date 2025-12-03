// Email service for sending booking confirmations and reminders
// In a real application, this would communicate with an email API (e.g., SendGrid, Mailgun)

/**
 * Send booking confirmation email
 * @param {Object} booking - The booking object
 * @returns {Promise<Object>} Success status and message
 */
export async function sendBookingConfirmation(booking) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const emailContent = generateConfirmationEmail(booking)
  
  // In a real app, this would make an API call to send email
  console.log('📧 E-postbekräftelse skickad:', {
    to: booking.email,
    subject: emailContent.subject,
    body: emailContent.body
  })
  
  // Store email log (in real app, this would be in a database)
  const emailLog = {
    id: Date.now(),
    type: 'confirmation',
    bookingId: booking.id,
    recipient: booking.email,
    sentAt: new Date().toISOString(),
    content: emailContent
  }
  
  saveEmailLog(emailLog)
  
  return {
    success: true,
    message: 'Bekräftelse har skickats till ' + booking.email
  }
}

/**
 * Send reminder email 24 hours before service
 * @param {Object} booking - The booking object
 * @returns {Promise<Object>} Success status and message
 */
export async function sendReminderEmail(booking) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const emailContent = generateReminderEmail(booking)
  
  // In a real app, this would make an API call to send email
  console.log('📧 Påminnelse skickad:', {
    to: booking.email,
    subject: emailContent.subject,
    body: emailContent.body
  })
  
  // Store email log
  const emailLog = {
    id: Date.now(),
    type: 'reminder',
    bookingId: booking.id,
    recipient: booking.email,
    sentAt: new Date().toISOString(),
    content: emailContent
  }
  
  saveEmailLog(emailLog)
  
  return {
    success: true,
    message: 'Påminnelse har skickats till ' + booking.email
  }
}

/**
 * Check if reminders should be sent and send them
 * @param {Array} bookings - Array of all bookings
 * @returns {Promise<Array>} Array of sent reminders
 */
export async function checkAndSendReminders(bookings) {
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)
  
  const tomorrowEnd = new Date(tomorrow)
  tomorrowEnd.setHours(23, 59, 59, 999)
  
  const bookingsNeedingReminder = bookings.filter(booking => {
    // Only send reminders for pending bookings
    if (booking.status !== 'pending') return false
    
    // Check if reminder was already sent
    const emailLogs = getEmailLogs()
    const reminderSent = emailLogs.some(
      log => log.bookingId === booking.id && log.type === 'reminder'
    )
    if (reminderSent) return false
    
    // Check if booking is approximately 24 hours away
    const bookingDate = new Date(booking.date + ' ' + booking.time)
    return bookingDate >= tomorrow && bookingDate <= tomorrowEnd
  })
  
  const sentReminders = []
  for (const booking of bookingsNeedingReminder) {
    try {
      const result = await sendReminderEmail(booking)
      if (result.success) {
        sentReminders.push(booking)
      }
    } catch (error) {
      console.error('Error sending reminder for booking', booking.id, error)
    }
  }
  
  return sentReminders
}

/**
 * Generate confirmation email content
 * @param {Object} booking - The booking object
 * @returns {Object} Email subject and body
 */
function generateConfirmationEmail(booking) {
  const formattedDate = formatDate(booking.date)
  const subject = `Bokningsbekräftelse - ${booking.serviceType}`
  
  const body = `
Hej ${booking.customerName},

Tack för din bokning hos Bil- och Däckfirma!

Bokningsinformation:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Bokningsnummer: #${booking.id}
Datum: ${formattedDate}
Tid: ${booking.time}
Service: ${booking.serviceType}
Registreringsnummer: ${booking.registrationNumber}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Vi ser fram emot att ta hand om ditt fordon!

Kontaktinformation:
Telefon: 08-123 45 67
E-post: info@bildackfirma.se
Adress: Servicegatan 123, 123 45 Stockholm

Med vänliga hälsningar,
Bil- och Däckfirma
  `.trim()
  
  return { subject, body }
}

/**
 * Generate reminder email content
 * @param {Object} booking - The booking object
 * @returns {Object} Email subject and body
 */
function generateReminderEmail(booking) {
  const formattedDate = formatDate(booking.date)
  const subject = `Påminnelse: Din service imorgon kl ${booking.time}`
  
  const body = `
Hej ${booking.customerName},

Detta är en påminnelse om din bokade service imorgon.

Bokningsinformation:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Bokningsnummer: #${booking.id}
Datum: ${formattedDate}
Tid: ${booking.time}
Service: ${booking.serviceType}
Registreringsnummer: ${booking.registrationNumber}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Om du behöver ändra eller avboka din bokning, vänligen kontakta oss så snart som möjligt.

Kontaktinformation:
Telefon: 08-123 45 67
E-post: info@bildackfirma.se
Adress: Servicegatan 123, 123 45 Stockholm

Vi ser fram emot att se dig imorgon!

Med vänliga hälsningar,
Bil- och Däckfirma
  `.trim()
  
  return { subject, body }
}

/**
 * Format date to Swedish format
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {string} Formatted date string
 */
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
}

/**
 * Save email log to localStorage
 * @param {Object} emailLog - Email log object
 */
function saveEmailLog(emailLog) {
  try {
    const logs = getEmailLogs()
    logs.push(emailLog)
    localStorage.setItem('emailLogs', JSON.stringify(logs))
  } catch (error) {
    console.error('Error saving email log:', error)
  }
}

/**
 * Get email logs from localStorage
 * @returns {Array} Array of email logs
 */
export function getEmailLogs() {
  try {
    const logs = localStorage.getItem('emailLogs')
    return logs ? JSON.parse(logs) : []
  } catch (error) {
    console.error('Error getting email logs:', error)
    return []
  }
}

/**
 * Get user preference for email reminders
 * @param {string} email - User email
 * @returns {boolean} Whether reminders are enabled
 */
export function getReminderPreference(email) {
  try {
    const preferences = JSON.parse(localStorage.getItem('emailPreferences') || '{}')
    return preferences[email]?.remindersEnabled !== false // Default to true
  } catch (error) {
    console.error('Error getting reminder preference:', error)
    return true // Default to enabled
  }
}

/**
 * Set user preference for email reminders
 * @param {string} email - User email
 * @param {boolean} enabled - Whether reminders should be enabled
 */
export function setReminderPreference(email, enabled) {
  try {
    const preferences = JSON.parse(localStorage.getItem('emailPreferences') || '{}')
    preferences[email] = {
      ...preferences[email],
      remindersEnabled: enabled
    }
    localStorage.setItem('emailPreferences', JSON.stringify(preferences))
  } catch (error) {
    console.error('Error setting reminder preference:', error)
  }
}


