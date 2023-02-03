import { Pipe, PipeTransform } from '@angular/core';
import { UserAssociated } from 'src/app/domain/interface';

@Pipe({
  name: 'isSameSelected'
})
// se i selezionati sono gli stessi di quelli inizialmente presenti ritorna true
export class CheckSelectedPipe implements PipeTransform {

  transform(selectedUser: UserAssociated[], grantedUsers: UserAssociated[]): boolean {
    if (JSON.stringify(selectedUser) === JSON.stringify(grantedUsers)) {
      return true;
    } else {
      return false;
    }
  }

}
