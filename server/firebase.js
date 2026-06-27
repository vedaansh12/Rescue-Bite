// server/firebase.js
const admin = require('firebase-admin');

// Initialise with the service account (set via GOOGLE_APPLICATION_CREDENTIALS env var)
admin.initializeApp();

/**
 * Send a push notification to a list of FCM tokens.
 * @param {string[]} tokens - Array of registration tokens.
 * @param {object} payload - Notification payload { title, body }.
 */
async function sendPushNotification(tokens, payload) {
  if (!tokens || tokens.length === 0) return;

  const message = {
    notification: {
      title: payload.title,
      body: payload.body,
    },
    tokens: tokens, // Send to multiple tokens at once
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log('Successfully sent messages:', response.successCount);
    if (response.failureCount > 0) {
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          console.error(`Token ${tokens[idx]} failed with:`, resp.error);
        }
      });
    }
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
}

module.exports = { sendPushNotification };