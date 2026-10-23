import { Routes } from '@angular/router';
import { CampaignDetailComponent } from './campaign-detail/campaign-detail.component';

export const routes: Routes = [
  { path: 'campaigns/:id', component: CampaignDetailComponent },
  { path: '', redirectTo: 'campaigns/c-1', pathMatch: 'full' },
];
