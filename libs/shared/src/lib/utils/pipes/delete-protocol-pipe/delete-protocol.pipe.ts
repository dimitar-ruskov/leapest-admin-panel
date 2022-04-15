import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'deleteProtocol',
})
export class DeleteProtocolPipe implements PipeTransform {
  transform(value: string): string {
    return value.slice(value.indexOf('//') + 2); // http:// or https://
  }
}
