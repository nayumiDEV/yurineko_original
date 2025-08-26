const {
  PUBLIC_PUSH_KEY,
  PRIVATE_PUSH_KEY,
  GCM_KEY,
} = require("../configs/env");

const webpush = require("web-push");
// VAPID keys should only be generated only once.

const vapidKeys = {
  publicKey: PUBLIC_PUSH_KEY,
  privateKey: PRIVATE_PUSH_KEY,
};

// webpush.setGCMAPIKey(GCM_KEY);
webpush.setVapidDetails(
  "mailto:yurineko20tr@gmail.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

module.exports = webpush;
// webpush.sendNotification(pushSubscription, "Your Push Payload Text");
