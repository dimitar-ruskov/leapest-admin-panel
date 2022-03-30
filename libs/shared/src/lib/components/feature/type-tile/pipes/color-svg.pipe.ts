import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'colorSvg',
  pure: false
})

export class ColorSvgPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) { }

  transform(value: string, color: any): SafeHtml {
    const r = value.split('path');
    return this.sanitized.bypassSecurityTrustHtml(r[0] + 'path style=\'fill:' + color + '\'' + r[1]);
  }
}
