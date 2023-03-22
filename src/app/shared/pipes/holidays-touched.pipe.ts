import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'holidaysTouched',
  pure: false
})
export class HolidaysTouchedPipe implements PipeTransform {

  transform(model: Date[], startingModel: Date[]): boolean {
    /*  startingModel = [...startingModel.map(date => new Date(date.toDateString()))];
     model = [...model.map(date => new Date(date.toDateString()))];
     if (startingModel.length !== model.length) {
       return false;
     }
     for (let i = 0; i < startingModel.length; i++) {
       if (startingModel[i].valueOf() !== model[i].valueOf()) {
         return false;
       }
     }
     return true; */
    if (JSON.stringify(model) == JSON.stringify(startingModel)) {
      return true;
    }
    return false;
  }
}
