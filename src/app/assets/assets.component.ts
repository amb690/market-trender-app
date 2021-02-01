import { Component, ViewChild, OnInit } from '@angular/core';

import { AssetsService } from 'src/app/assets/assets.service';
import { Asset } from 'src/app/assets/asset';
import { of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import swal from 'sweetalert2';

@Component({
  selector: 'assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.css']
})

export class AssetsComponent implements OnInit {

  columns: string[] = ['name', 'ticker', 'ipoDate', 'country', 'exchange', 'sector', 'strategybtn', 'deletebtn'];

  datos: Asset[] = [];
  dataSource = null;
  assets: any;
  loading: boolean;
  err: string;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private assetsService: AssetsService) { }

  ngOnInit(): void {

    this.paginator._intl.itemsPerPageLabel = "Tamaño de página: ";
    this.paginator._intl.firstPageLabel = "Primera página ";
    this.paginator._intl.lastPageLabel = "Última página";
    this.paginator._intl.previousPageLabel = "Página anterior";
    this.paginator._intl.nextPageLabel = "Página siguiente";

    this.loading = true;

    this.assetsService.getAssets()
      .pipe(
        tap(assets => {
          this.assets = assets;
          console.log('AssetComponent: registered');
          assets.forEach(asset => {
            console.log(asset.name);
          });

          // Assign the data to the data source for the table to render
          this.dataSource = new MatTableDataSource<Asset>(assets);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.sort.disableClear = true;
          this.loading = false;
        }),
        catchError(e => {
          this.loading = false;

          // esto viene del backend
          if (e.status == 500) {
            // se puede mostrar el propio error del backend con e.error o e.error.message
            this.err = 'No se pueden mostrar activos en este momento';
          }

          console.error(e.error);
          // swal.fire('Conexión fallida', e.error, 'error');

          return throwError(e);
        })
      ).subscribe();

  }

  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: Asset, filter: string) =>
      data.name.toLowerCase().indexOf(filter) != -1 || data.ticker.toLowerCase().indexOf(filter) != -1;
  }

  delete(asset: Asset): void {
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: true
    })

    swalWithBootstrapButtons.fire({
      title: '¿Está seguro?',
      text: `¿Seguro que desea eliminar el activo ${asset.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      reverseButtons: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.assetsService.delete(asset.id).subscribe(
          _ => {
            this.assets = this.assets.filter((ase: Asset) => ase !== asset)
            swalWithBootstrapButtons.fire(
              'Activo Eliminado!',
              `Activo ${asset.name} eliminado con éxito.`,
              'success'
            )
            this.dataSource = new MatTableDataSource<Asset>(this.assets);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.sort.disableClear = true;
          }
        )
      }
    })
  }
}
