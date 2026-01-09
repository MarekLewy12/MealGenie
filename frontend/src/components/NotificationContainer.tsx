import type { ElementType } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
} from "lucide-react";
import {
  useNotificationStore,
  type Notification,
  type NotificationType,
} from "../store/notificationStore";

const icons: Record<NotificationType, ElementType> = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles: Record<
  NotificationType,
  {
    bg: string;
    border: string;
    icon: string;
    title: string;
    progressBar: string;
  }
> = {
  success: {
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    border: "border-emerald-200 dark:border-emerald-500/30",
    icon: "text-emerald-600 dark:text-emerald-400",
    title: "text-emerald-800 dark:text-emerald-200",
    progressBar: "bg-emerald-500",
  },
  error: {
    bg: "bg-red-50 dark:bg-red-500/10",
    border: "border-red-200 dark:border-red-500/30",
    icon: "text-red-600 dark:text-red-400",
    title: "text-red-800 dark:text-red-200",
    progressBar: "bg-red-500",
  },
  warning: {
    bg: "bg-amber-50 dark:bg-amber-500/10",
    border: "border-amber-200 dark:border-amber-500/30",
    icon: "text-amber-600 dark:text-amber-400",
    title: "text-amber-800 dark:text-amber-200",
    progressBar: "bg-amber-500",
  },
  info: {
    bg: "bg-blue-50 dark:bg-blue-500/10",
    border: "border-blue-200 dark:border-blue-500/30",
    icon: "text-blue-600 dark:text-blue-400",
    title: "text-blue-800 dark:text-blue-200",
    progressBar: "bg-blue-500",
  },
};

function NotificationItem({ notification }: { notification: Notification }) {
  const removeNotification = useNotificationStore((s) => s.removeNotification);
  const Icon = icons[notification.type];
  const style = styles[notification.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`relative flex w-full max-w-sm items-start gap-3 overflow-hidden rounded-xl border p-4 shadow-lg backdrop-blur-sm ${style.bg} ${style.border}`}
    >
      <div className={`mt-0.5 flex-shrink-0 ${style.icon}`}>
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        {notification.title && (
          <p className={`text-sm font-semibold ${style.title}`}>
            {notification.title}
          </p>
        )}
        <p className="text-sm text-slate-700 dark:text-slate-300">
          {notification.message}
        </p>
      </div>

      {notification.dismissible && (
        <button
          onClick={() => removeNotification(notification.id)}
          className="flex-shrink-0 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-200/50 hover:text-slate-600 dark:hover:bg-slate-700/50 dark:hover:text-slate-200"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {notification.duration > 0 && (
        <motion.div
          className={`absolute bottom-0 left-0 h-1 ${style.progressBar}`}
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{
            duration: notification.duration / 1000,
            ease: "linear",
          }}
        />
      )}
    </motion.div>
  );
}

export function NotificationContainer() {
  const notifications = useNotificationStore((s) => s.notifications);

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] flex flex-col items-end gap-3 p-4 sm:p-6">
      <div className="pointer-events-auto flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
