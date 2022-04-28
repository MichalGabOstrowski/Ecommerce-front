import {Injectable} from '@angular/core';
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ShopFormService {

  constructor() {
  }

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];

    //  build an array for "Month" dropdown list
    //  - start at current Month and loop until

    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }

    //of -> observable data [  given month - given month +12]
    return of(data);
  }

  getCreditCardYear(): Observable<number[]> {
    let data: number[] = [];

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;


    for (let theYear = startYear; theYear <= endYear; theYear++) {
      data.push(theYear);
    }

    //of -> observable data [  given year - given year + 10]
    return of(data);
  }
}
