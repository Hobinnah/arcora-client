export type HostApplicationNotification = {
  applicationId: string;
  applicationCode: string;
  applicantName: string;
  listingName: string;
  createdAt: string;
};

const notificationKey = "arcora:host-application-notifications";

export function publishHostApplicationNotification(notification: HostApplicationNotification) {
  const existing = JSON.parse(localStorage.getItem(notificationKey) || "[]") as HostApplicationNotification[];
  localStorage.setItem(notificationKey, JSON.stringify([notification, ...existing.filter((item) => item.applicationId !== notification.applicationId)]));
  window.dispatchEvent(new StorageEvent("storage", { key: notificationKey, newValue: localStorage.getItem(notificationKey) }));
}

export function getHostApplicationNotification(applicationId: string) {
  const notifications = JSON.parse(localStorage.getItem(notificationKey) || "[]") as HostApplicationNotification[];
  return notifications.find((item) => item.applicationId === applicationId);
}
