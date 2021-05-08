import { throwError as observableThrowError } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class HttpService {
    constructor(private http: HttpClient) {}

    get(url: string, params?: any, responseType?: string) {
        return this.request(url, 'get', undefined, params, responseType);
    }

    // todo: temporary
    getTyped<T>(url: string, params?: any, responseType?: string) {
        return this.requestTyped<T>(url, 'get', undefined, params, responseType);
    }

    post(url: string, body: any, params?: any) {
        return this.request(url, 'post', body, params);
    }

    put(url: string, body: any) {
        return this.request(url, 'put', body);
    }

    delete(url: string) {
        return this.request(url, 'delete');
    }

    private request(url: string, method: string, body?: any, params?: any, responseType?: any) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Accept: 'application/json',
        });

        try {
            const requestOptions = {
                body,
                headers,
                params,
            };
            if (responseType) {
                requestOptions['responseType'] = responseType;
            }
            // if (environment.withCredentials) {
            //     requestOptions['withCredentials'] = true;
            // }

            return  this.http.request(method, url, requestOptions);
        } catch (error) {
            return observableThrowError(error);
        }
    }

    private requestTyped<T>(url: string, method: string, body?: any, params?: any, responseType?: any) {
        const headers = new HttpHeaders();

        try {
            const requestOptions = {
                body,
                headers,
                params,
            };
            if (responseType) {
                // tslint:disable-next-line: no-string-literal
                requestOptions['responseType'] = responseType;
            }
            // if (environment.withCredentials) {
            //     requestOptions['withCredentials'] = true;
            // }

            return this.http.request<T>(method, url, requestOptions);
        } catch (error) {
            return observableThrowError(error);
        }
    }
}
