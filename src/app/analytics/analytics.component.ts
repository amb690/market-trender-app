import { Component, ViewChild, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { AnalyticsService } from 'src/app/analytics/analytics.service';
import { CurrentIndicators } from 'src/app/analytics/current-indicators';
import { Strategies } from 'src/app/analytics/strategies';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { tap, catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})

export class AnalyticsComponent implements OnInit {

  datos: CurrentIndicators = new CurrentIndicators();
  trends: Strategies = new Strategies();
  dataSource = null;
  currentDate = new Date();
  loading: boolean = false;
  loadingAnalysis: boolean = false;
  notAvailableIndicators: boolean = false;
  availableTrends: boolean = false;
  apiNotAvailableErr = '';
  asset = '';

  period: FormGroup;
  fromStr: string;
  toStr: string;

  constructor(private analyticsService: AnalyticsService,
    private activatedRoute: ActivatedRoute, private datePipe: DatePipe) {
    const today = new Date();
    const day = today.getDay();
    const month = today.getMonth();
    const year = today.getFullYear();

    this.period = new FormGroup({
      start: new FormControl(new Date(year, month, day)),
      end: new FormControl(new Date(year, month, day))
    });
  }

  ngOnInit(): void {

    this.loading = true;

    this.activatedRoute.params.subscribe(params => {
      this.asset = params['asset']
      if (this.asset) {
        this.analyticsService.getCurrentIndicators(this.asset)
          .pipe(
            tap(indicators => {
              this.datos = indicators;

              if (this.datos['ma-and-price-position'] == "" && this.datos['three-ma'] == ""
                && this.datos['news-emotions'] == "" && this.datos['three-ma-and-news-emotions'] == "") {
                this.notAvailableIndicators = true;
              }

              console.log('AnalyticsComponent: registered');
              this.loading = false;
            }),
            catchError(e => {

              // esto viene del backend
              if (e.status == 500) {
                // se puede mostrar el propio error del backend con e.error o e.error.message
                this.apiNotAvailableErr = 'Api no disponible temporalmente';
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

  analyzeTrend() {
    this.fromStr = this.datePipe.transform(this.period.value.start, "yyyy-MM-dd");
    this.toStr = this.datePipe.transform(this.period.value.end, "yyyy-MM-dd");
    this.loadingAnalysis = true;

    if (this.asset && this.fromStr && this.toStr) {
      this.analyticsService.analyzeTrend(this.asset, this.fromStr, this.toStr)
        .pipe(
          tap(trends => {
            this.trends = trends;
            this.availableTrends = true;

            console.log('AnalyticsComponent: registered');
            this.loadingAnalysis = false;
          }),
          catchError(e => {

            // esto viene del backend
            if (e.status == 500) {
              // se puede mostrar el propio error del backend con e.error o e.error.message
              this.apiNotAvailableErr = 'Api no disponible temporalmente';
            }

            console.error(e.error);
            // swal.fire('Conexión fallida', e.error, 'error');

            this.loadingAnalysis = false;
            return throwError(e);
          })
        ).subscribe();
    }
  }
}
