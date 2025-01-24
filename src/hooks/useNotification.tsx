import { useState, useCallback } from "react";
import { Notification } from "@/components/ui/Notification";
import { createPortal } from "react-dom";

type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationData {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
}

const playNotificationSound = () => {
  const audio = new Audio("/sounds/notification.mp3");
  audio.volume = 0.6;
  audio.play().catch(console.debug);
};

export const useNotification = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const showNotification = useCallback(
    (type: NotificationType, title: string, description: string) => {
      const id = Math.random().toString(36).substr(2, 9);
      setNotifications((prev) => [...prev, { id, type, title, description }]);
      playNotificationSound();
    },
    [],
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  }, []);

  const NotificationComponent = useCallback(() => {
    if (notifications.length === 0) return null;
    return createPortal(
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 flex justify-end mt-4 px-4">
        <div className="flex flex-col space-y-4 w-full max-w-sm">
          {notifications.map((notification) => (
            <Notification
              key={notification.id}
              id={notification.id}
              type={notification.type}
              title={notification.title}
              description={notification.description}
              onRemove={removeNotification}
            />
          ))}
        </div>
      </div>,
      document.getElementById("toaster-root") || document.body,
    );
  }, [notifications, removeNotification]);

  // Convenience methods for different notification types
  const success = useCallback(
    (title: string, description: string) => {
      showNotification("success", title, description);
    },
    [showNotification],
  );

  const error = useCallback(
    (title: string, description: string) => {
      showNotification("error", title, description);
    },
    [showNotification],
  );

  const warning = useCallback(
    (title: string, description: string) => {
      showNotification("warning", title, description);
    },
    [showNotification],
  );

  const info = useCallback(
    (title: string, description: string) => {
      showNotification("info", title, description);
    },
    [showNotification],
  );

  return {
    showNotification,
    removeNotification,
    success,
    error,
    warning,
    info,
    NotificationComponent,
  };
};
