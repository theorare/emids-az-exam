import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PatientService } from './service/patient-data.service';
import { HttpService } from './service/http.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingInterceptor } from './service/interceptor.service';
import { PatientListComponent } from './components/patient-list/patient-list.component';
import { AgGridModule } from 'ag-grid-angular';
const SERVICE_PROVIDERS = [PatientService, HttpService];
const INTERCEPTORS = [{ provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }];
@NgModule({
  declarations: [
    AppComponent,
    PatientListComponent
  ],
  imports: [
    BrowserModule,
    AgGridModule.withComponents([]),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [SERVICE_PROVIDERS, INTERCEPTORS],
  bootstrap: [AppComponent]
})
export class AppModule { }
