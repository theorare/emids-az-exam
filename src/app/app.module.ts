import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PatientService } from './service/patient-data.service';
import { HttpService } from './service/http.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingInterceptor } from './service/interceptor.service';

const SERVICE_PROVIDERS = [PatientService, HttpService];
const INTERCEPTORS = [{ provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }];
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [SERVICE_PROVIDERS],
  bootstrap: [AppComponent]
})
export class AppModule { }
