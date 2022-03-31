import { ConfigDto } from './config-dto.model';

export interface ILTCourseListItem {
  id: string;
  categoryName: string;
  name: string;
  thumbnailUrl?: string;
}

export interface ILTEventListItem {
  id: string;
  name: string;
  virtualVenue: boolean;
  venue: Venue;
  startDate: string;
  endDate: string;
  maxSeats: number;
  minStudents?: number;
  enrolledLearnerCounter: number;
  historical: boolean;
  thumbnailUrl?: string;
  pendingApproval: boolean;
  publishStatus?: ConfigDto;
}

export interface Venue {
  address?: string;
  city?: string;
  country?: string;
  id?: string;
  province?: string;
  postalCode?: string;
  state?: string;
  houseNumber?: number;
  room?: number;
}

export interface IFilterSelectedDates {
  key: string;
  value: string[];
}

export interface ILTCourseDraftListItem {
  id: string;
  type: { configKey: string; configType: string; configValue: string };
  name: string;
}
