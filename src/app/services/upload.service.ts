import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
    protected urlApi: string = environment.apiUrl;
    protected http = inject(HttpClient);


    uploadFile(file: File): Observable<any> {
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);
        return this.http.post(`${this.urlApi}/Upload/UploadFile`, formData);
    }


}
