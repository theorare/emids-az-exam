import { throwError as observableThrowError  } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { catchError, map } from 'rxjs/operators';
import { AppConfig } from '../app.config';
import JsonUtils from './json-utils';
import { HttpParams } from '@angular/common/http';
// import { ApiResponse } from '@models/api-response';

@Injectable()
export class GenericApiService<TData> {
    protected baseUrl: string;
    protected http: HttpService;
    protected appConfig: AppConfig;

    constructor(resourceName: string, http: HttpService, appConfig: AppConfig) {
        this.appConfig = appConfig;
        this.baseUrl = this.getUrlPrefix() + `${resourceName}`;
        this.http = http;
    }

    getUrlPrefix(): string {
        // NEED the proxy for local host TO AVOID CORS ISSUE
        return `${this.appConfig.functionApiUrl}/`;
    }

    getAll(params?: any): Promise<TData[]> {
        return this.http
            .get(this.baseUrl, params)
            .pipe(
                map((response) => this.extractDataList(response)),
                catchError((error) => this.handleError(error))
            )
            .toPromise();
    }

    getById(id: number): Promise<TData> {
        return this.http
            .get(`${this.baseUrl}/${id}`)
            .pipe(
                map((response) => this.extractData(response)),
                catchError((error) => this.handleError(error))
            )
            .toPromise();
    }

    // todo: temporary - evaluate if we want to use this
    getAllWithCustomResponseType<responseType>(): Promise<responseType> {
        return this.http
            .getTyped<responseType>(`${this.baseUrl}`)
            .pipe(
                // map((response) => this.extractCustomResponse<responseType>(response)),
                catchError((error) => this.handleError(error))
            )
            .toPromise();
    }

    create(item: TData): Promise<TData> {
        return this.http
            .post(`${this.baseUrl}`, item)
            .pipe(
                map((response) => this.extractData(response)),
                catchError((error) => this.handleError(error))
            )
            .toPromise();
    }

    update(item: TData): Promise<TData> {
        return this.http
            .put(`${this.baseUrl}`, item)
            .pipe(
                map((response) => this.extractData(response)),
                catchError((error) => this.handleError(error))
            )
            .toPromise();
    }

    // todo: this might need some work (untested)
    delete(id: string) {
        return this.http.delete(`${this.baseUrl}/${id}`).pipe(catchError((error) => this.handleError(error)));
    }

    extractData(response: any, returnApiResponse: boolean = false): TData {
        const createModelFunc = this['createModel'];
        const item = this.convertJsonToModel<TData>(response, createModelFunc);
        return item;
    }

    extractDataList(response: any): TData[] {
        const createModelFunc = this['createModel'];
        const items = this.convertJsonToModelArray<TData[]>(response, createModelFunc);
        return items;
    }

    extractCustomData<customTData>(response: any, createModelFunc = null): customTData {
        const item = this.convertJsonToModel<customTData>(response, createModelFunc);
        return item;
    }

    extractCustomDataList<customTData>(response: any, createModelFunc): customTData[] {
        const items = this.convertJsonToModelArray<customTData[]>(response, createModelFunc);
        return items;
    }

    extractAnyData(response: any) {
        return (response.data as any) || {};
    }

    extractStringData(response: any) {
        return (response.data as string) || '';
    }

    extractNumberData(response) {
        if (response && typeof response.data === 'number') {
            return response.data as number;
        } else {
            return 0;
        }
    }

    extractCustomResponse<customResponseType>(response: any) {
        return (response as customResponseType) || ({} as customResponseType);
    }

    extractAnyResponse(response: any) {
        return (response as any) || {};
    }

    // handleError(error) {
    //     console.error(error);
    //     return observableThrowError(error || 'Server error');
    // }

    handleError(err) {
        const errorMessages: string[] = [];
        console.log(err);
        // if (err.error) {
        //     if (err.error.errors) {
        //         if (Array.isArray(err.error.errors)) {
        //             err.error.errors.forEach((error) => {
        //                 if (typeof err.error.errors === 'object') {
        //                     if (error['field'] && error['message']) {
        //                         const validationErrorString = `${error['message']}`;
        //                         errorMessages.push(validationErrorString);
        //                     } else {
        //                         errorMessages.push(error.toString());
        //                     }
        //                 } else if (typeof err.error.errors === 'string') {
        //                     errorMessages.push(error);
        //                 }
        //             });
        //         } else {
        //             errorMessages.push(err.error.errors.toString());
        //         }
        //     } else if (err.error.exceptionMessage) {
        //         errorMessages.push(err.error.exceptionMessage);
        //     } else if (err.error.data) {
        //         if (err.error.data.message) {
        //             errorMessages.push(err.error.data.message);
        //         }
        //     } else {
        //         errorMessages.push(err.message);
        //     }
        // }

        return observableThrowError(err);
    }

    protected convertObjectToHttpParams(params: any) {
        let httpParams = new HttpParams();

        for (const property in params) {
            if (params.hasOwnProperty(property)) {
                httpParams = httpParams.append(property, params[property]);
            }
        }

        return httpParams;
    }

    private convertJsonToModel<dataType>(response, createModelFunc): dataType {
        let data;

        if (!createModelFunc) {
            data = (response as dataType) || {};
        } else if (response) {
            if (typeof response !== 'object') {
                response = JsonUtils.tryParseJSON(response);
            }
            data = createModelFunc(response);
        }

        return data;
    }

    private convertJsonToModelArray<dataListType>(response, createModelFunc): dataListType {
        let dataList;

        if (!createModelFunc) {
            dataList = (response.data as dataListType[]) || [];
        } else if (response && response.data && Array.isArray(response.data)) {
            dataList = [];
            for (let item of response.data) {
                if (item) {
                    if (typeof item !== 'object') {
                        item = JsonUtils.tryParseJSON(item);
                    }
                    dataList.push(createModelFunc(item));
                }
            }
        }

        return dataList;
    }
}
