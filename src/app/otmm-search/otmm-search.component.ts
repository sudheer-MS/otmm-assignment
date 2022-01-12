import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { OtmmService } from '../services/otmm/otmm.service';

@Component({
  selector: 'app-otmm-search',
  templateUrl: './otmm-search.component.html',
  styleUrls: ['./otmm-search.component.css'],
})
export class OtmmSearchComponent implements OnInit {
  assets: any = [];
  searchText = new FormControl('');
  sessionId: any = 0;
  resourceToken: any = '';

  uploadForm = new FormGroup({
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required]),
  });

  folderForm: FormGroup = new FormGroup({
    folderName: new FormControl('', [Validators.required]),
    folderDescription: new FormControl('', [Validators.required]),
    folderLabel: new FormControl('', [Validators.required]),
  });

  constructor(private otmmService: OtmmService) {
    this.otmmService.getOTDSToken().subscribe(
      (response) => {
        this.otmmService.getTokenForResource(response.ticket).subscribe(
          (response: any) => {
            this.resourceToken = response.ticket;
            this.otmmService.getSessionForResource(response.ticket).subscribe(
              (response: any) => {
                this.sessionId = response.session_resource.session.id;
              },
              (error) => console.log(error)
            );
          },
          (error) => console.log(error)
        );
      },
      (error) => console.log(error)
    );
  }

  ngOnInit(): void {}

  getAssetsBySearch = (keyWord: string) => {
    this.otmmService
      .getAssetsBySearch(keyWord, 1, this.sessionId, this.resourceToken)
      .subscribe(
        (response) => {
          this.assets = response.search_result_resource.asset_list;
          console.log(response);
        },
        (error) => console.log(error),
        () => console.log('completed')
      );
  };

  onSearchAssets = (searchText: FormControl) => {
    this.getAssetsBySearch(searchText.value);
  };

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadForm.patchValue({
        fileSource: file,
      });
    }
  }

  onSubmitUpload() {
    this.otmmService
      .createAnAsset(this.uploadForm, this.sessionId, this.resourceToken)
      .subscribe(
        (response) => console.log(response),
        (error) => console.log(error)
      );
  }

  // name: string, description: string, label: string

  onSubmitCreateFolder() {
    console.log(this.folderForm.value);
    this.otmmService
      .createFolder(
        this.folderForm.value.folderName,
        this.folderForm.value.folderDescription,
        this.folderForm.value.folderLabel,
        this.sessionId,
        this.resourceToken
      )
      .subscribe(
        (response) => console.log(response),
        (error) => console.log(error)
      );
  }
}
