import { Component, OnInit, inject } from '@angular/core';
import { KeyValuePipe } from '@angular/common';
import { IonButton, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Directory, Encoding, FileInfo, Filesystem } from '@capacitor/filesystem';
import { ImageFileService } from '../image-file.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonButton, IonContent, IonHeader, IonTitle, IonToolbar, KeyValuePipe]
})
export class HomePage implements OnInit {
  private readonly fileService = inject(ImageFileService);

  // demoFile: string | undefined;
  // demoImageFile: string | undefined;

  images: Map<FileInfo, string> = this.fileService.files;

  async ngOnInit(): Promise<void> {
    /*
    // retrieve a list of all already stored files
    const result = await Filesystem.readdir({
      path: '',
      directory: Directory.External
    });

    result.files.forEach(fileInfo => this.imageFiles.push(fileInfo));
    
    // when hybrid, image data is saved as file on disk 
    // therefore image uri can be used as src attribute 
    if (this.platform.is('hybrid')) {
      // file uri needs to be converted from scheme file:// to https://
      result.files.forEach(fileInfo => this.imageFiles.push(Capacitor.convertFileSrc(fileInfo.uri)));
      // when browser, image data is saved as Base64 string in IndexedDB
      // therefore image uri is only virtual and image data must be read from IndexedDB
    } else {
      for (const fileInfo of result.files) {
        const result = await Filesystem.readFile({ path: fileInfo.uri });
        this.imageFiles.push(`data:image/jpeg;base64,${result.data}`);
      }
    }
    */
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input === null || input.files === null) throw new Error('File input not available');

    const file = input.files.item(0);

    if (file === null) throw new Error('File does not exist');

    this.fileService.writeFile(file);
    /*
    const fileReader = new FileReader();
    fileReader.onload = async () => {
      // this.demoImageFile = fileReader.result as string;

      const result = await Filesystem.writeFile({
        path: file.name,
        data: fileReader.result as string,
        directory: Directory.External,
        recursive: true
      });

      // when hybrid, add converted filesystem uri
      // when browser, add data url
      const uri = this.platform.is('hybrid') ? Capacitor.convertFileSrc(result.uri) : fileReader.result as string;
      const {lastModified, name, size} = file;
      const fileInfo: FileInfo = { mtime: lastModified, name, size, type: 'file', uri};
      this.imageFiles.push(file);
    };
    // read image data as Base64 encoded string
    fileReader.readAsDataURL(file);
    */
  }

  async deleteFile(fileInfo: FileInfo): Promise<void> {
    this.fileService.deleteFile(fileInfo);
  }

  async writeDemoFile(): Promise<void> {
    const result = await Filesystem.writeFile({
      path: 'files/sample.txt',
      data: 'This is a sample text file',
      directory: Directory.External,
      encoding: Encoding.UTF8,
      recursive: true
    });
  }

  async readDemoFile(): Promise<void> {
    const result = await Filesystem.readFile({
      path: 'files/sample.txt',
      directory: Directory.External,
      encoding: Encoding.UTF8
    });

    // this.demoFile = result.data;
  }
}
