import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ModalController, NavController } from '@ionic/angular';
import { SharedDataService } from '../shared-data.service';

@Component({
  selector: 'app-ventas-productos',
  templateUrl: './ventas-productos.page.html',
  styleUrls: ['./ventas-productos.page.scss'],
})
export class VentasProductosPage implements OnInit {
  Productos: any[] = [];
  searchText : string =''
  Credito: string =''
  clienteId: string='';
  clienteNombre: string='';
  seleccionado: boolean = false;
  cantidadIngresada: number = 0;
  clienteFotografia: string=this.sharedDataService.Fotografia_Cliente_Ventas;
  constructor(
    private route: ActivatedRoute,
    public elim: ModalController,
    public sharedDataService: SharedDataService,
    public alertController: AlertController,
    private http: HttpClient,
    public navCtrl: NavController
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.clienteId = params['clienteId'];
      this.clienteNombre = params['clienteNombre'];
    });
    this.obtenerProductos();
  }
  hayProductosSeleccionados(): boolean {
    return this.Productos.some(item => item.seleccionado);
  }
  crearPedido() {
    const fechaActual = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const url = 'https://movilesappslehi.000webhostapp.com/Apis_5E/REST_API_TICKETS.php';
    const params = {
      comando: 'Add',
      IdCliente: this.clienteId,
      Fecha: fechaActual,
      Credito: this.Credito,
    };
  
    this.http.get<any>(url, { params }).subscribe(
      (response) => {
        if (response && response.message === 'Ticket agregado correctamente') {
          const productosSeleccionados = this.Productos.filter((item) => item.seleccionado);
          if (productosSeleccionados.length > 0) {
            productosSeleccionados.forEach((producto) => {
              // Realizar aquí la llamada HTTP para cada producto
              // Utiliza response.idTicket para asociar cada producto al ticket recién creado
              
              const urlProducto = 'https://movilesappslehi.000webhostapp.com/Apis_5E/REST_API_DETALLESTICKETS.php'; // Reemplaza con la URL correcta
              const paramsProducto = {
                comando: 'Add',
                IdTicket: response.id,
                IdProducto: producto.Id, // Ajusta según la estructura de tu producto
                Cantidad: producto.cantidadSeleccionada // Ajusta según la estructura de tu producto
              };
              this.http.get<any>(urlProducto, {params: paramsProducto}).subscribe(
                (responseProducto) => {
                },
                (errorProducto) => {
                  console.error('Error en la llamada HTTP del producto:', errorProducto);
                  this.mostrarAlerta('Error', 'Ocurrió un error al agregar un producto.');
                }
              );
            }
            );
          } else {
            this.mostrarAlerta('Tickets', 'No hay productos seleccionados');
          }
        } else {
          this.mostrarAlerta('Tickets', 'Problemas para crear el pedido');
        }
        this.navCtrl.navigateForward('/resumen-ticket');
        this.sharedDataService.IdTicket= response.id;
      },
      (error) => {
        console.error('Error en la llamada HTTP:', error);
        this.mostrarAlerta('Error', 'Ocurrió un error al intentar actualizar el Ticket.');
      }
    );
  }
  

  mostrarDialogoCrearPedido() {
    this.presentAlertConfirm();
  }
  
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Pagar a Crédito',
      message: '¿Desea pagar a crédito?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.Credito = 'No'
            this.crearPedido();
          },
        },
        {
          text: 'Sí',
          handler: () => {
            this.Credito = 'Si'
            this.crearPedido();
          },
        },
      ],
    });
  
    await alert.present();
  }
  

  esURLValida(url: string): boolean {
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return urlPattern.test(url);
  }

  obtenerProductos() {
    this.sharedDataService.obtenerProductos().subscribe(
      (productos) => {
        if (productos && productos.length > 0) {
          this.Productos = Array.isArray(productos) ? productos : [productos];
        } else {
          this.Productos = [];
        }
      },
      (error) => {
        console.error('Error en la llamada HTTP:', error);
        this.mostrarAlerta('Error', 'Ocurrió un error al obtener la lista de productos.');
      }
    );
  }
  filterProductos(): any[] {
    if (!this.searchText) {
      return this.Productos;
    }

    return this.Productos.filter(producto => {
      // Puedes ajustar esta lógica de búsqueda según tus necesidades
      return producto.Nombre.toLowerCase().includes(this.searchText.toLowerCase());
    });
  }
  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

}
