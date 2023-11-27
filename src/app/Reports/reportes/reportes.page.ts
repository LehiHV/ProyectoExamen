import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ModalController, NavController } from '@ionic/angular';
import { SharedDataService } from '../../shared-data.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.page.html',
  styleUrls: ['./reportes.page.scss'],
})
export class ReportesPage implements OnInit {
  showStartDatepicker: boolean = false;
  showEndDatepicker: boolean = false;
  startDate: string = new Date().toISOString(); // Inicializar con la fecha actual
  endDate: string = new Date().toISOString(); // Inicializar con la fecha actual

  // Propiedades adicionales para la visualización en formato YYYY-MM-DD
  displayStartDate: string = this.startDate.split('T')[0];
  displayEndDate: string = this.endDate.split('T')[0];

  constructor(
    private route: ActivatedRoute,
    public elim: ModalController,
    public sharedDataService: SharedDataService,
    public alertController: AlertController,
    private http: HttpClient,
    public navCtrl: NavController
  ) {}
  redirigirAReportesGenerados() {
    this.sharedDataService.FechaI = this.startDate
    this.sharedDataService.FechaF = this.endDate
    this.navCtrl.navigateForward('/reportes-generado')
  }
  toggleDatepicker(type: string) {
    if (type === 'start') {
      this.showStartDatepicker = !this.showStartDatepicker;
      this.showEndDatepicker = false; // Asegura que el otro datepicker esté cerrado
    } else if (type === 'end') {
      this.showEndDatepicker = !this.showEndDatepicker;
      this.showStartDatepicker = false; // Asegura que el otro datepicker esté cerrado
    }
  }

  onDateSelected(type: string) {
    // Aquí puedes realizar acciones adicionales si es necesario
    if (type === 'start') {
      this.showStartDatepicker = false;
      this.displayStartDate = this.startDate.split('T')[0];
    } else if (type === 'end') {
      this.showEndDatepicker = false;
      this.displayEndDate = this.endDate.split('T')[0];
    }
  }

  ngOnInit() {}
}
