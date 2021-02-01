import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Asset } from './asset';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AssetsService {
  private newsEmotionsUrl: string = 'http://192.168.68.152:8080/asset';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

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

  delete(id: number): Observable<Asset> {
    return this.http.delete<Asset>(`${this.newsEmotionsUrl}/${id}`, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    )
  }
}
