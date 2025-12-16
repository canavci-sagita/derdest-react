import { NotificationType } from "@/services/common/enums";

export interface NotificationMessage {
  type: NotificationType;
  message: string;
}

export interface ProgressNotification extends NotificationMessage {
  fileName: string;
  percentage: number;
}

export interface ChatNotification extends NotificationMessage {
  from: string;
  to: string;
}
