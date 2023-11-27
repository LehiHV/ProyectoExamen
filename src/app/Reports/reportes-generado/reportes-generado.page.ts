import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ModalController, NavController } from '@ionic/angular';
import { SharedDataService } from '../../shared-data.service';

@Component({
  selector: 'app-reportes-generado',
  templateUrl: './reportes-generado.page.html',
  styleUrls: ['./reportes-generado.page.scss'],
})
export class ReportesGeneradoPage implements OnInit {
  detalleVentas: any[] = [];
  gananciaTotal: number = 0;
  productos: any[] = [];
  productos2: any[] = [];
  
  constructor(
    private route: ActivatedRoute,
    public elim: ModalController,
    public sharedDataService: SharedDataService,
    public alertController: AlertController,
    private http: HttpClient,
    public navCtrl: NavController
  ) { }

  periodo: string = this.sharedDataService.FechaI.split('T')[0] + " al " + this.sharedDataService.FechaF.split('T')[0];
  preciocosto: any=[];
  ngOnInit() {
    this.obetenerTickets();
  }

  obetenerTickets() {
    const url = "https://movilesappslehi.000webhostapp.com/Apis_5E/REST_API_TICKETS.php?";
    const params = {
      comando: 'Reports',
      FechaInicial: this.sharedDataService.FechaI,
      FechaFinal: this.sharedDataService.FechaF,
      IdTienda: this.sharedDataService.userData.Id
    }

    this.http.get<any[]>(url, { params }).subscribe(
      (response) => {
        this.detalleVentas = response;
        this.transformarDetalleVentas(); // Llama a la función de transformación después de obtener los datos
      },
      (error) => {
        console.error('Error al obtener los tickets', error);
      }
    );
  }
  precioCostoProductos(){
    const url = "https://movilesappslehi.000webhostapp.com/Apis_5E/REST_API_PRODUCTOS.php?";
    const params = {
      comando: 'ProductId',
      IdTienda: this.sharedDataService.userData.Id
    };
    this.http.get<any>(url, { params }).subscribe(
      (response) => {
        this.productos2=response;
      }
    );
  }
  transformarDetalleVentas() {
    this.precioCostoProductos()
    const productosMap = new Map<number, any>();
    this.gananciaTotal = 0; // Reinicia la ganancia total
    this.detalleVentas.forEach((detalle) => {
      detalle.DetalleTicket.forEach((producto: any) => { // Agrega el tipo 'any' para 'producto'
        const idProducto = producto.IdProducto;
        if (productosMap.has(idProducto)) {
          productosMap.get(idProducto).cantidad += 1;
          const producto2 = this.productos2.find((p: any) => p.Id === idProducto);
          if (producto2) {
            // Actualiza el PrecioCosto con el valor de this.productos2.PrecioCosto
            productosMap.get(idProducto).PrecioCosto = producto2.PrecioCosto;
          }
        } else {
          productosMap.set(idProducto, {
            id: idProducto,
            nombre: producto.Nombre,
            cantidad: 1,
            precio: producto.Precio,
            // Utiliza el PrecioCosto de this.productos2 si coincide el IdProducto
            PrecioCosto: (this.productos2.some((p: any) => p.Id === idProducto))
            ? this.productos2.find((p: any) => p.Id === idProducto).PrecioCosto
            : producto.PrecioCosto,
          });
        }
        // Acumula la ganancia total
        this.gananciaTotal += producto.Precio;
      });
    });
  
    // Convierte el mapa a un array para usar en la plantilla
    this.detalleVentas = Array.from(productosMap.values());
    
  }
  

  regresarAlMenuPrincipal() {
    this.navCtrl.navigateBack('/tienda'); 
  }
}
