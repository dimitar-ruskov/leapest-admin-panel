import { SPCourseLanguageVariantLearner } from './sp-course-language-variant-learner.model';

export interface SPCourseLanguageVariantExam {
  id?: any;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  availableFrom?: string;
  availableTo?: string;
  timezone?: string;
  variantSKU?: string;
  assessmentId?: string;
  createdScheduleId?: string;
  accessKey?: string;
  accessUrl?: string;
  errorMessage?: string;
  user: SPCourseLanguageVariantLearner;
  voucherNumber?: any;
  status?: string;
  startTime?: string;
  endTime?: string;
  trainingStartTime?: any;
  trainingEndTime?: any;
  totalMarks?: number;
  maxMarks?: number;
  attemptTime?: string;
  totalQuestion?: number;
  totalCorrectAnswer?: number;
  totalUnAnswered?: number;
  percentile?: any;
  pdfReport?: any;
  performanceCategory?: any;
}
