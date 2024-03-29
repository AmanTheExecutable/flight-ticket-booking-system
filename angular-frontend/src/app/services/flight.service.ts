import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { Flight } from '../modals/flight.modal';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  flightSchedules: Flight[] = [];
  searchListFlights: Flight[] = [];
  schedulesLoaded: boolean = false;

  constructor(private http: HttpClient, private commonService: CommonService) {
    this.loadFlightSchedules().subscribe(() => {
      this.schedulesLoaded = true;
    });
  }

  fetchFlightSchedules(): Observable<any> {
    return this.http.get(this.commonService.baseURL + 'flights');
  }

  private filteredFlightsSubject = new BehaviorSubject<Flight[]>([]);
  filteredFlights$ = this.filteredFlightsSubject.asObservable();

  setFilteredFlights(flights: Flight[]): void {
    this.filteredFlightsSubject.next(flights);
  }

  getFilteredFlights(): Flight[] {
    return this.filteredFlightsSubject.getValue();
  }

  addFlightSchedule(flight: any): void {
    this.http
      .post<any>(this.commonService.baseURL + 'flights', flight)
      .subscribe((response) => {
        console.log(response);
      });
  }

  searchFlightsByPost(obj: any): Observable<Flight[]> {
    this.searchListFlights = [];
    return this.http.post<any>(this.commonService.baseURL + 'search', obj).pipe(
      map((Response: any[]) => {
        Response.forEach((schedule: any) => {
          this.searchListFlights.push({
            id: schedule.scheduleId,
            flightNumber: schedule.flightNumber,
            company: schedule.flightName,
            source: schedule.source,
            destination: schedule.destination,
            departureDate: schedule.departureTime.split('T')[0],
            departureTime: schedule.departureTime.split('T')[1].substring(0, 5),
            arrivalDate: schedule.arrivalTime.split('T')[0],
            arrivalTime: schedule.arrivalTime.split('T')[1].substring(0, 5),
            path: schedule.path,
            economy_class_price: schedule.ec_Price,
            first_class_price: schedule.fc_Price,
            business_class_price: schedule.bc_Price,
            economy_class_seats: schedule.ec_Seats,
            first_class_seats: schedule.fc_Seats,
            business_class_seats: schedule.bc_Seats,
          });
        });
        return this.searchListFlights;
      })
    );
  }

  // searchFlights(
  //   source: string,
  //   destination: string,
  //   date: string
  // ): Observable<Flight[]> {
  //   return this.loadFlightSchedules().pipe(
  //     switchMap(() => {
  //       const filteredFlights = this.flightSchedules.filter(
  //         (flight) =>
  //           flight.source.toLowerCase() === source.toLowerCase() &&
  //           flight.destination.toLowerCase() === destination.toLowerCase() &&
  //           flight.departureDate == date
  //       );
  //       return of(filteredFlights);
  //     })
  //   );
  // }

  getFlightById(ide: number): Observable<Flight> {
    const flight = this.flightSchedules.find((flight) => flight.id == ide);
    return of(flight);
  }

  updateFlightDetails(updatedFlight: Flight): Observable<string> {
    const flightJson = {
      scheduleId: updatedFlight.id,
      flightNumber: updatedFlight.flightNumber,
      flightName: updatedFlight.company,
      source: updatedFlight.source,
      destination: updatedFlight.destination,
      departureTime:
        updatedFlight.departureDate + 'T' + updatedFlight.departureTime,
      arrivalTime: updatedFlight.arrivalDate + 'T' + updatedFlight.arrivalTime,
      ec_Seats: updatedFlight.economy_class_seats,
      fc_Seats: updatedFlight.first_class_seats,
      bc_Seats: updatedFlight.business_class_seats,
      ec_Price: updatedFlight.economy_class_price,
      fc_Price: updatedFlight.first_class_price,
      bc_Price: updatedFlight.business_class_price,
    };
    this.http
      .put<any>(this.commonService.baseURL + 'flights', flightJson)
      .subscribe((response) => {
        console.log(response);
      });
    return of('Flight updated successfully');
  }

  getAllFlightSchedules(): Observable<Flight[]> {
    this.refreshFlightSchedules().subscribe();
    return of(this.flightSchedules);
  }

  getAllFlightIds(): Observable<number[]> {
    return of(this.flightSchedules.map((flight) => flight.id));
  }

  refreshFlightSchedules(): Observable<Flight[]> {
    this.schedulesLoaded = false;
    this.loadFlightSchedules().subscribe(() => {
      this.schedulesLoaded = true;
    });
    return of(this.flightSchedules);
  }

  loadFlightSchedules(): Observable<void> {
    return new Observable<void>((observer) => {
      this.fetchFlightSchedules().subscribe((response: any[]) => {
        this.flightSchedules = response.map((schedule) => ({
          id: schedule.scheduleId,
          flightNumber: schedule.flightNumber,
          company: schedule.flightName,
          source: schedule.source,
          destination: schedule.destination,
          departureDate: schedule.departureTime.split('T')[0],
          departureTime: schedule.departureTime.split('T')[1].substring(0, 5),
          arrivalDate: schedule.arrivalTime.split('T')[0],
          arrivalTime: schedule.arrivalTime.split('T')[1].substring(0, 5),
          path: schedule.path,
          economy_class_price: schedule.ec_Price,
          first_class_price: schedule.fc_Price,
          business_class_price: schedule.bc_Price,
          economy_class_seats: schedule.ec_Seats,
          first_class_seats: schedule.fc_Seats,
          business_class_seats: schedule.bc_Seats,
        }));
        this.setFilteredFlights(this.flightSchedules);
        observer.next();
        observer.complete();
      });
    });
  }

  deleteFlightSchedule(scheduleId: number): Observable<any> {
    return this.http.delete<any>(
      `${this.commonService.baseURL}flights/${scheduleId}`
    );
  }
}
