import { ILTEventCreationStep } from '../models/ilt-event-create-step.model';
import {ILTEvent} from "../../../../../../../../../libs/shared/src/lib/models/interfaces";

export class GetILTEventDetails {
  static readonly type = '[AP ILT Events] Get ILT Event Details';
  constructor(public readonly id: string) { }
}
export class ResetEventBase {
  static readonly type = '[AP ILT Events] Reset Event Base';
  constructor() { }
}
export class UpdateILTEventDetails {
  static readonly type = '[AP ILT Events] Update ILT Event Details';
  constructor(public readonly data: ILTEvent, public readonly key: string) { }
}
export class GoToEventCreationStep {
  static readonly type = '[AP ILT Events] Go to Event Creation Step';
  constructor(public readonly step: ILTEventCreationStep) { }
}
