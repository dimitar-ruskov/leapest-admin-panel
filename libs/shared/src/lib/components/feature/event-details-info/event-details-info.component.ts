import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  GeneralInfoField,
  ILTEvent,
  ILTInstructor,
  ITrainingManager
} from "../../../models/interfaces";

@Component({
  selector: 'leap-event-details-info',
  templateUrl: './event-details-info.component.html',
  styleUrls: ['./event-details-info.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventDetailsInfoComponent implements OnChanges {
  fields: GeneralInfoField[];

  @Input() iltEvent: ILTEvent;
  @Input() readonly: boolean;
  @Input() showThumbnail = true;

  @Output() editProp = new EventEmitter<{ fieldId: string }>();
  @Output() generateThumbnail = new EventEmitter<{ iltEventId: string }>();
  @Output() uploadThumbnail = new EventEmitter<{ thumbnailUrl: string; courseId: string }>();
  @Output() downloadCertificate = new EventEmitter<{ certificate }>();
  @Output() previewCertificate = new EventEmitter<{ certificate }>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.iltEvent && changes.iltEvent.currentValue) {
      this.fields = prepareGeneralInfoFields(changes.iltEvent.currentValue, this.readonly);
    }
  }

  onGenerateThumbnail(iltEventId: string): void {
    this.generateThumbnail.emit({ iltEventId });
  }

  onUploadThumbnail(thumbnailUrl: string, courseId: string): void {
    this.uploadThumbnail.emit({ thumbnailUrl, courseId });
  }

  onEdit(fieldId: string): void {
    this.editProp.emit({ fieldId });
  }

  onDownloadCertificate(certificate): void {
    this.downloadCertificate.emit(certificate);
  }

  onPreviewCertificate(certificate): void {
    this.previewCertificate.emit(certificate);
  }
}

function prepareGeneralInfoFields(iltEvent: ILTEvent, readonly: boolean): GeneralInfoField[] {
  const { classEvent, course, instructors } = iltEvent;
  const editable = !iltEvent.seatPurchaseOrigin;

  return [
    {
      id: 'language',
      title: 'Event Delivery Language',
      value: {
        content: iltEvent.language.configValue,
      },
      editable: editable && !readonly,
    },

    {
      id: 'timezone',
      title: 'Timezone',
      value: {
        content: classEvent?.timezone,
      },
      editable: editable && !readonly && !iltEvent.isInProgress,
    },
    {
      id: 'instructors',
      title: 'Instructor(s)',
      value: {
        content:
          instructors && Array.isArray(instructors) && instructors.length
            ? instructors.map(({ firstName, lastName, username }: ILTInstructor) => ({
                name: firstName && lastName ? `${firstName} ${lastName}` : 'N/A',
                email: username,
              }))
            : [],
        contentType: 'user',
      },
      editable: editable && !readonly,
    },
    {
      id: 'trainingManager',
      title: 'Training Manager',
      value: {
        content: iltEvent.trainingManagers?.map(({ trainingManagerEmail, trainingManagerName }: ITrainingManager) => ({
          name: trainingManagerName || 'N/A',
          email: trainingManagerEmail,
        })) || [
          {
            name: iltEvent.trainingManagerName,
            email: iltEvent.trainingManagerEmail,
          },
        ],
        contentType: 'user',
      },
      editable: editable && !readonly,
    },
    {
      id: 'seats',
      title: 'Number Of Learners',
      value: {
        content: `${course?.minStudents} - ${course.maxSeats}`,
      },
      editable: editable && !readonly,
    },
    {
      id: 'selfRegistration',
      title: 'Self Registration',
      value: {
        content: iltEvent.selfRegistration
          ? 'Yes, learners can register themselves for this course event'
          : 'No, learners will be manually assigned by an admin or training manager',
      },
      editable: editable && !readonly && iltEvent.isInternal,
    },

    ...(iltEvent.selfRegistration
      ? [
          {
            id: 'registrationApproval',
            title: 'Registration Approval',
            value: {
              content: iltEvent.course.automaticApproval
                ? 'No, approval is not required'
                : 'Yes, a training manager must approve registrations',
            },
            editable: !readonly && iltEvent.isInternal,
          },
        ]
      : []),
    {
      id: 'externalSKU',
      title: iltEvent.course.specificExternalSKU ? 'Custom Course Code' : 'Internal Course Code / SKU',
      value: {
        content: iltEvent.course.externalSKU,
      },
      editable: editable && !readonly,
    },
    {
      id: 'certificate-template',
      title: 'PARTICIPATION CERTIFICATE',
      value: {
        contentType: 'certificate',
        content: {
          preview: true,
          parentId: course.id,
          enabled: iltEvent.participationCertificateEnabled,
          value: course.participationCertificate ? course.participationCertificate.fileName : null,
          s3Bucket: course.participationCertificate ? course.participationCertificate.s3Bucket : null,
          s3Key: course.participationCertificate ? course.participationCertificate.s3Key : null,
        },
      },
      editable: editable && !readonly && !!course.participationCertificate,
    },
  ];
}
