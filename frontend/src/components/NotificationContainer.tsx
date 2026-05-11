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
    bg: "bg-basil-soft",
    border: "border-basil/30",
    icon: "text-basil",
    title: "text-basil",
    progressBar: "bg-basil",
  },
  error: {
    bg: "bg-accent-soft",
    border: "border-bordeaux/30",
    icon: "text-bordeaux",
    title: "text-bordeaux",
    progressBar: "bg-bordeaux",
  },
  warning: {
    bg: "bg-saffron-soft",
    border: "border-saffron/40",
    icon: "text-ink",
    title: "text-ink",
    progressBar: "bg-saffron",
  },
  info: {
    bg: "bg-accent-soft",
    border: "border-accent/30",
    icon: "text-accent",
    title: "text-accent-deep",
    progressBar: "bg-accent",
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
      className={`relative flex w-full max-w-sm items-start gap-3 overflow-hidden rounded-lg border p-4 text-ink shadow-md backdrop-blur-sm ${style.bg} ${style.border}`}
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
        <p className="text-sm text-ink-soft">
          {notification.message}
        </p>
      </div>

      {notification.dismissible && (
        <button
          type="button"
          onClick={() => removeNotification(notification.id)}
          className="flex-shrink-0 rounded-md p-1 text-ink-muted transition-colors hover:bg-bg-sunken hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-label="Zamknij powiadomienie"
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
