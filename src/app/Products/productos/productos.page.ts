import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ModalController, NavController } from '@ionic/angular';
import { SharedDataService } from '../../shared-data.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {
  showDetails: { [key: string]: boolean } = {};
  searchText: string = ''
  editingProduct: { [key: string]: boolean } = {};
  Productos: any[] = [];

  constructor(
    public elim: ModalController,
    public sharedDataService: SharedDataService,
    public alertController: AlertController,
    private http: HttpClient,
    public navCtrl: NavController
  ) {
    this.obtenerProductos();
  }

  ngOnInit() {
    this.obtenerProductos();
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
  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  ionViewDidEnter() {
    this.obtenerProductos();
  }

  toggleDetails(producto: any) {
    this.showDetails[producto.Id] = !this.showDetails[producto.Id];
  }

  editarProducto(producto: any) {
    this.editingProduct[producto.Id] = true;
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

  guardarProducto(producto: any) {
    const url = 'https://movilesappslehi.000webhostapp.com/Apis_5E/REST_API_PRODUCTOS.php'; // Reemplaza con la URL correcta
    const params = {
      comando: 'Update',
      Id: producto.Id,
      Nombre: producto.Nombre,
      Descripcion: producto.Descripcion,
      Cantidad: producto.Cantidad,
      PrecioCosto: producto.PrecioCosto,
      PrecioVenta: producto.PrecioVenta,
      Fotografia: producto.Fotografia,
      IdTienda: producto.IdTienda
    };

    this.http.get<any>(url, { params }).subscribe(
      (response) => {
        if (response) {
          if (response.message === 'Producto actualizado correctamente') {
            this.mostrarAlerta('Productos', response.message);
            this.obtenerProductos();
            this.editingProduct[producto.Id] = false;
          } else {
            this.mostrarAlerta('Productos', response.message);
          }
        } else {
          this.mostrarAlerta('Error', 'Respuesta vacía del servidor');
        }
      },
      (error) => {
        console.error('Error en la llamada HTTP:', error);
        this.mostrarAlerta('Error', 'Ocurrió un error al intentar actualizar el producto.');
      }
    );
  }

  eliminarProducto(producto: any) {
    const url = 'https://movilesappslehi.000webhostapp.com/Apis_5E/REST_API_PRODUCTOS.php'; // Reemplaza con la URL correcta
    const params = {
      comando: 'Delete',
      Id: producto.Id
    };

    this.http.get<any>(url, { params }).subscribe(
      (response) => {
        if (response) {
          if (response.message === 'Producto Eliminado correctamente') {
            const index = this.Productos.findIndex(p => p.Id === producto.Id);
            if (index !== -1) {
              this.Productos.splice(index, 1);
              this.mostrarAlerta('Productos', 'Producto Eliminado correctamente.');
            } else {
              this.mostrarAlerta('Error', 'No se encontró el producto para eliminar.');
            }
          } else {
            this.mostrarAlerta('Productos', response.message);
          }
        } else {
          this.mostrarAlerta('Error', 'Respuesta vacía del servidor');
        }
      },
      (error) => {
        console.error('Error en la llamada HTTP:', error);
        this.mostrarAlerta('Error', 'Ocurrió un error al intentar eliminar el producto.');
      }
    );
  }

  agregarProducto() {
    this.navCtrl.navigateForward('/agrega-producto').then(() => {
      this.elim.dismiss();
    });
  }

  
}
