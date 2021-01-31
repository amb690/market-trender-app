import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AssetsComponent } from './assets/assets.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { AssetsService } from './assets/assets.service';
import { AnalyticsService } from 'src/app/analytics/analytics.service';
import { RouteReuseStrategy } from '@angular/router';
import { CustomReuseStrategy } from 'src/app/assets/reuse-strategy';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'assets' },
  { path: 'assets', component: AssetsComponent, data: { shouldDetach: true } },
  { path: 'analytics/:asset', component: AnalyticsComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AssetsComponent,
    AnalyticsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatSortModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  providers: [AssetsService, AnalyticsService, { provide: RouteReuseStrategy, useClass: CustomReuseStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
