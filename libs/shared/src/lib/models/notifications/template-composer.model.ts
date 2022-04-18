export interface TemplateComposerModel {
  subject: string;
  cc: boolean;
  message: TemplateComposerMessageModel[];
  subjectJSON?: TemplateComposerMessageModel[];
}

export interface TemplateComposerMessageModel {
  type?: string;
  children?: TemplateComposerMessageModel[];
  placeholder?: PlaceholderModel;
  text?: string;
}

export interface PlaceholderModel {
  key: string;
  value: string;
  isLink: boolean;
}
