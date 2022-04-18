import {ConfigDto} from "../common/config-dto.model";
import {Configuration} from "../common/configuration.model";
import {TemplateComposerMessageModel} from "./template-composer.model";

export interface NotificationModel {
  courseEventId: string;
  createdAt: string;
  createdBy: string;
  emailMarkup: TemplateComposerMessageModel[];
  id: string;
  informReportingManager: boolean;
  placeholders: Configuration[];
  recipient: ConfigDto;
  subject: string;
  subjectJSON?: TemplateComposerMessageModel[];
  trigger: ConfigDto;
  updatedAt: string;
  updatedBy: string;
  venue?: ConfigDto;
}

export interface NotificationPlaceholderModel {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  placeholder: ConfigDto;
  customValue: string;
}

export interface NotificationsSettingsModel {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  notificationLogoBucket: string;
  notificationLogoKey: string;
  emailSender: string;
  senderName: string;
  customValuePlaceholders: NotificationPlaceholderModel[];
  footer: string;
}

export interface NotificationPayloadModel {
  recipient?: Partial<ConfigDto>;
  trigger?: Partial<ConfigDto>;
  venue?: Partial<ConfigDto>;
  subject?: string;
  subjectJSON?: TemplateComposerMessageModel[];
  informReportingManager?: boolean;
  emailMarkup?: TemplateComposerMessageModel[];
  eventId?: string;
}

export interface NotificationsListModel {
  data: NotificationModel[];
  count: number;
  limit: number;
  page: number;
}

export interface NotificationRecipientModel {
  firstName: string;
  lastName: string;
  userName: string;
}

export interface NotificationRecipientsListModel {
  data: NotificationRecipientModel[];
  count: number;
  limit: number;
  page: number;
}

export interface ISearchParams {
  filter?: string;
  venue?: string[];
  recipient?: string[];
  trigger?: string[];
}

export interface ISearchMetadata {
  totalCount: number;
}

export interface ReportingDomainsMap {
  [domain: string]: boolean;
}

export enum NotificationResetLevel {
  COURSE = 'course',
  DOMAIN = 'domain',
  DEFAULT = 'default',
}
