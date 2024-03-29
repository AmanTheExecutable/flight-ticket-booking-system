import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from './common.service';
import { BookingDataService } from './booking-data.service';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private totalPrice: number;

  constructor(
    private bookingDataService: BookingDataService,
    private commonService: CommonService,
    private userService: UserService,
    private http: HttpClient
  ) {}

  setTotalPrice(price: number): void {
    this.totalPrice = price;
  }

  getTotalPrice(): number {
    return this.totalPrice;
  }

  saveConfirmedBooking(): Observable<any> {
    const queryObj = [];
    this.bookingDataService.passengersData.forEach((passenger: any) => {
      let cost = 0;
      if (passenger.seatCategory == 'economy') {
        cost = this.bookingDataService.flight.economy_class_price;
      }
      if (passenger.seatCategory == 'firstClass') {
        cost = this.bookingDataService.flight.first_class_price;
      }
      if (passenger.seatCategory == 'business') {
        cost = this.bookingDataService.flight.business_class_price;
      }
      const obj = {
        userId: this.userService.userDetails.id,
        scheduleId: this.bookingDataService.flight.id,
        passengerName: passenger.name,
        passengerEmail: passenger.email,
        passengerPhone: passenger.phone,
        passengerGender: passenger.gender,
        passengerAge: passenger.age,
        ticketPrice: cost,
        seatPreference: passenger.seatCategory,
      };
      queryObj.push(obj);
    });
    console.log(queryObj);
    this.http.post(this.commonService.baseURL + 'booking', queryObj).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.error('Failed to save booking:', error);
      }
    );

    return;
  }
}
