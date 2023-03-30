import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'iconColor'
})
export class IconColorPipe implements PipeTransform {

  transform(status: string): string {
    switch (status) {
      case "EXPIRED": return 'expired';
      case "EXPIRING": return 'expiring';
      case "VALID": return 'valid';
      default: return null;
    }
  }

}
