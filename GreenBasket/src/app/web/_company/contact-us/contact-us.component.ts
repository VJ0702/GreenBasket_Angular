import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreadcrumbItem } from '../../../models/common/breadcrumb.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent } from '../../_shared/breadcrumb/breadcrumb.component';
import { ContactRequest, ContactUsPage } from '../../../models/cms/contact-us';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { CMSService } from '../../../services/cms/cms.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../services/common-services/toast.service';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule, RouterModule, BreadcrumbComponent, ReactiveFormsModule],
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
  form: FormGroup;
  submitting = false;
  private sub = new Subscription();

  constructor(private cms: CMSService, private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', []],
      company: ['', []],
      subject: ['', []],
      message: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

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

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.warning('Please fill required fields correctly.');
      return;
    }
    this.submitting = true;
    const payload: ContactRequest = {
      name: this.form.value.name,
      email: this.form.value.email,
      phone: this.form.value.phone || null,
      company: this.form.value.company || null,
      subject: this.form.value.subject || null,
      inquiryType: "General",
      message: this.form.value.message,
      sourceUrl: window.location.href,
      referrer: document.referrer || null
    };
    this.sub.add(
      this.cms.postContact(payload).subscribe({
        next: res => {
          this.toast.success(res.message || 'Your inquiry has been submitted successfully');
          // Optionally show reference number
          if (res.data?.referenceNumber) {
            this.toast.info(`Reference: ${res.data.referenceNumber}`);
          }
          this.form.reset();
          this.submitting = false;
        },
        error: err => {
          const msg = err?.error?.message || 'Unable to submit inquiry. Please try again later.';
          this.toast.error(msg);
          this.submitting = false;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
