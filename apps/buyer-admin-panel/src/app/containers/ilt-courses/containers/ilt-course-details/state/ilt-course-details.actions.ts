import {
  PublishCourseToLXP,
  PublishedILTCourse,
  S3BucketData
} from "../../../../../../../../../libs/shared/src/lib/models/interfaces";

export class ChangeILTCourseDetailsTab {
  static readonly type = '[AP ILT Course Details] Change ILT Course Details Tab';

  constructor(public readonly payload: { activeTab: number }) {}
}

export class GetILTCourse {
  static readonly type = '[AP ILT Course Details] Get ILT Course';

  constructor(public readonly payload: { id: string }) {}
}

export class UpdateILTCourseAttribute {
  static readonly type = '[AP ILT Course Details] Update ILT Course Attribute';
  constructor(
    public readonly payload: {
      updatedCourse: PublishedILTCourse;
      attribute: string;
      props?: string[];
    },
  ) {}
}

export class GenerateILTCourseThumbnail {
  static readonly type = '[AP ILT Course Details] Generate ILT Course Thumbnail';
  constructor(public readonly payload: { courseId: string }) {}
}

export class UploadILTCourseThumbnail {
  static readonly type = '[AP ILT Course Details] Upload ILT Course Thumbnail';
  constructor(public readonly payload: { courseId: string; s3BucketData: S3BucketData }) {}
}

export class UpdateILTCourseAgenda {
  static readonly type = '[AP ILT Course Details] Update ILT Course Agenda';
  constructor(public readonly data: PublishedILTCourse, public readonly key: string) {}
}

export class DiscardILTCourseAgendaChanges {
  static readonly type = '[AP ILT Course Details] Discard ILT Course Agenda Changes';
}

export class UpdateILTCourseMaterials {
  static readonly type = '[AP ILT Course Details] Update ILT Course Materials';
  constructor(public readonly data: PublishedILTCourse, public readonly key: string) {}
}

export class DiscardILTCourseMaterialsChanges {
  static readonly type = '[AP ILT Course Details] Discard ILT Course Materials Changes';
}

export class DeleteCourse {
  static readonly type = '[AP ILT Course Details] Delete Course';
  constructor(public readonly payload: { courseId: string }) {}
}

export class PublishToLxp {
  static readonly type = '[AP ILT Course Details] Publish To LXP';
  constructor(public readonly payload: PublishCourseToLXP) {}
}
