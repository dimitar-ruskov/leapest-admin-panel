import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { Observable, Observer } from 'rxjs';

import { EnvironmentService } from "../../../services/common/environment.service";

@Component({
  selector: 'leap-upload-thumbnail-modal',
  templateUrl: './upload-thumbnail-modal.component.html',
  styleUrls: ['./upload-thumbnail-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadThumbnailModalComponent implements OnInit {
  @Input() data: any;
  private type;
  public component = 'leap-upload-thumbnail-modal';
  private dimensions;
  public file: File;
  public fileName = 'Default Thumbnail';
  public allowedUploadFormats: string;
  private readonly maxFileSize: number = 10;

  public imageSrc: string;

  constructor(
    public environmentService: EnvironmentService,
    private changeDetectorRefs: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.type = this.data.type;
    this.dimensions = this.data.dimensions;
    this.allowedUploadFormats = this.type ? this.type.join(',') : '';
  }

  beforeUpload = (file: File): Observable<boolean> => {
    return new Observable((observer: Observer<boolean>) => {
      if (!this.type) {
        observer.next(true);
        observer.complete();
        return;
      }
      const parts = file.name.split('.');
      const ext = `.${parts[parts.length - 1]}`;
      const allowedFormat = this.type.includes(ext); // add notification
      const isLtM = file.size / 1024 / 1024 < this.maxFileSize; // add notification
      const hasImgInType = file.type.indexOf('image') !== -1; // add notification
      const checkDimension = this.validateDimensions(file).subscribe(res => { // add notification
        observer.next(allowedFormat && isLtM && hasImgInType && res);
        observer.complete();
      }); // add notification
    });
  }

  uploadFile = (event: any) => {
    this.getBase64(event.file, (img: string) => {
      this.imageSrc = img;
      this.changeDetectorRefs.detectChanges();
    });
    this.file = event.file;
    this.fileName = this.file.name;
  }

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result?.toString()));
    reader.readAsDataURL(img);
  }

  private validateDimensions(file: File): Observable<boolean> {
    return new Observable((observer: Observer<boolean>) => {
      const img = new Image();
      img.src = window.URL.createObjectURL(file);
      img.onload = () => {
        let result: boolean;
        switch (this.dimensions.comp) {
          case 'eq':
            result = (!this.dimensions.height || this.dimensions.height === img.naturalHeight)
              && (!this.dimensions.width || this.dimensions.width === img.naturalWidth);
            break;
          case 'geq':
            result = (!this.dimensions.height || this.dimensions.height <= img.naturalHeight)
              && (!this.dimensions.width || this.dimensions.width <= img.naturalWidth);
            break;
          case 'max':
            result = (!this.dimensions.height || this.dimensions.height >= img.naturalHeight)
              && (!this.dimensions.width || this.dimensions.width >= img.naturalWidth);
            break;
          default:
            result = (!this.dimensions.height || this.dimensions.height <= img.naturalHeight)
              && (!this.dimensions.width || this.dimensions.width <= img.naturalWidth);
            break;
        }
        if (this.dimensions.ratio) {
          result = result && ((img.naturalWidth / img.naturalHeight) < this.dimensions.ratio + 0.1)
            && ((img.naturalWidth / img.naturalHeight) > this.dimensions.ratio - 0.1);
        }
        // observer.next(result);
        observer.next(true);
        observer.complete();
      };
    });
  }

  onDelete() {
    this.imageSrc = null;
    this.file = null;
    this.fileName = 'Default Thumbnail';
  }


}
