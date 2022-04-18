import { Injectable } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import {
  FormValue,
  IConfigType,
  InternalRepository,
  InternalRepositoryCourseListItem,
  InternalRepositoryDTO,
  InternalRepositoryVariantDTO,
  IPageable,
  IRContent,
  IRCreatePayload
} from "../../../models";
import { DeferredResource } from "../../../utils/common";
import { AdminPanelApiService } from "../../common/admin-panel-api.service";

@Injectable({
  providedIn: 'root',
})
export class InternalRepositoryService {
  constructor(private readonly adminPanelApiService: AdminPanelApiService) {}

  getInternalRepositories(
    pageable?: IPageable,
  ): Observable<DeferredResource<{ data: InternalRepository[]; flags: { size: number } }>> {
    const url = this.adminPanelApiService.prepareURL(
      '/api/solar/partner/content-indentifier/details/list?status=internal-repository-available',
    );

    const params = this.adminPanelApiService.prepareParams(pageable);
    return this.adminPanelApiService.getWithFlags<InternalRepository[]>(url, new HttpHeaders({}), params);
  }

  getInternalRepositoryDetails(sku: string): Observable<DeferredResource<InternalRepository>> {
    const url = this.adminPanelApiService.prepareURL(`/api/solar/partner/content-identifier/rich/details/${sku}`);

    const params = this.adminPanelApiService.prepareParams();

    return this.adminPanelApiService.get<InternalRepository>(url, new HttpHeaders({}), params);
  }

  getInternalRepositoryVariants(
    sku: string,
    pageable: IPageable,
  ): Observable<
    DeferredResource<{
      data: InternalRepositoryVariantDTO[];
      flags: { size: number };
    }>
  > {
    const url = this.adminPanelApiService.prepareURL('/api/solar/partner/course-material/variants');

    const params = this.adminPanelApiService.prepareParams(pageable).append('sku', sku.toString());

    return this.adminPanelApiService.getWithFlags<InternalRepositoryVariantDTO[]>(url, new HttpHeaders({}), params);
  }

  getInternalRepositoryCourses(
    sku: string,
    pageable: IPageable,
  ): Observable<DeferredResource<{ data: InternalRepositoryCourseListItem[]; flags: { size: number } }>> {
    const url = this.adminPanelApiService.prepareURL(`/api/solar/partner/content-identifier/list/courses/${sku}`);

    const params = this.adminPanelApiService.prepareParams(pageable).append('sku', sku.toString());

    return this.adminPanelApiService.getWithFlags<InternalRepositoryCourseListItem[]>(url, new HttpHeaders({}), params);
  }

  createInternalRepository(data: IRCreatePayload): Observable<DeferredResource<InternalRepositoryDTO>> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/partner/content-identifier/propagate/create');

