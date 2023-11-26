import { Injectable, inject } from '@angular/core';
import { Platform } from '@ionic/angular/standalone';
import { Directory, FileInfo, Filesystem } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class ImageFileService {
  private readonly platform = inject(Platform);

  public readonly files: Map<FileInfo, string> = new Map();

  async writeFile(file: File) {
    const fileReader = new FileReader();
    fileReader.onload = async () => {
      const { uri } = await Filesystem.writeFile({
        path: file.name,
        data: fileReader.result as string,
        directory: Directory.External,
        recursive: true
      });

      const { lastModified, name, size } = file;
      const fileInfo: FileInfo = { mtime: lastModified, name, size, type: 'file', uri };
      // when hybrid, add converted filesystem uri
      // when browser, add data url
      const src = this.platform.is('hybrid') ? Capacitor.convertFileSrc(uri) : fileReader.result as string;
      this.files.set(fileInfo, src);
    };
    // read image data as Base64 encoded string
    fileReader.readAsDataURL(file);
  }

  async deleteFile(fileInfo: FileInfo): Promise<void> {
    try {
      await Filesystem.deleteFile({ path: fileInfo.name, directory: Directory.External });
      this.files.delete(fileInfo);
    } catch (error) {
      console.error(error);
    };
  }

  async readFiles(rootDir = '') {
    const result = await Filesystem.readdir({ path: rootDir, directory: Directory.External });
    for (const fileInfo of result.files) {
      const src = await this.getImageSrc(fileInfo);
      this.files.set(fileInfo, src);
    }
  }

  private async getImageSrc(fileInfo: FileInfo): Promise<string> {
    if (this.platform.is('hybrid')) {
      // file uri needs to be converted from scheme file:// to https://
      return Capacitor.convertFileSrc(fileInfo.uri);
      // when browser, image data is saved as Base64 string in IndexedDB
      // therefore image uri is only virtual and image data must be read from IndexedDB
    } else {
      const result = await Filesystem.readFile({ path: fileInfo.uri });
      return `data:image/jpeg;base64,${result.data}`;
    }
  }
}
