export interface IProfile {
  avatar: {
    large: string;
    medium: string;
    small: string;
    tiny: string;
  };
  bpRedirect: boolean;
  completionPercentage: any;
  consentDate: string;
  createdAt: string;
  createdBy: string;
  defaultSubdomain: string;
  displayName: string;
  eligibleForCompletion: boolean;
  enrolmentDate: string;
  firstName: string;
  hwRedirect: boolean;
  hybrid: any;
  id: string;
  inWaitingList: any;
  instructorRole: boolean;
  invitationSent: boolean;
  language: string;
  lastName: string;
  linkedIn: any;
  lxpUser: boolean;
  markedCompletedOn: string;
  registered: boolean;
  sequenceNumber: number;
  timeZone: string;
  type: string;
  updatedAt: string;
  updatedBy: string;
  username: string;
  waitlistTicketNumber: number;
  whitelisted: boolean;
  domainName: string;
}
