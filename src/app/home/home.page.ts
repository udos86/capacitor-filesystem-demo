import { Component, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  // demoFile: string | undefined;
  // demoImageFile: string | undefined;

  readonly imageFiles: string[] = [];

  constructor(private readonly platform: Platform) { }

  async ngOnInit(): Promise<void> {
    // retrieve a list of all already stored files
    const result = await Filesystem.readdir({
      path: '',
      directory: Directory.External
    });

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
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input === null || input.files === null) throw new Error('File input not available');

    const file = input.files.item(0);

    if (file === null) throw new Error('File does not exist');

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
      const url = this.platform.is('hybrid') ? Capacitor.convertFileSrc(result.uri) : fileReader.result as string;
      this.imageFiles.push(url);
    };
    // read image data as Base64 encoded string
    fileReader.readAsDataURL(file);
  }

  async writeFile(): Promise<void> {
    const result = await Filesystem.writeFile({
      path: 'files/sample.txt',
      data: 'This is a sample text file',
      directory: Directory.External,
      encoding: Encoding.UTF8,
      recursive: true
    });
  }

  async readFile(): Promise<void> {
    const result = await Filesystem.readFile({
      path: 'files/sample.txt',
      directory: Directory.External,
      encoding: Encoding.UTF8
    });

    // this.demoFile = result.data;
  }
}
