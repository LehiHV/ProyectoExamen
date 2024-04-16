import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RecaptchaModule, RecaptchaFormsModule } from "ng-recaptcha";
import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecaptchaFormsModule,
    RecaptchaModule,
    LoginPageRoutingModule
  ],
  declarations: [LoginPage]
})
export class LoginPageModule {}
