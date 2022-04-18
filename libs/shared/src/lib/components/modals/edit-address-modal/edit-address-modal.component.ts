import { Component, OnInit, ChangeDetectionStrategy, Input, OnDestroy, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { catchError, filter, switchMap, take, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import {IKeyValuePair, Venue} from "../../../models";
import {getFullAddress} from "../../../utils/common";
import {AdminCoursesService} from "../../../utils/services";

@Component({
  selector: 'leap-edit-address-modal',
  templateUrl: './edit-address-modal.component.html',
  styleUrls: ['./edit-address-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class EditAddressModalComponent implements OnInit, OnDestroy {
  private readonly pendingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get pending$(): Observable<boolean> {
    return this.pendingSubject.asObservable();
  }

  private readonly countriesSubject: BehaviorSubject<IKeyValuePair[]> = new BehaviorSubject<IKeyValuePair[]>([]);

  get countries$(): Observable<IKeyValuePair[]> {
    return this.countriesSubject.asObservable();
  }

  private readonly citiesPendingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get citiesPending$(): Observable<boolean> {
    return this.citiesPendingSubject.asObservable();
  }

  private readonly citiesSubject: BehaviorSubject<IKeyValuePair[]> = new BehaviorSubject<IKeyValuePair[]>([]);

  get cities$(): Observable<IKeyValuePair[]> {
    return this.citiesSubject.asObservable();
  }

  private readonly venuesPendingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get venuesPending$(): Observable<boolean> {
    return this.venuesPendingSubject.asObservable();
  }

  private readonly venuesSubject: BehaviorSubject<Venue[]> = new BehaviorSubject<Venue[]>([]);

  get venues$(): Observable<Venue[]> {
    return this.venuesSubject.asObservable();
  }

  get countryControl(): FormControl {
    return this.form.get('country') as FormControl;
  }

  get cityControl(): FormControl {
    return this.form.get('city') as FormControl;
  }

  get venueControl(): FormControl {
    return this.form.get('venue') as FormControl;
  }

  private readonly allCountriesPendingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get allCountriesPending$(): Observable<boolean> {
    return this.allCountriesPendingSubject.asObservable();
  }

  form: FormGroup = this.fb.group({
    country: [null],
    city: [null],
    venue: [null, Validators.required],
  });

  @Input() venue: Venue;

  @Output() addVenue: EventEmitter<{ allCountries: IKeyValuePair[] }> = new EventEmitter<{
    allCountries: IKeyValuePair[];
  }>();

  venueCompareFn = (o1: Venue, o2: Venue) => (o1 && o2 ? o1.id === o2.id : o1 === o2);

  constructor(private readonly fb: FormBuilder, private readonly adminCoursesService: AdminCoursesService) {}

  ngOnInit(): void {
    const countryValueChanges$ = this.countryControl.valueChanges.pipe(
      switchMap((country) => {
        this.citiesPendingSubject.next(true);
        this.venuesPendingSubject.next(true);
        this.cityControl.reset(null);
        this.venueControl.reset(null);

        return this.adminCoursesService.getILTVenueCitiesDictionary(country);
      }),
      tap((cities) => {
        this.citiesPendingSubject.next(false);
        this.citiesSubject.next(cities);
        this.venuesPendingSubject.next(false);
        this.venuesSubject.next([]);
      }),
      catchError((error) => {
        this.citiesPendingSubject.next(false);
        this.venuesPendingSubject.next(false);
        return of(error);
      }),
    );

    const cityValueChanges$ = this.cityControl.valueChanges.pipe(
      filter((city) => !!city),
      switchMap((city) => {
        this.venuesPendingSubject.next(true);
        this.venueControl.reset(null);

        return this.adminCoursesService.getILTVenuesInCity(city);
      }),
      tap((venues) => {
        this.venuesPendingSubject.next(false);
        this.venuesSubject.next(venues);
      }),
      catchError((error) => {
        this.venuesPendingSubject.next(false);
        return of(error);
      }),
    );

    this.form.patchValue({
      country: this.venue.country,
      city: this.venue.city,
      venue: this.venue,
    });

    this.pendingSubject.next(true);
    forkJoin([
      this.adminCoursesService.getILTVenueCountriesDictionary().pipe(
        tap((countries) => {
          this.countriesSubject.next(countries);
        }),
      ),
      this.adminCoursesService.getILTVenueCitiesDictionary(this.venue.country).pipe(
        tap((cities) => {
          this.citiesSubject.next(cities);
        }),
      ),
      this.adminCoursesService.getILTVenuesInCity(this.venue.city).pipe(
        tap((venues) => {
          this.venuesSubject.next(venues);
        }),
      ),
    ])
      .pipe(
        tap(() => {
          this.pendingSubject.next(false);
        }),
        take(1),
      )
      .subscribe();

    countryValueChanges$.pipe(untilDestroyed(this)).subscribe();
    cityValueChanges$.pipe(untilDestroyed(this)).subscribe();
  }

  ngOnDestroy(): void {
    this.pendingSubject.complete();
    this.countriesSubject.complete();
    this.citiesPendingSubject.complete();
    this.citiesSubject.complete();
    this.venuesPendingSubject.complete();
    this.venuesSubject.complete();
    this.allCountriesPendingSubject.complete();
  }

  onAddVenue(event: MouseEvent): void {
    event.stopPropagation();
    this.allCountriesPendingSubject.next(true);
    this.adminCoursesService
      .getCountryDictionary()
      .pipe(untilDestroyed(this))
      .subscribe(
        (allCountries) => {
          this.allCountriesPendingSubject.next(false);
          this.addVenue.emit({ allCountries });
        },
        () => this.allCountriesPendingSubject.next(false),
      );
  }

  getFullAddress(venue: Venue): string {
    return getFullAddress(venue);
  }
}
