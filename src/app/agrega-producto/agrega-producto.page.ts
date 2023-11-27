import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { SharedDataService } from '../shared-data.service';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-agrega-producto',
  templateUrl: './agrega-producto.page.html',
  styleUrls: ['./agrega-producto.page.scss'],
})
export class AgregaProductoPage implements OnInit {
  nuevoProducto: any = {
    Nombre: '',
    Descripcion: '',
    Cantidad: null,
    PrecioCosto: null,
    PrecioVenta: null,
    Fotografia: '',
  };
  Productos: any[] = [];

  constructor(
    public elim: ModalController,
    public alertController: AlertController,
    private http: HttpClient,
    public sharedDataService: SharedDataService,
    public navCtrl: NavController
  ) {}

  ngOnInit() {}

  registrarProducto() {
    const url = 'https://movilesappslehi.000webhostapp.com/Apis_5E/REST_API_PRODUCTOS.php?'; // Reemplaza con la URL correcta
    const params = {
      comando: 'Add',
      Nombre: this.nuevoProducto.Nombre,
      Descripcion: this.nuevoProducto.Descripcion,
      Cantidad: this.nuevoProducto.Cantidad,
      PrecioCosto: this.nuevoProducto.PrecioCosto,
      PrecioVenta: this.nuevoProducto.PrecioVenta,
      Fotografia: this.nuevoProducto.Fotografia,
      IdTienda : this.sharedDataService.userData.Id
    };

    this.http.get<any>(url, { params }).subscribe(
      (response) => {
        if (response) {
          if (response.message === 'Producto agregado correctamente') {
            this.mostrarAlerta('Productos', 'Producto Registrado');
            this.navCtrl.navigateBack('/productos');
          } else {
            this.mostrarAlerta('Productos', response.message);
          }
        } else {
          this.mostrarAlerta('Error', 'Respuesta vacía del servidor');
        }
      },
      (error) => {
        console.error('Error en la llamada HTTP:', error);
        this.mostrarAlerta('Error', 'Ocurrió un error al intentar agregar el producto.');
      }
    );
  }

  esURLValida(url: string): boolean {
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return urlPattern.test(url);
  }

  cancelarAgregarProducto() {
    this.nuevoProducto = {
      Nombre: '',
      Descripcion: '',
      Cantidad: null,
      PrecioCosto: null,
      PrecioVenta: null,
      Fotografia: '',
    };
    this.navCtrl.navigateForward('/productos');
    this.obtenerProductos();
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

  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
