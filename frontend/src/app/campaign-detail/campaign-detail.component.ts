import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DsaBadgeComponent } from '@dsa/design-system-angular/badge';
import { DsaButtonComponent } from '@dsa/design-system-angular/button';
import { DsaFormFieldModule } from '@dsa/design-system-angular/form-field';
import { DsaInputFieldModule } from '@dsa/design-system-angular/input-field';
import { DsaInfoCardModule } from '@dsa/design-system-angular/info-card';
import { DsaLinearProgressIndicatorComponent } from '@dsa/design-system-angular/linear-progress-indicator';
import { DsaTableModule } from '@dsa/design-system-angular/table';
import { DsaSelectComponent } from '@dsa/design-system-angular/select';

@Component({
  selector: 'app-campaign-detail',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FormsModule,
    DsaBadgeComponent,
    DsaButtonComponent,
    DsaFormFieldModule,
    DsaInputFieldModule,
    DsaSelectComponent,
    DsaInfoCardModule,
    DsaLinearProgressIndicatorComponent,
    DsaTableModule,
  ],
  templateUrl: './campaign-detail.component.html',
  styleUrl: './campaign-detail.component.scss',
})
export class CampaignDetailComponent implements OnInit {
  campaign: any;
  lineItems: any[] = [];
  budget: any;
  original: any;
  errors: any = {};
  saving = false;
  message = '';
  allocatedTotal = 0;
  remaining = 0;
  validFromText = '';
  validToText = '';
  statusLabel = '';
  canActivate = false;
  regionsText = '';
  storesText = '';
  dirty = false;
  statusItems: any[] = [
    { label: 'DRAFT' },
    { label: 'SCHEDULED' },
    { label: 'ACTIVE' },
    { label: 'ARCHIVED' },
  ];
  statusItem: any;
  couponQuery = '';
  couponResults: any[] = [];
  couponSearching = false;

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((p) => {
      this.load(p['id']);
    });
  }

  load(id: string) {
    this.http.get('http://localhost:8085/campaign/get?id=' + id).subscribe((c: any) => {
      this.campaign = c;
      this.original = c;
      this.statusItem = this.statusItems.find((x) => x.label == c.status);
      this.regionsText = c.salesRegions.join(', ');
      this.storesText = c.storeIds.join(', ');
      this.validFromText = new Date(c.validFrom).toLocaleDateString('de-DE');
      this.validToText = new Date(c.validTo).toLocaleDateString('de-DE');
      if (c.status == 'ACTIVE') this.statusLabel = 'Aktiv';
      if (c.status == 'DRAFT') this.statusLabel = 'Entwurf';
      if (c.status == 'SCHEDULED') this.statusLabel = 'Geplant';
      if (c.status == 'ARCHIVED') this.statusLabel = 'Archiviert';
      this.http.get('http://localhost:8085/campaign/lineItems?id=' + id).subscribe((l: any) => {
        this.lineItems = l;
        this.recalc();
      });
      this.http.get('http://localhost:8085/campaign/budget?id=' + id).subscribe((b: any) => {
        this.budget = b;
        this.recalc();
      });
    });
  }

  recalc() {
    this.allocatedTotal = 0;
    for (let i = 0; i < this.lineItems.length; i++) {
      this.allocatedTotal += this.lineItems[i].allocation;
    }
    this.remaining = this.campaign.budgetTotal - this.allocatedTotal;
    this.canActivate =
      this.campaign.status == 'DRAFT' && this.remaining >= 0 && this.campaign.name.length > 0;
    this.dirty = JSON.stringify(this.campaign) != JSON.stringify(this.original);
  }

  onCouponQueryChange() {
    this.couponSearching = true;
    this.http
      .get('http://localhost:8085/campaign/searchCoupons?q=' + this.couponQuery)
      .subscribe((r: any) => {
        this.couponResults = r;
        this.couponSearching = false;
      });
  }

  addCoupon(k: any) {
    this.lineItems.push({ id: 'new-' + Math.random(), couponRef: k.code, weighting: 10, allocation: 0 });
    this.recalc();
  }

  clearCouponSearch() {
    this.couponQuery = '';
    this.couponResults = [];
  }

  onStatusChange(item: any) {
    this.statusItem = item;
    this.campaign.status = item ? item.label : null;
    this.load2();
  }

  load2() {
    if (this.campaign.status == 'ACTIVE') this.statusLabel = 'Aktiv';
    if (this.campaign.status == 'DRAFT') this.statusLabel = 'Entwurf';
    if (this.campaign.status == 'SCHEDULED') this.statusLabel = 'Geplant';
    if (this.campaign.status == 'ARCHIVED') this.statusLabel = 'Archiviert';
    this.recalc();
  }

  onNameChange() {
    this.campaign.name = this.campaign.name.trim();
    if (this.campaign.name.length < 3) this.errors.name = 'Name too short';
    else delete this.errors.name;
    this.recalc();
  }

  onBudgetChange() {
    if (this.campaign.budgetTotal < 0) this.errors.budget = 'Budget must be positive';
    else delete this.errors.budget;
    this.recalc();
  }

  onDatesChange() {
    if (this.campaign.validFrom > this.campaign.validTo) this.errors.dates = 'Invalid range';
    else delete this.errors.dates;
    this.validFromText = new Date(this.campaign.validFrom).toLocaleDateString('de-DE');
    this.validToText = new Date(this.campaign.validTo).toLocaleDateString('de-DE');
  }

  onWeightChange(li: any) {
    let sum = 0;
    this.lineItems.forEach((x) => (sum += x.weighting));
    li.allocation = (this.campaign.budgetTotal * li.weighting) / (sum || 1);
    this.recalc();
  }

  removeLineItem(i: number) {
    this.lineItems.splice(i, 1);
    this.recalc();
  }

  addLineItem() {
    this.lineItems.push({ id: 'new-' + Math.random(), couponRef: '', weighting: 10, allocation: 0 });
    this.recalc();
  }

  activate() {
    this.campaign.status = 'ACTIVE';
    this.save();
  }

  save() {
    if (Object.keys(this.errors).length > 0) return;
    this.saving = true;
    this.campaign.salesRegions = this.regionsText.split(',').map((s) => s.trim());
    this.campaign.storeIds = this.storesText.split(',').map((s) => s.trim());
    this.http.put('http://localhost:8085/campaign/update', this.campaign).subscribe((r: any) => {
      this.saving = false;
      this.message = 'Saved!';
      this.original = r;
    });
    for (const li of this.lineItems) {
      this.http.put('http://localhost:8085/campaign/updateLineItem', li).subscribe();
    }
  }
}
