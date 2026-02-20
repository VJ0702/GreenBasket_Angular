import { Injectable } from '@angular/core';
import { ContactUsPage } from '../../models/cms/contact-us';
import { map, Observable, shareReplay } from 'rxjs';
import { ApiService } from '../common-services/api.service';
import { ApiResponse } from '../../models/common/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class CMSService {
  // API Endpoints
  private readonly contactUsPageContent = 'api/CMS/contact-us';

  private contactUsCache$?: Observable<ContactUsPage>;

  constructor(private apiService: ApiService) { }

  getContactUs(): Observable<ContactUsPage> {
    if (!this.contactUsCache$) {
      this.contactUsCache$ = this.apiService
        .get<ApiResponse<ContactUsPage>>(`${this.contactUsPageContent}`)
        .pipe(
          map(res => res?.data as ContactUsPage),
          shareReplay(1)
        );
    }
    return this.contactUsCache$;
  }
}
