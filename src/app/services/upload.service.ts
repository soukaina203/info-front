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


    uploadFile(file: File,folderName: string): Observable<any> {
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);
        return this.http.post(`${this.urlApi}/Upload/UploadFile/${folderName}`, formData);
    }


     downloadFile(folderName: string, file: string): Observable<Blob> {
        return this.http.get(`${this.urlApi}/Upload/DownloadFile/${folderName}/${file}`, {
            responseType: 'blob'
        });
    }

    putFile(folderName: string, oldfileName: string, newFile: File) {
        const formData: FormData = new FormData();
        formData.append('filename', newFile, newFile.name);
        formData.append('folderName', folderName);
        return this.http.put(`${this.urlApi}/Upload/PutFile/${folderName}/${oldfileName}`, formData);
    }


}
