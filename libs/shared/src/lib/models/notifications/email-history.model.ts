import {ILTEvent, IPageable, IProfile} from "../index";

export interface EmailNotification {
  id: string;
  hedwigEmailId: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  notificationDTO: NotificationDTO;
  courseEventDTO: ILTEvent;
  recipient: IProfile;
}

export interface NotificationDTO {
  subject: string;
  emailMarkup: string;
  trigger: { configKey: string };
  recipient: { configKey: string };
  venue: { configKey: string };
}

export interface IPageableEmailHistory extends IPageable {
  venue?: string;
  trigger?: string;
  recipient?: string;
}