    return this.adminPanelApiService.post<InternalRepositoryDTO, IRCreatePayload>(url, new HttpHeaders({}), data);
  }

  createInternalRepositoryVariant(data: IRCreatePayload): Observable<DeferredResource<InternalRepositoryDTO>> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/partner/course-material/variants/add');

    return this.adminPanelApiService.post<InternalRepositoryDTO, IRCreatePayload>(url, new HttpHeaders({}), data);
  }

  editInternalRepositoryVariant(data: IRCreatePayload): Observable<DeferredResource<InternalRepositoryDTO>> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/partner/course-material/variants/edit');

    return this.adminPanelApiService.post<InternalRepositoryDTO, IRCreatePayload>(url, new HttpHeaders({}), data);
  }

  deleteInternalRepositoryVariant(sku: string): Observable<DeferredResource<InternalRepositoryVariantDTO>> {
    const url = this.adminPanelApiService.prepareURL(`/api/solar/partner/content-identifier/soft/delete/${sku}`);

    return this.adminPanelApiService.post<InternalRepositoryVariantDTO, Record<string, never>>(
      url,
      new HttpHeaders({}),
      {},
    );
  }

  deleteInternalRepository(sku: string): Observable<DeferredResource<{ masterSku: string }>> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/partner/course-material/delete');

    return this.adminPanelApiService.post<{ masterSku: string }, { masterSku: string }>(url, new HttpHeaders({}), {
      masterSku: sku,
    });
  }

  getDeliverableRequirements(type: string): Observable<DeferredResource<InternalRepository>> {
    const url = this.adminPanelApiService.prepareURL(`/api/solar/deliverable/spec/type/${type}`);
    const params = this.adminPanelApiService.prepareParams();
    return this.adminPanelApiService.get<InternalRepository>(url, new HttpHeaders({}), params);
  }

  preparePayload(
    formValue: FormValue,
    exam: IRContent,
    selectedLangKey: string,
    deliverableId?: number,
    itemId?: number,
  ): IRCreatePayload {
    if (formValue.type.key === 'exam') {
      return {
        name: formValue.name,
        language: {
          configKey: exam.language.configKey,
        },
        type: {
          configKey: formValue.type.key,
          configValue: formValue.type.key,
        },
        mainDeliverables: [
          {
            contents: [{ id: formValue.exam, name: exam.name }],
            id: deliverableId,
          },
        ],
        deliverableId,
      } as IRCreatePayload;
    }
    const isExternalLink = formValue.type.key === 'externalLink' || formValue.externalLink;
    const externalMainDeliverables = {
      contents: [
        {
          name: formValue.name,
          externalID: formValue.externalLink,
          hosted: false,
          type: {
            configKey: 'ext-content-link',
            configValue: 'External content',
          },
          id: itemId,
        },
      ],
      id: deliverableId,
    };

    return {
      name: formValue.name,
      language: {
        configKey: selectedLangKey,
        configValue: formValue.languages,
      },
      type: {
        configKey: formValue[isExternalLink ? 'externalLinkType' : 'type'].key,
        configValue: formValue[isExternalLink ? 'externalLinkType' : 'type'].key,
      },
      mainDeliverables: [isExternalLink ? externalMainDeliverables : this.getDeliverables(formValue)],
    } as IRCreatePayload;
  }

  getDeliverables(input: FormValue): Record<string, unknown> {
    const response = {
      name: input.name,
      displayName: input.name,
      order: 0,
      contents: input._contents,
      type: this.deliverableDictionary(input.type),
    };

    response.contents.forEach((content, index) => {
      content.type = this.contentDictionary(response.type.configKey);
      content.order = index;
    });
    return response;
  }

  deliverableDictionary(materialType: { key: string }): IConfigType {
    switch (materialType.key.toLowerCase()) {
      case 'coursebook':
        return {
          configKey: 'instructorguide',
          configValue: 'PDF',
          configType: 'deliverabletype',
        };
      case 'elearning':
        return {
          configKey: 'scormcloud',
          configValue: 'SCORM',
          configType: 'deliverabletype',
        };
      case 'presentation':
        return {
          configKey: 'googleslides',
          configValue: 'Presentation',
          configType: 'deliverabletype',
        };
      case 'video':
        return {
          configKey: 'video',
          configValue: 'Video',
          configType: 'deliverabletype',
        };
      case 'exam':
        return {
          configKey: 'exam',
          configValue: 'Exam',
          configType: 'deliverabletype',
        };
      default:
        throw new Error(`Unknown material mapping: ${materialType}`);
    }
  }

  contentDictionary(deliverableKey: string): IConfigType {
    switch (deliverableKey.toLowerCase()) {
      case 'instructorguide':
      case 'ebook':
        return {
          configKey: 'pdfebook',
          configValue: 'eBook',
          configType: 'contenttype',
        };
      case 'scormcloud':
        return {
          configKey: 'scorm-content',
          configValue: 'SCORM',
          configType: 'contenttype',
        };
      case 'googleslides':
        return {
          configKey: 'presentation',
          configValue: 'Presentation',
          configType: 'contenttype',
        };
      case 'video':
        return {
          configKey: 'video',
          configValue: 'Video',
          configType: 'contenttype',
        };
      default:
        throw new Error(`Unknown material mapping: ${deliverableKey}`);
    }
  }

  updateParentInternalRepository(
    internalRepository: InternalRepository,
  ): Observable<DeferredResource<InternalRepository>> {
    const url = this.adminPanelApiService.prepareURL('/api/library/internal/repository/parent/edit/bysku');

    return this.adminPanelApiService.post<InternalRepository, InternalRepository>(
      url,
      new HttpHeaders({}),
      internalRepository,
    );
  }

  saveInternalRepository(
    formValue: FormValue,
    exam: IRContent,
    selectedLangKey: string,
    parentSKU: string,
    sku: string,
    deliverableId?: number,
    itemId?: number,
  ): Observable<DeferredResource<InternalRepositoryDTO>> {
    const payload = this.preparePayload(formValue, exam, selectedLangKey, deliverableId, itemId);
    if (parentSKU) {
      payload.parentSKU = parentSKU;
    }
    if (sku) {
      payload.sku = sku;
    }

    if (!sku) {
      return !parentSKU ? this.createInternalRepository(payload) : this.createInternalRepositoryVariant(payload);
    } else {
      return this.editInternalRepositoryVariant(payload);
    }
  }
}
