import { Component, OnInit } from '@angular/core';
import { AlertController} from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ModalController, NavController } from '@ionic/angular';
import { SharedDataService } from '../../shared-data.service';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.page.html',
  styleUrls: ['./ventas.page.scss'],
})
export class VentasPage implements OnInit {
  Clientes: any[] = [];
  searchText: string = '';
  constructor(
    public elim: ModalController,
    public sharedDataService: SharedDataService,
    public alertController: AlertController,
    private http: HttpClient,
    public navCtrl: NavController
  ) { }

  ngOnInit() {
    this.obtenerClientes();
  }

  esURLValida(url: string): boolean {
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return urlPattern.test(url);
  }
  
  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }
  
  obtenerClientes() {
    this.sharedDataService.obtenerClientes().subscribe(
      (clientes) => {
        if (clientes && clientes.length > 0) {
          this.Clientes = Array.isArray(clientes) ? clientes : [clientes];
        } else {
          this.Clientes = [];
        }
      },
      (error) => {
        console.error('Error en la llamada HTTP:', error);
        this.mostrarAlerta('Error', 'Ocurrió un error al obtener la lista de clientes.');
      }
    );
  }
  verProductos(clienteItem: any) {
    this.navCtrl.navigateForward('/ventas-productos', {
      queryParams: {
        clienteId: clienteItem.Id,
        clienteNombre : clienteItem.Nombre,
      }
    });
    this.sharedDataService.Fotografia_Cliente_Ventas=clienteItem.Fotografia;
  }
  filterClientes(): any[] {
    if (!this.searchText) {
      return this.Clientes;
    }

    return this.Clientes.filter(cliente => {
      // Puedes ajustar esta lógica de búsqueda según tus necesidades
      return cliente.Nombre.toLowerCase().includes(this.searchText.toLowerCase());
    });
  }
}
