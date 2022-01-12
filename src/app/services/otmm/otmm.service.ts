import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class OtmmService {
  private baseUrl = '/otmmapi/v6';

  constructor(private http: HttpClient) {}

  getOTDSToken(): Observable<any> {
    const url =
      'http://training-otmm.acheron-tech.com:8080/otdsws/rest/authentication/credentials';

    const body = JSON.stringify({
      userName: 'Sudheer',
      password: 'TrainingP@ss123',
      ticketType: 'OTDSTICKET',
    });

    const httpHeaders = new HttpHeaders().set(
      'Content-Type',
      'application/json'
    );

    return this.http.post(url, body, { headers: httpHeaders });
  }

  getTokenForResource(OTDSTicket: string) {
    const url =
      'http://training-otmm.acheron-tech.com:8080/otdsws/rest/authentication/resource/ticketforresource';

    const body = JSON.stringify({
      ticket: OTDSTicket,
      targetResourceId: 'e1332625-4b8e-4e40-94a8-012f81846665',
    });

    const httpHeaders = new HttpHeaders().set(
      'Content-Type',
      'application/json'
    );

    return this.http.post(url, body, { headers: httpHeaders });
  }

  getSessionForResource(resourceTicket: string) {
    const url = this.baseUrl + '/sessions';

    const httpHeaders = new HttpHeaders().set('OTDSToken', resourceTicket);

    return this.http.get(url, { headers: httpHeaders });
  }

  getAssetsBySearch(
    keyWord: string,
    keywordScopeId: number,
    sessionId: any,
    OTDSToken: string
  ): Observable<any> {
    const url =
      this.baseUrl +
      '/search/text?keyword_query=' +
      keyWord +
      '&keyword_scope_id=' +
      keywordScopeId;
    const httpHeaders = new HttpHeaders({
      'X-Requested-By': sessionId,
      OTDSToken: OTDSToken,
    });

    return this.http.get<any>(url, { headers: httpHeaders });
  }

  createAnAsset(
    uploadForm: FormGroup,
    sessionId: any,
    OTDSToken: string
  ): Observable<any> {
    const url = this.baseUrl + '/assets';
    const assetRepresentaion = {
      asset_resource: {
        asset: {
          metadata: {
            metadata_element_list: [
              {
                id: 'BOOK_NAME_FIELD',
                name: 'Book Name',
                type: 'com.artesia.metadata.MetadataField',
                value: {
                  value: {
                    value: 'Tom and Jerry',
                    type: 'string',
                  },
                },
              },
              {
                id: '101',
                name: 'First Name',
                type: 'com.artesia.metadata.MetadataTableField',
                value: {
                  value: {
                    type: 'string',
                    value: 'samyuktha',
                  },
                },
              },
              {
                id: '102',
                name: 'Last Name',
                type: 'com.artesia.metadata.MetadataTableField',
                value: {
                  value: {
                    type: 'string',
                    value: 'Pasupuleti',
                  },
                },
              },
            ],
          },
          metadata_model_id: 'BOOK_MODEL',
          security_policy_list: [
            {
              id: 6,
            },
          ],
        },
      },
    };
    const manifest = {
      upload_manifest: {
        master_files: [
          {
            file: {
              file_name: uploadForm.get('fileSource')!.value.name,
              file_type: uploadForm.get('fileSource')!.value.type,
            },
          },
        ],
      },
    };

    var formData: any = new FormData();
    formData.append('asset_representation', JSON.stringify(assetRepresentaion));
    formData.append(
      'import_template_id',
      '0b1a0a52043170dceed93a68b8307527c06989a2'
    );
    formData.append(
      'parent_folder_id',
      '8f2c59ceaf9ca4ffe044dc2cc657efa3f35c7008'
    );
    formData.append('files', uploadForm.get('fileSource')!.value);
    formData.append('manifest', JSON.stringify(manifest));

    const httpSessionId = sessionId.toString();
    const httpHeaders = new HttpHeaders({
      'X-Requested-By': httpSessionId,
      OTDSToken: OTDSToken,
    });

    return this.http.post(url, formData, { headers: httpHeaders });
  }

  createFolder(
    name: string,
    description: string,
    label: string,
    sessionId: string,
    OTDSToken: string
  ): Observable<any> {
    const url =
      this.baseUrl + '/folders/8f2c59ceaf9ca4ffe044dc2cc657efa3f35c7008';

    const body = JSON.stringify({
      folder_resource: {
        folder: {
          name: name,
          container_type_id: 'TRAINING.FOLDER.TYPE',
          security_policy_list: [
            {
              id: 6,
            },
          ],
          metadata: {
            metadata_element_list: [
              {
                id: 'TRAINING.FOLDER.DESCRIPTION',
                name: description,
                type: 'com.artesia.metadata.MetadataField',
                value: {
                  value: {
                    type: 'string',
                    value: 'sudheer description',
                  },
                },
              },
              {
                id: 'TRAINING.FOLDER.LABEL',
                name: label,
                type: 'com.artesia.metadata.MetadataField',
                value: {
                  value: {
                    type: 'string',
                    value: 'sudheer label',
                  },
                },
              },
            ],
          },
          metadata_model_id: 'TRAINING.FOLDER.TYPE',
        },
      },
    });

    const httpSessionId = sessionId.toString();

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-By': httpSessionId,
      OTDSToken: OTDSToken,
    });
    return this.http.post(url, body, { headers: httpHeaders });
  }
}
