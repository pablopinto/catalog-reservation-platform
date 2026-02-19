import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { DemoStateService } from './core/demo-state.service';
import { I18nService } from './core/i18n.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  demo = inject(DemoStateService);
  i18n = inject(I18nService);
  private router = inject(Router);

  onRoleChange(role: 'operator' | 'client') {
    this.demo.setRole(role);
    this.router.navigateByUrl(role === 'operator' ? '/operator/dashboard' : '/client/catalog');
  }
}
