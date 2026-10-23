import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DsaAppShellComponent } from '@dsa/design-system-angular';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterOutlet, DsaAppShellComponent],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {}
