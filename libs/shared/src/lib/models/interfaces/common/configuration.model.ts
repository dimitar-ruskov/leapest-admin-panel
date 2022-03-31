export interface Configuration {
  id?: string;
  configKey?: string;
  configValue?: string;
  configType?: string;
  defaultValue?: string;
  createdAt?: number;
  createdBy?: number;
  systemConfig?: boolean;
  updatedAt: number;
  updatedBy: string;
}
