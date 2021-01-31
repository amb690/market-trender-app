import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Asset } from './asset';

@Injectable({
  providedIn: 'root'
})
export class AssetsService {
  private newsEmotionsUrl: string = 'http://192.168.68.152:8080/asset';

  constructor(private http: HttpClient) { }

  getAssets(): Observable<Asset[]> {
    return this.http.get(this.newsEmotionsUrl).pipe(
      tap(response => {
        let assets = response as Asset[];
        console.log('AssetService: asset requested')
        assets.forEach(asset => {
          console.log(asset.name);
        })
      }),
      map(response => {
        let assets = response as Asset[];
        return assets.map(asset => {
          asset.exchange = asset.exchange != "null" ? asset.exchange : "";
          asset.sector = asset.sector != "null" ? asset.sector : "";
          return asset;
        });
      }),
      tap(response => {
        console.log('AssetService: response received');
        response.forEach(asset => {
          console.log(asset.name);
        })
      })
    );
  }
}
