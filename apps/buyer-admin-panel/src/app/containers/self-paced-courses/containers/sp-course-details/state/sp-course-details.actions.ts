import {
  ActiveSelfPacedCourse,
  PublishCourseToLXP,
  S3BucketData
} from "../../../../../../../../../libs/shared/src/lib/models";


export class ChangeSelfPacedCourseDetailsTab {
  static readonly type = '[AP Self-paced Course Details] Change Self-paced Course Details Tab';
  constructor(public readonly payload: { activeTab: number }) {}
}

export class GetActiveSelfPacedCourse {
  static readonly type = '[AP Self-paced Course Details] Get Active Self-paced Course';
  constructor(public readonly payload: { id: string }) {}
}

export class UpdateSPCourseAttribute {
  static readonly type = '[AP Self-paced Course Details] Update Active Self-paced Course Attribute';
  constructor(
    public readonly payload: {
      updatedCourse: ActiveSelfPacedCourse;
      attribute: string;
      props?: string[];
    },
  ) {}
}

export class GenerateSelfPacedCourseThumbnail {
  static readonly type = '[AP Self-paced Course Details] Generate Self-paced Course Thumbnail';
  constructor(public readonly payload: { courseId: string }) {}
}

export class UploadSelfPacedCourseThumbnail {
  static readonly type = '[AP Self-paced Course Details] Upload Self-paced Course Thumbnail';
  constructor(public readonly payload: { courseId: string; s3BucketData: S3BucketData }) {}
}

export class PublishToLxp {
  static readonly type = '[AP Self-paced Course Details] Publish To LXP';
  constructor(public readonly payload: PublishCourseToLXP) {}
}

export class PublishToLxpByDomain {
  static readonly type = '[AP Self-paced Course Details] Publish To LXP by Domain';
  constructor(public readonly payload: PublishCourseToLXP) {}
}
