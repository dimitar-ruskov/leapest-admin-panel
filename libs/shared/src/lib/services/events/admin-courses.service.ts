import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { Store } from "@ngxs/store";
import { Observable, of, timer } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { DeferredResource } from "../../utils/common";
import DeferredResourceUtils from "../../utils/common/deferred-resource.utils";
import { AdminPanelApiService } from "../common/admin-panel-api.service";
import { EnvironmentService } from "../common/environment.service";
import {
  AmberResponse,
  AssignLearnersResponse,
  ConferencingTool,
  ExamCompletionReport,
  ExamShortInfo,
  FlattenedCourseDetails,
  ICauseType,
  IConfigCertificatesDictionary,
  IKeyValuePair,
  ILTEvent,
  ILTEventAttendance,
  ILTEventAttendanceCompletionPayload,
  ILTEventAttendancesByUser,
  ILTEventAttendanceUpdatePayload,
  ILTEventBase,
  ILTEventBulkMarkAttendancesPayload,
  ILTEventCustomAttendanceLight,
  ILTEventLearner,
  ILTInstructor,
  InternalRepositoryMaterial,
  IPageable,
  IRContent,
  LearnersBulkImportResponse,
  LearnersValidationResponse,
  MasterInternalRepository,
  MaterialCompletionReport,
  S3BucketData,
  TrainingManager,
  UploadLearnerResponse,
  Venue
} from "../../models";

@Injectable({
  providedIn: 'root',
})
export class AdminCoursesService {
  constructor(
    private readonly http: HttpClient,
    private readonly environment: EnvironmentService,
    private readonly store: Store,
    private readonly adminPanelApiService: AdminPanelApiService,
  ) {}

  getMaterialTypes(isHosted: boolean): Observable<DeferredResource<IKeyValuePair[]>> {
    const url = `${this.environment.amberBaseUrl}/api/solar/partner/internal-repository?hosted=${isHosted}`;

    const params = new HttpParams();
    return DeferredResourceUtils.wrapAmberObservable(
      this.http.get<AmberResponse<IKeyValuePair[]>>(url, { params }),
    );
  }

  getILTLanguageDictionary(): Observable<DeferredResource<IKeyValuePair[]>> {
    const url = `${this.environment.amberBaseUrl}/api/solar/partner/configuration/dictionary/delivery-languages?sortByValue=true&showKeys=true`;

    const params = new HttpParams();
    return DeferredResourceUtils.wrapAmberObservable(
      this.http.get<AmberResponse<IKeyValuePair[]>>(url, { params }),
    );
  }

  getIRLanguageDictionary(): Observable<DeferredResource<{ data: IKeyValuePair[]; flags: { size: number } }>> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/configuration/query/dictionary');

    let params = this.adminPanelApiService.prepareParams();

    params = params.append('@configType', 'language');
    params = params.append('showKeys', 'true');
    params = params.append('$configValue', '1');

