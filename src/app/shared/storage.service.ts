import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { File } from "@ionic-native/file/ngx";
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { UtilityService } from './utility.service';
import { BehaviorSubject } from 'rxjs';
import { take, tap } from 'rxjs/operators';

import { UserImage } from '../models/images.model';
import { UserSelectedImage } from '../models/user-images.model';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private _storedImages = new BehaviorSubject<UserImage[]>([]);

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
                    this._storedImages = new BehaviorSubject<UserImage[]>(storedData || []);
                });
            }
        })
    }

    set(base64: string, height: number, width: number) {
        const newImage: UserImage = {
            id: new Date().getTime(),
            date: new Date(),
            imageBase64: base64,
            height: height,
            width: width,
        }
        return this._storedImages.pipe(
            take(1),
            tap((images) => {
                this._storedImages.next(images.concat(newImage))
                this.updateLocalStorage()
            })
        )
    }

    delete(id: number) {
        return this._storedImages.pipe(
            take(1),
            tap(images => {
                this._storedImages.next(images.filter((img) => img.id !== id));
                this.updateLocalStorage();
            })
        )
    }

    getAllImage() {
        return this._storedImages.asObservable();
    }

    mergePdf(selections: UserSelectedImage[], name: string) {
        const nBlob = this.utilityService.imagesToPdfBlob(selections);
        return this.saveBlobToCachedDir(nBlob, name).then(() => {
            this.socialSharing.share("Sharing PDF", null, `${this.file.externalCacheDirectory}/${name}`, null);
        });
    }

    shareMultipleFiles(images: UserSelectedImage[]) {
        let imagesName = [];
        for (let index in images) {
            let image = images[index];
            imagesName.push(`${this.file.externalCacheDirectory}/${image.date}.pdf`);
            const nBlob = this.utilityService.imageToPdfBlob(image);
            this.saveBlobToCachedDir(nBlob, `${image.date}.pdf`);
        }
        return this.socialSharing.share("Sharing PDFs", null, imagesName, null);
    }

    updateLocalStorage() {
        this._storedImages.subscribe(images => {
            this.storage.set('imagesInfo', images);
        })
    }

    saveToDownloadDir(croppedImage) {
        const nBlob = this.utilityService.imageToPdfBlob(croppedImage);
        return this.file.writeFile(this.file.externalRootDirectory + "/Download", `${new Date().getTime()}.pdf`, nBlob);
    }

    sharePdf(croppedImage, name: string) {
        const nBlob = this.utilityService.imageToPdfBlob(croppedImage);
        return this.saveBlobToCachedDir(nBlob, name).then(() => {
            this.socialSharing.share("Sharing PDF", null, `${this.file.externalCacheDirectory}/${name}`, null);
        });
    }

    saveBlobToCachedDir(blob, name) {
        return this.file.writeFile(this.file.externalCacheDirectory, name, blob);
    }
}
