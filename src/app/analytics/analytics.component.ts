import { Component, ViewChild, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { AnalyticsService } from 'src/app/analytics/analytics.service';
import { CurrentIndicators } from 'src/app/analytics/current-indicators';
import { ActivatedRoute } from '@angular/router';
import { tap, catchError } from 'rxjs/operators';
import swal from 'sweetalert2';

@Component({
  selector: 'analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})

export class AnalyticsComponent implements OnInit {

  datos: CurrentIndicators = new CurrentIndicators();
  dataSource = null;
  currentDate = new Date();
  loading: boolean = false;
  notAvailableIndicators: boolean = false;
  apiNotAvailableErr = '';

  constructor(private analyticsService: AnalyticsService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.loading = true;

    this.activatedRoute.params.subscribe(params => {
      let asset = params['asset']
      if (asset) {
        this.analyticsService.getCurrentIndicators(asset)
          .pipe(
            tap(indicators => {
              this.datos = indicators;

              if (this.datos['ma-and-price-position'] === '' && this.datos['three-ma'] === ''
                && this.datos['news-emotions'] === '' && this.datos['three-ma-and-news-emotions']) {
                this.notAvailableIndicators = true;
              }

              console.log('AnalyticsComponent: registered');
              this.loading = false;
            }),
            catchError(e => {

              // esto viene del backend
              if (e.status == 500) {
                // se puede mostrar el propio error del backend con e.error o e.error.message
                this.apiNotAvailableErr = 'Api Alphavantage no disponible temporalmente';
              }

              console.error(e.error);
              // swal.fire('Conexión fallida', e.error, 'error');

              this.loading = false;
              return throwError(e);
            })
          ).subscribe();
      }
    })
  }
}
