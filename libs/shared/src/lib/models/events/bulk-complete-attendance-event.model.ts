import {ILTEventLearner} from "./ilt-event.model";

export interface BulkCompleteAttendanceEvent {
  days: string[];
  selectedLearners: ILTEventLearner[];
  totalLearners: number;
  selectedEligibleLearnersCount: number;
  selectedNotEligibleLearnersCount: number;
}
