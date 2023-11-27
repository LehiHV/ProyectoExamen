import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  userData: any;
  Fotografia_Cliente_Ventas : any;
  IdTicket: any;
  FechaI: any;
  FechaF: any;
  constructor(private http: HttpClient) {}

  obtenerClientes() {
    const url = 'https://movilesappslehi.000webhostapp.com/Apis_5E/REST_API_CLIENTES.php';
    const params = {
      comando: 'ClientId',
      TiendaId: this.userData.Id,
    };

    return this.http.get<any[]>(url, { params });
  }
  obtenerProductos() {
    const url = 'https://movilesappslehi.000webhostapp.com/Apis_5E/REST_API_PRODUCTOS.php';
    const params = {
      comando: 'ProductId',
      IdTienda: this.userData.Id
    };

    return this.http.get<any[]>(url, { params });
  }

}

