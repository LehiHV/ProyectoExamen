import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
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
  constructor(
    private http: HttpClient,
    public alertController: AlertController
    ) {}

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
  async alert(header: string,subHeader:string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  isValidUrl(url: string): boolean {
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return urlPattern.test(url);
  }

  filter(list: any[], text: string): any[] {
    if (!text) {
      return list;
    }
  
    return list.filter((obj: { Nombre: string }) => {
      // Puedes ajustar esta lógica de búsqueda según tus necesidades
      return obj.Nombre.toLowerCase().includes(text.toLowerCase());
    });
  }

}

