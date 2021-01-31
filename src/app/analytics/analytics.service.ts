import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { CurrentIndicators } from './current-indicators';
import { Strategies } from './strategies';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private marketEmotionsUrl: string = 'http://192.168.68.223:8080/marketemotions/analytics';

  constructor(private http: HttpClient) { }

  getCurrentIndicators(asset: string): Observable<CurrentIndicators> {
    return this.http.get(this.marketEmotionsUrl + "/" + `${asset}`).pipe(
      map(response => {
        let indicators = response as CurrentIndicators;
        return indicators;
      })
    );
  }

  analyzeTrend(asset: string, from: string, to: string): Observable<Strategies> {
    return this.http.get(this.marketEmotionsUrl + "/" + `${asset}` + "/" + `${from}` + "/" + `${to}`).pipe(
      map(response => {
        let indicators = response as Strategies;
        return indicators;
      })
    );
  }
}
