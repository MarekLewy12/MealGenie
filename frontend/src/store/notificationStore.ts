import { create } from "zustand";

export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration: number;
  dismissible: boolean;
}

export type AddNotificationOptions = {
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number;
  dismissible?: boolean;
};

interface NotificationState {
  notifications: Notification[];
  addNotification: (opts: AddNotificationOptions) => string;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const generateId = () =>
  `notif-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],

  addNotification: (opts) => {
    const id = generateId();
    const notification: Notification = {
      id,
      type: opts.type,
      title: opts.title,
      message: opts.message,
      duration: opts.duration ?? 3500,
      dismissible: opts.dismissible ?? true,
    };

    set((state) => ({
      notifications: [...state.notifications, notification],
    }));

    if (notification.duration > 0) {
      setTimeout(() => {
        get().removeNotification(id);
      }, notification.duration);
    }

    return id;
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  clearAll: () => {
    set({ notifications: [] });
  },
}));

export const notify = {
  success: (message: string, title?: string) =>
    useNotificationStore.getState().addNotification({
      type: "success",
      message,
      title,
    }),
  error: (message: string, title?: string) =>
    useNotificationStore.getState().addNotification({
      type: "error",
      message,
      title,
    }),
  warning: (message: string, title?: string) =>
    useNotificationStore.getState().addNotification({
      type: "warning",
      message,
      title,
    }),
  info: (message: string, title?: string) =>
    useNotificationStore.getState().addNotification({
      type: "info",
      message,
      title,
    }),
};
