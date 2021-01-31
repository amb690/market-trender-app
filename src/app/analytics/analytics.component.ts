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

  apiNotAvailableErr = '';

  constructor(private analyticsService: AnalyticsService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {
      let asset = params['asset']
      if (asset) {
        this.analyticsService.getCurrentIndicators(asset)
          .pipe(
            tap(indicators => {
              this.datos = indicators;
              console.log('AnalyticsComponent: registered');
            }),
            catchError(e => {

              // esto viene del backend
              if (e.status == 500) {
                // se puede mostrar el propio error del backend con e.error o e.error.message
                this.apiNotAvailableErr = 'Api Alphavantage no disponible temporalmente';
              }

              console.error(e.error);
              // swal.fire('Conexión fallida', e.error, 'error');
              return throwError(e);
            })
          ).subscribe();
      }
    })
  }
}