    return this.adminPanelApiService.getWithFlags<IKeyValuePair[]>(url, new HttpHeaders({}), params);
  }

  getIRDictionary(type: string): Observable<DeferredResource<{ data: IKeyValuePair[]; flags: { size: number } }>> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/configuration/query/dictionary');

    let params = this.adminPanelApiService.prepareParams();

    params = params.append('@configType', type);
    params = params.append('showKeys', 'true');
    params = params.append('$configValue', '1');

    return this.adminPanelApiService.getWithFlags<IKeyValuePair[]>(url, new HttpHeaders({}), params);
  }

  getCauseTypeDictionary(configType): Observable<AmberResponse<ICauseType[]>> {
    const url = `${this.environment.amberBaseUrl}/api/solar/configuration/list/specific?typesOfConfig=${configType}`;

    const params = new HttpParams();
    return this.http.get<AmberResponse<ICauseType[]>>(url, { params });
  }

  getCustomAttendanceDictionary(): Observable<DeferredResource<ILTEventCustomAttendanceLight[]>> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/custom-attendance/list');

    const params = new HttpParams();
    return this.adminPanelApiService.get(url, new HttpHeaders({}), params);
  }

  updateILTEventDetails(data: ILTEvent, key: string): Observable<DeferredResource<ILTEvent>> {
    const url = `${this.environment.amberBaseUrl}/api/solar/course-event/details/update/${key}`;

    const params = new HttpParams();
    return DeferredResourceUtils.wrapAmberObservable(
      this.http.post<AmberResponse<ILTEvent>>(url, data, {
        params,
      }),
    );
  }

  updateILTEventAttribute(body: ILTEvent, key: string): Observable<DeferredResource<ILTEvent>> {
    const url = this.adminPanelApiService.prepareURL(`/api/solar/course-event/edit/attribute/${key}`);

    const params = this.adminPanelApiService.prepareParams();

    return this.adminPanelApiService.post<ILTEvent, ILTEvent>(url, new HttpHeaders({}), body, params);
  }

  getInternalRepositoryMaterials(
    pageable?: IPageable,
  ): Observable<{
    data: {
      filterValues: IKeyValuePair[];
      resultList: { count: number; page: number; limit: number; data: MasterInternalRepository[] };
    };
  }> {
    const url = `${this.environment.amberBaseUrl}/api/library/internal/repository/parent/list/lite`;

    let params = new HttpParams();
    if (pageable.page) {
      params = params.append('page', pageable.page.toString());
    }
    if (pageable.limit) {
      params = params.append('limit', pageable.limit.toString());
    }
    if (pageable.filter) {
      params = params.append('filter', pageable.filter.toString());
    }
    return this.http.get<{
      data: {
        filterValues: IKeyValuePair[];
        resultList: { count: number; page: number; limit: number; data: MasterInternalRepository[] };
      };
    }>(url, {
      params,
    });
  }

  getInternalRepositoryMaterialDetails(ids: number[]): Observable<AmberResponse<InternalRepositoryMaterial[]>> {
    const url = `${this.environment.amberBaseUrl}/api/library/internal/repository/parent/contents/byid`;

    let params = new HttpParams();
    for (let i = 0; i < ids.length; i++) {
      params = params.append('id', ids[i].toString());
    }
    params = params.append('stableOrder', 'true');
    return this.http.get<AmberResponse<InternalRepositoryMaterial[]>>(url, { params });
  }

  getInternalMaterialsExams(): Observable<DeferredResource<ExamShortInfo[]>> {
    const url = `${this.environment.amberBaseUrl}/api/library/content/dictionary/byType?type=ext-assessment&$displayName=1&show-language=true`;

    return DeferredResourceUtils.wrapAmberObservable(this.http.get<AmberResponse<ExamShortInfo[]>>(url));
  }

  getInternalMaterialsExamDetails(id: number): Observable<DeferredResource<IRContent>> {
    const url = `${this.environment.amberBaseUrl}/api/library/content/details/${id}`;

    return DeferredResourceUtils.wrapAmberObservable(this.http.get<AmberResponse<IRContent>>(url));
  }

  existingNameAsyncValidator({
    ignore,
    type,
    isVariant,
    isCourse,
  }: {
    ignore?: string;
    type?: string;
    isVariant?: boolean;
    isCourse?: boolean;
  }): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return timer(800).pipe(
        switchMap(() => {
          if (!control.value) {
            return of(null);
          } else if (ignore && control.value === ignore) {
            return of(null);
          } else {
            const url = `${this.environment.amberBaseUrl}${
              isCourse
                ? '/api/solar/partner/course/name-check'
                : isVariant
                ? '/api/library/internal/repository/namecheck'
                : '/api/library/internal/repository/parent/namecheck'
            }`;
            let params = new HttpParams().set('name', control.value);
            params = isCourse ? params : params.set('type', type);
            return DeferredResourceUtils.wrapAmberObservable(
              this.http.get<AmberResponse<IKeyValuePair[]>>(url, { params }),
            ).pipe(
              map((res: DeferredResource<IKeyValuePair[]>) => {
                const messsage = { custom: { message: 'Name already registered' } };
                if (!res.isSuccess && isCourse) {
                  return messsage;
                }
                if (res.isSuccess && !isCourse) {
                  const result = res.response ? messsage : null;
                  return result;
                }
              }),
            );
          }
        }),
      );
    };
  }

  existingSKUAsyncValidator(specialSKU?: boolean, ignore?: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return timer(800).pipe(
        switchMap(() => {
          if (!control.value) {
            return of(null);
          } else if (ignore && control.value === ignore) {
            return of(null);
          } else {
            const url = this.adminPanelApiService.prepareURL('/api/solar/partner/external-sku-check');
            const params = new HttpParams().set('externalSKU', control.value);
            return DeferredResourceUtils.wrapAmberObservable(
              this.http.get<AmberResponse<IKeyValuePair[]>>(url, { params }),
            ).pipe(
              map((res: DeferredResource<unknown>) => {
                if (!res.pending) {
                  return res.response === false
                    ? {
                        custom: {
                          message: specialSKU ? 'This Custom Code already registered' : 'SKU already registered',
                        },
                      }
                    : null;
                }
              }),
            );
          }
        }),
      );
    };
  }

  getAgoraKeywords(filter?: string): Observable<AmberResponse<IKeyValuePair[]>> {
    const url = `${this.environment.amberBaseUrl}/api/agora/keywords/dictionary`;

    let params = new HttpParams();
    if (filter) {
      params = params.append('filter', filter.toString());
    }
    return this.http.get<AmberResponse<IKeyValuePair[]>>(url, { params });
  }

  getCourseLevelDictionary(): Observable<AmberResponse<IKeyValuePair[]>> {
    const url = `${this.environment.amberBaseUrl}/api/solar/configuration/query/dictionary?@configType=courseLevel&$configOrder=1&and=1`;

    const params = new HttpParams();
    return this.http.get<AmberResponse<IKeyValuePair[]>>(url, { params });
  }

  getCourseOptionsForEvent(): Observable<AmberResponse<IKeyValuePair[]>> {
    const url = `${this.environment.amberBaseUrl}/api/solar/root/course/dictionary/instructorLedCourse`;

    const params = new HttpParams();
    return this.http.get<AmberResponse<IKeyValuePair[]>>(url, { params });
  }

  getILTEventDetails(id: string): Observable<DeferredResource<ILTEvent>> {
    const url = `${this.environment.amberBaseUrl}/api/solar/course-event/read/${id}`;

    const params = new HttpParams();
    return DeferredResourceUtils.wrapAmberObservable(
      this.http.get<AmberResponse<ILTEvent>>(url, { params }),
    );
  }

  initiateILTEventCreation(data: ILTEventBase): Observable<AmberResponse<ILTEvent>> {
    const url = `${this.environment.amberBaseUrl}/api/solar/course-event/create`;

    const params = new HttpParams();
    return this.http.post<AmberResponse<ILTEvent>>(url, data, { params });
  }

  generateCourseThumbnail(data: { id: string }): Observable<AmberResponse<FlattenedCourseDetails>> {
    const url = `${this.environment.amberBaseUrl}/api/solar/course/thumbnail/generate`;

    const params = new HttpParams();
    return this.http.post<AmberResponse<FlattenedCourseDetails>>(url, data, { params });
  }

  uploadThumbnail(courseId: string, s3BucketData: S3BucketData): Observable<AmberResponse<FlattenedCourseDetails>> {
    const url = `${this.environment.amberBaseUrl}/api/solar/course/thumbnail/upload`;

    const updateObj = {
      id: courseId,
      thumbnailKey: s3BucketData.key,
      thumbnailBucket: s3BucketData.bucket,
    };
    return this.http.post<AmberResponse<FlattenedCourseDetails>>(url, updateObj);
  }

  getTrainingManagers(): Observable<AmberResponse<TrainingManager[]>> {
    const url = `${this.environment.amberBaseUrl}/api/agora/employee/training/managers/list?showEmployeeId=true`;

    const params = new HttpParams();
    return this.http.get<AmberResponse<TrainingManager[]>>(url, { params });
  }

  getInstructors(): Observable<ILTInstructor[]> {
    const url = `${this.environment.amberBaseUrl}/api/solar/instructor/list`;

    const params = new HttpParams();
    return this.http
      .get<AmberResponse<ILTInstructor[]>>(url, { params })
      .pipe(map((t) => t.data));
  }

  addInstructor(data: ILTInstructor): Observable<ILTInstructor> {
    const url = `${this.environment.amberBaseUrl}/api/solar/instructor/add`;

    return this.http.post<AmberResponse<ILTInstructor>>(url, data).pipe(map((t) => t.data));
  }

  getILTVenueCountriesDictionary(): Observable<IKeyValuePair[]> {
    const url = `${this.environment.amberBaseUrl}/api/solar/address/country/dictionary?$country=1`;

    const params = new HttpParams();
    return this.http
      .get<AmberResponse<IKeyValuePair[]>>(url, { params })
      .pipe(map((t) => t.data));
  }

  getILTVenueCitiesDictionary(countryKey: string): Observable<IKeyValuePair[]> {
    const url = `${this.environment.amberBaseUrl}/api/solar/address/city/dictionary/${countryKey}?$city=1`;

    const params = new HttpParams();
    return this.http
      .get<AmberResponse<IKeyValuePair[]>>(url, { params })
      .pipe(map((t) => t.data));
  }

  getILTVenuesInCity(cityKey: string): Observable<Venue[]> {
    const url = `${this.environment.amberBaseUrl}/api/solar/address/filterable?@city=${cityKey}`;

    const params = new HttpParams();
    return this.http
      .get<AmberResponse<Venue[]>>(url, { params })
      .pipe(map((t) => t.data));
  }

  addVenue(data: Venue): Observable<Venue> {
    const url = `${this.environment.amberBaseUrl}/api/solar/address/add`;

    return this.http.post<AmberResponse<Venue>>(url, data).pipe(map((t) => t.data));
  }

  getDeliveryLanguages(): Observable<IKeyValuePair[]> {
    const url = `${this.environment.amberBaseUrl}/api/solar/partner/configuration/dictionary/delivery-languages?sortByValue=true`;

    const params = new HttpParams();
    return this.http
      .get<AmberResponse<IKeyValuePair[]>>(url, { params })
      .pipe(map((t) => t.data));
  }

  getEventActiveLearners(eventId: string, pageable?: IPageable): Observable<DeferredResource<IKeyValuePair[]>> {
    const url = `${this.environment.amberBaseUrl}/api/solar/classevent/learners/status?id=${eventId}&status=active&status=completed`;

    let params = new HttpParams();
    if (pageable.page) {
      params = params.append('page', pageable.page.toString());
    }
    if (pageable.limit) {
      params = params.append('limit', pageable.limit.toString());
    }
    if (pageable.filter) {
      params = params.append('filter', pageable.filter.toString());
    }
    return DeferredResourceUtils.wrapAmberObservableWithFlags(
      this.http.get<AmberResponse<IKeyValuePair[]>>(url, { params }),
    );
  }

  getEventPendingLearners(eventId: string, pageable?: IPageable): Observable<DeferredResource<IKeyValuePair[]>> {
    const url = `${this.environment.amberBaseUrl}/api/solar/classevent/learners/status?id=${eventId}&status=pending`;

    let params = new HttpParams();
    if (pageable.page) {
      params = params.append('page', pageable.page.toString());
    }
    if (pageable.limit) {
      params = params.append('limit', pageable.limit.toString());
    }
    if (pageable.filter) {
      params = params.append('filter', pageable.filter.toString());
    }
    return DeferredResourceUtils.wrapAmberObservableWithFlags(
      this.http.get<AmberResponse<IKeyValuePair[]>>(url, { params }),
    );
  }

  getEventWaitingListLearners(eventId: string, pageable?: IPageable): Observable<DeferredResource<IKeyValuePair[]>> {
    const url = `${this.environment.amberBaseUrl}/api/solar/classevent/learners/status?id=${eventId}&status=waiting-list`;

    let params = new HttpParams();
    if (pageable.page) {
      params = params.append('page', pageable.page.toString());
    }
    if (pageable.limit) {
      params = params.append('limit', pageable.limit.toString());
    }
    if (pageable.filter) {
      params = params.append('filter', pageable.filter.toString());
    }
    return DeferredResourceUtils.wrapAmberObservableWithFlags(
      this.http.get<AmberResponse<IKeyValuePair[]>>(url, { params }),
    );
  }

  getILTEventsFromCourse(courseId: string, pageable?: IPageable): Observable<DeferredResource<IKeyValuePair[]>> {
    const url = `${this.environment.amberBaseUrl}/api/solar/partner/course-event/parent/list/lite/${courseId}`;

    let params = new HttpParams();
    if (pageable.page) {
      params = params.append('page', pageable.page.toString());
    }
    if (pageable.limit) {
      params = params.append('limit', pageable.limit.toString());
    }
    if (pageable.filter) {
      params = params.append('filter', pageable.filter.toString());
    }
    return DeferredResourceUtils.wrapAmberObservableWithFlags(
      this.http.get<AmberResponse<IKeyValuePair[]>>(url, { params }),
    );
  }

  getMaterialCompletionReportList(
    eventId: string,
    variantSku: string,
    pageable?: IPageable,
  ): Observable<DeferredResource<{ data: MaterialCompletionReport[]; flags: { size: number } }>> {
    const url = `${this.environment.amberBaseUrl}/api/solar/partner/course-event/completion/report?courseEventId=${eventId}&materialSKU=${variantSku}`;

    let params = new HttpParams();
    if (pageable.page) {
      params = params.append('page', pageable.page.toString());
    }
    if (pageable.limit) {
      params = params.append('limit', pageable.limit.toString());
    }
    if (pageable.filter) {
      params = params.append('filter', pageable.filter.toString());
    }
    return DeferredResourceUtils.wrapAmberObservableWithFlags(
      this.http.get<AmberResponse<{ data: MaterialCompletionReport[]; flags: { size: number } }>>(url, { params }),
    );
  }

  getExamCompletionReportList(
    eventId: string,
    variantSku: string,
    pageable?: IPageable,
  ): Observable<DeferredResource<{ data: ExamCompletionReport[]; flags: { size: number } }>> {
    const url = `${this.environment.amberBaseUrl}/api/solar/partner/course-event/assessments/list/${eventId}?examVariantSKU=${variantSku}`;

    let params = new HttpParams();
    if (pageable.page) {
      params = params.append('page', pageable.page.toString());
    }
    if (pageable.limit) {
      params = params.append('limit', pageable.limit.toString());
    }
    if (pageable.filter) {
      params = params.append('filter', pageable.filter.toString());
    }
    return DeferredResourceUtils.wrapAmberObservableWithFlags(
      this.http.get<AmberResponse<{ data: ExamCompletionReport[]; flags: { size: number } }>>(url, { params }),
    );
  }

  assignLearners(eventId: string, data: string[]): Observable<AssignLearnersResponse> {
    const url = `${this.environment.amberBaseUrl}/api/solar/course-event/learners/add/${eventId}`;

    return this.http.post<AmberResponse<AssignLearnersResponse>>(url, data).pipe(map((t) => t.data));
  }

  uploadLearnerCSV(eventId: string, data: ILTEventLearner[]): Observable<AssignLearnersResponse> {
    const url = `${this.environment.amberBaseUrl}/api/solar/partner/course-event/upload/learner/csv/${eventId}`;

    return this.http.post<AmberResponse<AssignLearnersResponse>>(url, data).pipe(map((t) => t.data));
  }

  removeLearner(eventId: string, data: string[]): Observable<AssignLearnersResponse> {
    const url = `${this.environment.amberBaseUrl}/api/solar/course-event/learners/remove/${eventId}`;

    const params = new HttpParams();
    return this.http
      .post<AmberResponse<AssignLearnersResponse>>(url, data, {
        params,
      })
      .pipe(map((t) => t.data));
  }

  approveLearner(body: { username: string; courseEventId: string }): Observable<AssignLearnersResponse> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/course-event/learners/approve');

    return this.http.post<AmberResponse<AssignLearnersResponse>>(url, body).pipe(map((t) => t.data));
  }

  rejectLearner(data: {
    username: string;
    courseEventId: string;
    message: string;
  }): Observable<AssignLearnersResponse> {
    const url = `${this.environment.amberBaseUrl}/api/solar/course-event/learners/reject`;

    const params = new HttpParams();
    return this.http
      .post<AmberResponse<AssignLearnersResponse>>(url, data, {
        params,
      })
      .pipe(map((t) => t.data));
  }

  promoteLearner(classEventId: string, data: { username: string }): Observable<AssignLearnersResponse> {
    const url = `${this.environment.amberBaseUrl}/api/solar/partner/course-event/learners/waiting/promote/${classEventId}`;

    const params = new HttpParams();
    return this.http
      .post<AmberResponse<AssignLearnersResponse>>(url, data, {
        params,
      })
      .pipe(map((t) => t.data));
  }

  demoteLearner(classEventId: string, data: { username: string }): Observable<AssignLearnersResponse> {
    const url = `${this.environment.amberBaseUrl}/api/solar/partner/course-event/learners/waiting/demote/${classEventId}`;

    const params = new HttpParams();
    return this.http
      .post<AmberResponse<AssignLearnersResponse>>(url, data, {
        params,
      })
      .pipe(map((t) => t.data));
  }

  getCountryDictionary(): Observable<IKeyValuePair[]> {
    const url = `${this.environment.amberBaseUrl}/api/agora/country/dictionary?verbose=true&type=api`;

    const params = new HttpParams();
    return this.http
      .get<AmberResponse<IKeyValuePair[]>>(url, { params })
      .pipe(
        map((t) =>
          Object.keys(t.data).map((k) => {
            return { key: k, value: t.data[k] };
          }),
        ),
      );
  }

  getStateDictionary(country: string): Observable<IKeyValuePair[]> {
    const url = `${this.environment.saharaUrl}/api/location/state/dictionary/${country}?verbose=true&type=api`;

    const params = new HttpParams();
    return this.http
      .get<AmberResponse<IKeyValuePair[]>>(url, { params })
      .pipe(map((t) => t.data));
  }

  validateLearnerCSV(
    courseEventId: string,
    data: { bucket: string; key: string },
    isForWaitingList?: boolean,
  ): Observable<UploadLearnerResponse> {
    const url = `${this.environment.amberBaseUrl}/api/solar/partner/course-event/upload/learner/csv/validate/${courseEventId}`;

    const params = new HttpParams({ fromObject: isForWaitingList ? { isForWaitingList: 'true' } : {} });

    return this.http
      .post<AmberResponse<UploadLearnerResponse>>(url, data, { params })
      .pipe(map((t) => t.data));
  }

  validateLearners(courseEventId: string, data: string[]): Observable<LearnersValidationResponse> {
    const url = `${this.environment.amberBaseUrl}/api/solar/partner/course-event/assign/learners/pre-validate/${courseEventId}`;

    return this.http.post<AmberResponse<LearnersValidationResponse>>(url, data).pipe(map((t) => t.data));
  }

  validateLearnerSession(parentId: string, emails: string[]): Observable<IKeyValuePair[]> {
    const encodedEmails = emails.map((mail) => encodeURIComponent(mail));
    const url = `${
      this.environment.amberBaseUrl
    }/api/solar/partner/course-event/join/validate/${parentId}?emails=${encodedEmails.join(',')}`;

    return this.http.get<AmberResponse<IKeyValuePair[]>>(url).pipe(map((t: { data: IKeyValuePair[] }) => t.data));
  }

  learnersBulkImport(data: { key: string; bucket: string }, eventId: string): Observable<LearnersBulkImportResponse[]> {
    const url = `${this.environment.amberBaseUrl}/api/solar/course-event/learners/bulk-import/${eventId}`;

    return this.http.post<AmberResponse<LearnersBulkImportResponse[]>>(url, data).pipe(map((t) => t.data));
  }

  getILTEventAttendancesByUsers(
    eventId: string,
    pageable?: IPageable,
  ): Observable<DeferredResource<{ data: ILTEventAttendancesByUser[]; flags: { size: number } }>> {
    const url = this.adminPanelApiService.prepareURL(
      `/api/solar/partner/course-event/learners/attendance/details/${eventId}`,
    );

    const params = this.adminPanelApiService.prepareParams(pageable);

    return this.adminPanelApiService.getWithFlags<ILTEventAttendancesByUser[]>(url, new HttpHeaders({}), params);
  }

  updateILTEventAttendance(eventId: string, data: ILTEventAttendanceUpdatePayload): Observable<ILTEventAttendance> {
    const url = this.adminPanelApiService.prepareURL(
      `/api/solar/partner/course-event/learners/attendance/details/${eventId}`,
    );

    const params = new HttpParams();

    return this.http
      .post<AmberResponse<ILTEventAttendance>>(url, data, { params })
      .pipe(map((t) => t.data));
  }

  completeILTEventAttendance(eventId: string, data: ILTEventAttendanceCompletionPayload): Observable<ILTEvent> {
    const url = this.adminPanelApiService.prepareURL(`/api/solar/course-event/learners/attendance/${eventId}`);

    const params = new HttpParams();

    return this.http
      .post<AmberResponse<ILTEvent>>(url, data, { params })
      .pipe(map((t) => t.data));
  }

  validateBulkILTEventAttendanceCompletion(eventId: string, data: string[], allUsers?: boolean): Observable<string[]> {
    const url = this.adminPanelApiService.prepareURL(
      `/api/solar/partner/course-event/learners/attendance/validate-before-completion/${eventId}`,
    );

    const params = new HttpParams().append('allUsers', `${allUsers}`);

    return this.http
      .post<AmberResponse<string[]>>(url, data, { params })
      .pipe(map((t) => t.data));
  }

  markBulkAttendance(
    eventId: string,
    data: ILTEventBulkMarkAttendancesPayload,
  ): Observable<ILTEventBulkMarkAttendancesPayload> {
    const url = this.adminPanelApiService.prepareURL(
      `/api/solar/partner/course-event/learners/attendance/bulk/${eventId}`,
    );

    const params = new HttpParams();

    return this.http
      .post<AmberResponse<ILTEventBulkMarkAttendancesPayload>>(url, data, { params })
      .pipe(map((t) => t.data));
  }

  getCertificatesList(): Observable<DeferredResource<IConfigCertificatesDictionary[]>> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/partner/certificates/cert-dictionary');

    const params = this.adminPanelApiService.prepareParams();

    return this.adminPanelApiService.get<IConfigCertificatesDictionary[]>(url, new HttpHeaders({}), params);
  }

  getConferencingToolsDictionary(): Observable<DeferredResource<ConferencingTool[]>> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/partner/authorization/dictionary');

    const params = this.adminPanelApiService.prepareParams();

    return this.adminPanelApiService.get<ConferencingTool[]>(url, new HttpHeaders({}), params);
  }

  getDraftEventsByCourse(courseId: string): Observable<DeferredResource<ILTEvent[]>> {
    const url = this.adminPanelApiService.prepareURL(
      `/api/solar/partner/course-event/parent/course/draft/list/${courseId}`,
    );

    const params = this.adminPanelApiService.prepareParams();

    return this.adminPanelApiService.get<ILTEvent[]>(url, new HttpHeaders({}), params);
  }
}
