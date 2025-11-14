import { Infer, v } from "convex/values";

export const NOTIFICATION_TYPES = ["replies", "posts"] as const;

export const vNotificationType = v.union(
  ...NOTIFICATION_TYPES.map((type) => v.literal(type)),
);

export type NotificationType = Infer<typeof vNotificationType>;

export type NotificationSettings = Record<NotificationType, boolean>;

const notificationValidators = Object.fromEntries(
  NOTIFICATION_TYPES.map((type) => [type, v.boolean()] as const),
) as Record<NotificationType, ReturnType<typeof v.boolean>>;

export const vNotificationSettings = v.object(notificationValidators);

export const defaultNotificationSettings = Object.fromEntries(
  NOTIFICATION_TYPES.map((type) => [type, true] as const),
) as NotificationSettings;

export const notificationState = (
  overrides?: Partial<NotificationSettings>,
): NotificationSettings =>
  Object.fromEntries(
    NOTIFICATION_TYPES.map((type) => [
      type,
      overrides?.[type] ?? defaultNotificationSettings[type],
    ]),
  ) as NotificationSettings;
