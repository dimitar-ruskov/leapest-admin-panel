import { Injectable } from '@angular/core';
import { NzNotificationService, NzNotificationDataOptions } from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly options: NzNotificationDataOptions = {
    nzPlacement: 'bottomRight',
    nzAnimate: true,
    nzDuration: 5000,
  };

  constructor(private readonly notification: NzNotificationService) {}

  public success(message: string, title = 'Success'): void {
    this.notification.success(title, message, this.options);
  }

  public warning(message: string, title = 'Warning'): void {
    this.notification.warning(title, message, this.options);
  }

  public info(message: string, title = 'Info'): void {
    this.notification.info(title, message, this.options);
  }

  public error(message: string, title = 'Error'): void {
    this.notification.error(title, message, this.options);
  }
}
