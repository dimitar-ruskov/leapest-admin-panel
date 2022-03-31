import { Component, OnInit, ChangeDetectionStrategy, HostListener, Renderer2, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'leap-user-menu-item',
  templateUrl: './user-menu-item.component.html',
  styleUrls: ['./user-menu-item.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserMenuItemComponent implements OnInit {

  @Input() title : string;
  @Input() svgTemplate : any;
  @Input() hoverClass = '';
  @Input() stickToRightEdge : boolean = true;

  securedSvg : SafeHtml;
  isHovering = false;

  constructor(private sanitizer: DomSanitizer, private renderer: Renderer2)
  {}

  ngOnInit(): void {
    if (this.svgTemplate) {
      this.securedSvg = this.sanitizer.bypassSecurityTrustHtml(this.svgTemplate);
    }
  }

  @HostListener('mouseenter', ['$event'])
  onMouseOver(event) {
    this.isHovering = true;
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(event) {
    this.isHovering = false;
  }

  @HostListener('click', ['$event'])
  onMouseClick(event) {
    setTimeout(_ => this.isHovering = false, 1000);
  }

}
