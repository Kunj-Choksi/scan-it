import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { File } from "@ionic-native/file/ngx";
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { UtilityService } from './utility.service';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private storedImages: [{ id: number, date: Date, imageBase64: string, height: number, width: number }];

    constructor(
        private storage: Storage,
        private platform: Platform,
        private file: File,
        private utilityService: UtilityService,
        private socialSharing: SocialSharing,
    ) {
        this.platform.ready().then(() => {
            if (this.storage.get('imagesInfo')) {
                this.storage.get('imagesInfo').then((storedData) => {
                    this.storedImages = storedData || [];
                    console.log(this.storedImages);
                });
            }
        })
    }

    set(croppedImage: any) {
        this.storedImages.push({
            id: Math.floor(Math.random() * 10) + 1,
            imageBase64: croppedImage.base64,
            date: new Date(),
            height: croppedImage.height,
            width: croppedImage.width,
        })
        this.updateLocalImages();
    }

    delete(id: number) {
        console.log(id);
        const index = this.storedImages.findIndex(x => x.id === id);
        console.log(index);
        this.storedImages.splice(index, 1);
        console.log(this.storedImages);
        this.updateLocalImages();
    }

    updateLocalImages() {
        this.storage.set('imagesInfo', this.storedImages);
    }

    getAllImage() {
        return this.storedImages.slice();
    }

    saveToDownloadDir(croppedImage) {
        const nBlob = this.utilityService.imageToPdfBlob(croppedImage);
        return this.file.writeFile(this.file.externalRootDirectory + "/Download", `${new Date().getTime()}.pdf`, nBlob);
    }

    sharePdf(croppedImage, name: string) {
        const nBlob = this.utilityService.imageToPdfBlob(croppedImage);
        return this.file.writeFile(this.file.externalCacheDirectory, name, nBlob).then(() => {
            this.socialSharing.share("Sharing PDF", null, `${this.file.externalCacheDirectory}/${name}`, null);
        });
    }
}
