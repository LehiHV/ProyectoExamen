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
  }

  ngOnInit() {
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
        this.sharedDataService.alert('Error en la llamada HTTP',"Porfavor de contactar al Servicio Tecnico", 'Ocurrió un error al obtener la lista de productos.');
      }
    );
  }

  ionViewDidEnter() {
    this.obtenerProductos();
  }

  toggleDetails(producto: any) {
    this.showDetails[producto.Id] = !this.showDetails[producto.Id];
  }

  edit(producto: any) {
    this.editingProduct[producto.Id] = true;
  }
  AddProduct() {
    this.navCtrl.navigateForward('/agrega-producto').then(() => {
      this.elim.dismiss();
    });
  }

  save(producto: any) {
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
            this.sharedDataService.alert('Actualizar Producto',"Productos Actualizados" ,response.message);
            this.obtenerProductos();
            this.editingProduct[producto.Id] = false;
          } else {
            this.sharedDataService.alert('Actualizar Producto',"Error al momento de Actualizar" ,response.message);
          }
        } else {
          this.sharedDataService.alert('Error Actualizar Producto',"Error en el Servidor", 'Respuesta vacía del servidor');
        }
      },
      (error) => {
        console.error('Error en la llamada HTTP:', error);
        this.sharedDataService.alert('Error Actualizar Producto',"Error al momento de Actualizar", 'Ocurrió un error al intentar actualizar el producto.');
      }
    );
  }

  delete(producto: any) {
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
              this.sharedDataService.alert('Eliminar Producto',"Producto Eliminado" ,'Producto Eliminado correctamente.');
            } else {
              this.sharedDataService.alert('Error Eliminar Producto',"Producto Eliminado", 'No se encontró el producto para eliminar.');
            }
          } else {
            this.sharedDataService.alert('Eliminar Producto',"Producto no Eliminado", response.message);
          }
        } else {
          this.sharedDataService.alert('Error Eliminar Producto',"Producto no Eliminado" ,'Respuesta vacía del servidor');
        }
      },
      (error) => {
        console.error('Error en la llamada HTTP:', error);
        this.sharedDataService.alert('Error Eliminar Producto',"Porfavor Contactar con Servicio Tecnico", 'Ocurrió un error al intentar eliminar el producto.');
      }
    );
  }

  

  
}
