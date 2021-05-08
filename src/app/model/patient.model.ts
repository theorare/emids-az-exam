import { IPatientDetail } from "../interface/patient.interface";

export class PatientDetail implements IPatientDetail {
    id?: string;
    name?: string;
    dateOfBirth?: string;
    emailId?: string;
    imageUrl?: string;
    patientCollection?: IPatientDetail[];

    constructor(
        options: {
            id?: string;
            name?: string;
            dateOfBirth?: string;
            emailId?: string;
            imageUrl?: string;
            patientCollection?: IPatientDetail[];
        } = {}
    ) {
        this.id = options.id || '';
        this.name = options.name || '';
        this.dateOfBirth = options.dateOfBirth || '';
        this.emailId = options.emailId || '';
        this.imageUrl = options.imageUrl || '';
        this.patientCollection = options.patientCollection || [];
    }
}