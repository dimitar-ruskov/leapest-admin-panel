import { IKeyValuePair, IPublishingSettings } from "../../../../../../../libs/shared/src/lib/models";

export class EditTabValue {
  static readonly type = '[AP Publishing] Edit Tab Value';
  constructor(public readonly payload: { updatedTab: IPublishingSettings }) {}
}

export class GetIRSettings {
  static readonly type = '[AP Publishing] Get IR Settings';
  constructor(public readonly payload: { irTypes: IKeyValuePair[] }) {}
}

export class GetGeneralSettings {
  static readonly type = '[AP Publishing] Get General Settings';
}
