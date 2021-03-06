import { Inject, Injectable } from "@angular/core";
import { map, catchError, debounceTime } from "rxjs/operators";
import { AppConfig } from "../app.config";
import { IPatientDetail } from "../interface/patient.interface";
import { PatientDetail } from "../model/patient.model";
import { GenericApiService } from './generic-api-service';
import { HttpService } from "./http.service";

@Injectable({
    providedIn: 'root',
})
export class PatientService extends GenericApiService<PatientDetail> {

    constructor(@Inject(HttpService) http, @Inject(AppConfig) appConfig) {
        super('patient', http, appConfig);
    }

    upsertPatientData(patientInformation: IPatientDetail): Promise<PatientDetail> {
        return this.http
            .post(this.getUrlPrefix() + `patient/upsert`, patientInformation)
            .pipe(
                map((response) => this.extractCustomData<PatientDetail>(response)),
                catchError((error) => this.handleError(error))
            )
            .toPromise();
    }

    deletePatientData(patientInformation: IPatientDetail): Promise<PatientDetail> {
        return this.http
            .post(this.getUrlPrefix() + `patient/delete`, patientInformation)
            .pipe(
                map((response) => this.extractCustomData<PatientDetail>(response)),
                catchError((error) => this.handleError(error))
            )
            .toPromise();
    }

    getAllPatientData(): Promise<PatientDetail[]> {
        return this.http
            .get(this.getUrlPrefix() + `patients`)
            .pipe(
                map((response) => this.extractCustomData<PatientDetail[]>(response)),
                catchError((error) => this.handleError(error))
            )
            .toPromise();
    }
}