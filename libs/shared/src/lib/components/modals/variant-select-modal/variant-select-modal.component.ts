import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {ConfigDto, InternalRepositoryDTO} from "../../../models";

export interface VariantSelectModalFormValue {
  variantId: number;
  language: string;
  delivery: string;
}

@Component({
  selector: 'leap-variant-select-modal',
  templateUrl: './variant-select-modal.component.html',
  styleUrls: ['./variant-select-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class VariantSelectModalComponent implements OnInit {
  public form: FormGroup;

  @Input() public readonly variantOptions: InternalRepositoryDTO[];
  @Input() public readonly initFormValue: {
    variantId: number;
    name: string;
    language: ConfigDto;
    type: ConfigDto;
  };

  languageList: ConfigDto[] = [];
  deliveryFormatList: ConfigDto[] = [];

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    const { variantId, language, type } = this.initFormValue;
    this.createLists();

    this.form = this.fb.group({
      variantId: [variantId, Validators.required],
      language: [
        this.languageList.length === 1 ? this.languageList[0].configKey : language.configKey,
        Validators.required,
      ],
      delivery: [
        this.deliveryFormatList.length === 1 ? this.deliveryFormatList[0].configKey : type.configKey,
        Validators.required,
      ],
    });

    this.form
      .get('language')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((lang: string) => {
        this.createLists(lang);
      });

    this.form
      .get('delivery')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((delivery: string) => {
        this.createLists(null, delivery);
      });
  }

  private createLists(setLang?: string, setDelivery?: string): void {
    this.variantOptions.map((dto) => {
      if (
        !this.languageList.some((lang: ConfigDto) => lang.configKey === dto.language.configKey) &&
        (setDelivery ? dto.type.configKey === setDelivery : true)
      ) {
        this.languageList.push(dto.language);
      }

      if (
        !this.deliveryFormatList.some((type: ConfigDto) => type.configKey === dto.type.configKey) &&
        (setLang ? dto.language.configKey === setLang : true)
      ) {
        this.deliveryFormatList.push(dto.type);
      }
    });
  }
}
