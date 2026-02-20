import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreadcrumbItem } from '../../../models/common/breadcrumb.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent } from '../../_shared/breadcrumb/breadcrumb.component';
import { ContactUsPage } from '../../../models/cms/contact-us';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { CMSService } from '../../../services/cms/cms.service';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule, RouterModule, BreadcrumbComponent],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent implements OnInit, OnDestroy {
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', url: '/' },
    { label: 'Contact Us', isActive: true }
  ];

  contactData: ContactUsPage | null = null;
  mapUrl: SafeResourceUrl | null = null;
  loading = false;
  error = false;
  private sub = new Subscription();

  constructor(private cms: CMSService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.fetchContactUsContent();
  }
  fetchContactUsContent() {
    this.loading = true;
    this.sub.add(
      this.cms.getContactUs().subscribe({
        next: data => {
          this.contactData = data;
          // if (data?.mapEmbedUrl && data?.mapLatitude && data?.mapLongitude) {
          //   const url = `https://maps.google.com/maps?q=${data.mapLatitude},${data.mapLongitude}&z=15&output=embed`;
          //   this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
          // } else {
          //   this.mapUrl = null;
          // }
          this.loading = false;
        },
        error: () => {
          this.error = true;
          this.loading = false;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
