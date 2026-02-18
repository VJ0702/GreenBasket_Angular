import { Component, Input, OnInit, OnChanges, SimpleChanges, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BreadcrumbItem } from '../../../models/common/breadcrumb.model';
import { BreadcrumbService } from '../../../services/common-services/breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css'
})
export class BreadcrumbComponent implements OnInit, OnChanges {
  /**
   * Page title displayed on the left side of breadcrumb section
   */
  @Input() pageTitle: string = '';

  /**
   * Array of breadcrumb items
   * Last item should have url: null (current page)
   */
  @Input() items: BreadcrumbItem[] = [];

  /**
   * Whether to include structured data (JSON-LD) for SEO
   * Defaults to true
   */
  @Input() includeStructuredData: boolean = true;

  private isBrowser: boolean;
  private scriptElement: HTMLScriptElement | null = null;

  constructor(
    private breadcrumbService: BreadcrumbService,
    @Inject(PLATFORM_ID) platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.updateStructuredData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items'] || changes['includeStructuredData']) {
      this.updateStructuredData();
    }
  }

  /**
   * Update or inject structured data script into the document head
   */
  private updateStructuredData(): void {
    if (!this.isBrowser) return;

    // Remove existing script if present
    this.removeStructuredData();

    if (this.includeStructuredData && this.items.length > 0) {
      const jsonLd = this.breadcrumbService.generateStructuredData(this.items);

      this.scriptElement = this.document.createElement('script');
      this.scriptElement.type = 'application/ld+json';
      this.scriptElement.id = 'breadcrumb-structured-data';
      this.scriptElement.text = jsonLd;
      this.document.head.appendChild(this.scriptElement);
    }
  }

  /**
   * Remove structured data script from document head
   */
  private removeStructuredData(): void {
    if (!this.isBrowser) return;

    const existingScript = this.document.getElementById('breadcrumb-structured-data');
    if (existingScript) {
      existingScript.remove();
    }
    this.scriptElement = null;
  }

  ngOnDestroy(): void {
    this.removeStructuredData();
  }
}
