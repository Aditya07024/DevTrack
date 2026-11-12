import webpush from "web-push";
import PushSubscription from "./models/PushSubscription";
import Notification from "./models/Notification";

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidSubject = process.env.VAPID_SUBJECT || "mailto:admin@devtrack.local";

if (vapidPublicKey && vapidPrivateKey) {
  try {
    webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
  } catch (err) {
    console.warn("[DevTrack WebPush] Could not initialize VAPID details:", err);
  }
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  url?: string;
  tag?: string;
  data?: Record<string, any>;
}

export async function sendPushNotificationToUser(
  userId: string,
  payload: PushNotificationPayload,
  notificationType: "DAILY_REMINDER" | "TASK_DEADLINE" | "DSA_REVISION" | "WEEKLY_REVIEW" | "MONTHLY_GOAL" | "SYSTEM" = "SYSTEM"
) {
  // 1. Always record in-app notification center
  try {
    await Notification.create({
      userId,
      title: payload.title,
      body: payload.body,
      type: notificationType,
      link: payload.url || "/overview",
      isRead: false,
    });
  } catch (e) {
    console.error("[DevTrack Notification] Failed to save in-app notification:", e);
  }

  // 2. If VAPID is not set, log and return
  if (!vapidPublicKey || !vapidPrivateKey) {
    console.log("[DevTrack Push] VAPID keys not configured. Saved in-app notification only.");
    return { success: true, deliveredPushCount: 0, inAppDelivered: true };
  }

  // 3. Find active subscriptions for user
  const subscriptions = await PushSubscription.find({ userId });
  if (!subscriptions || subscriptions.length === 0) {
    return { success: true, deliveredPushCount: 0, inAppDelivered: true };
  }

  const payloadString = JSON.stringify({
    title: payload.title,
    body: payload.body,
    icon: payload.icon || "/icons/icon-192x192.png",
    badge: payload.badge || "/icons/icon-192x192.png",
    url: payload.url || "/overview",
    tag: payload.tag || "devtrack-notification",
    data: payload.data || {},
  });

  let delivered = 0;
  for (const sub of subscriptions) {
    try {
      const pushConfig = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.keys.p256dh,
          auth: sub.keys.auth,
        },
      };

      await webpush.sendNotification(pushConfig, payloadString);
      delivered++;
      sub.lastSentAt = new Date();
      sub.failCount = 0;
      await sub.save();
    } catch (err: any) {
      console.warn(`[DevTrack Push] Delivery failed to ${sub.endpoint.slice(0, 30)}...:`, err?.statusCode || err?.message);
      // If subscription expired or invalid (404, 410 Gone), delete it
      if (err?.statusCode === 404 || err?.statusCode === 410) {
        await PushSubscription.findByIdAndDelete(sub._id);
        console.log(`[DevTrack Push] Removed invalid/expired subscription: ${sub._id}`);
      } else {
        sub.failCount = (sub.failCount || 0) + 1;
        if (sub.failCount >= 5) {
          await PushSubscription.findByIdAndDelete(sub._id);
        } else {
          await sub.save();
        }
      }
    }
  }

  return { success: true, deliveredPushCount: delivered, inAppDelivered: true };
}
