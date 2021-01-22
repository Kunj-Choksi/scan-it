import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding } from '@ionic/angular';

import { StorageService } from '../shared/storage.service';
import { UtilityService } from '../shared/utility.service';

import { Plugins } from '@capacitor/core';
const { Toast } = Plugins;

@Component({
    selector: 'app-list',
    templateUrl: './list.page.html',
    styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
    savedImages = [];
    constructor(
        private storage: StorageService,
        private utility: UtilityService,
        private router: Router,
    ) { }

    ionViewWillEnter() {
        try {
            const imagesInfo = this.storage.getAllImage();
            for (var image of imagesInfo) {
                let url = this.utility.getBrowserUrl(image.imageBase64.replace("data:image/jpeg;base64,", ""), "image/jpeg");
                this.savedImages.push({ id: image.id, url: url, imageEncoded: image.imageBase64, date: new Date(image.date).getTime() });
            }
        } catch (error) {
            this.router.navigateByUrl('/home');
        }
    }
    pdfSave(info, slider: IonItemSliding) {
        slider.close();
        this.storage.saveToDownloadDir(info).then(() => {
            Toast.show({
                text: "Saved PDF in Downloads folder!"
            })
        });
    }

    pdfShare(info, slider: IonItemSliding) {
        slider.close();
        const name = `${new Date().getTime()}.pdf`;
        this.storage.sharePdf(info, name).then(() => {
            // shared
        })
    }

    delete(info) {
        console.log(info);
        this.storage.delete(info.id)
    }

    ionViewWillLeave() {
        this.savedImages = [];
    }

    ngOnInit() { }

}
