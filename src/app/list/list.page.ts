import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, Platform } from '@ionic/angular';

import { StorageService } from '../shared/storage.service';
import { UtilityService } from '../shared/utility.service';

import { Plugins } from '@capacitor/core';
import { Subscription } from 'rxjs';
const { Toast } = Plugins;

@Component({
    selector: 'app-list',
    templateUrl: './list.page.html',
    styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit, OnDestroy {
    savedImages = [];
    imagesInfoSub: Subscription;
    constructor(
        private storage: StorageService,
        private utility: UtilityService,
        private router: Router,
        private actionSheetCtrl: ActionSheetController,
        private platform: Platform
    ) {
        this.platform.backButton.subscribeWithPriority(10, () => {
            this.router.navigateByUrl("/home");
        });
    }

    ionViewWillEnter() {
        this.imagesInfoSub = this.storage.getAllImage().subscribe((imagesInfo) => {
            if (imagesInfo) {
                this.savedImages = [];
                for (var image of imagesInfo) {
                    let url = this.utility.getBrowserUrl(image.imageBase64.replace("data:image/jpeg;base64,", ""), "image/jpeg");
                    this.savedImages.push({ id: image.id, url: url, imageEncoded: image.imageBase64, date: new Date(image.date).getTime() });
                }
            }
        });
    }

    onMoreOptions(info) {
        this.actionSheetCtrl.create({
            header: "Choose Action",
            translucent: true,
            buttons: [
                {
                    text: "Save to device",
                    icon: "save",
                    handler: () => {
                        this.storage.saveToDownloadDir(info).then(() => {
                            Toast.show({
                                text: "Saved PDF in Downloads folder!"
                            })
                            this.actionSheetCtrl.dismiss();
                        });
                    }
                },
                {
                    text: "Share",
                    icon: "share",
                    handler: () => {
                        const name = `${new Date().getTime()}.pdf`;
                        this.storage.sharePdf(info, name).then(() => {
                            // shared
                            this.actionSheetCtrl.dismiss();
                        })
                    }
                },
                {
                    text: "Delete",
                    icon: "trash",
                    handler: () => {
                        this.storage.delete(info.id).subscribe(res => {
                            Toast.show({
                                text: "Deleted"
                            })
                            this.actionSheetCtrl.dismiss()
                        })
                    }
                }
            ]
        }).then((actionSheetHandler) => {
            actionSheetHandler.present();
        })
    }

    ionViewWillLeave() {
        this.savedImages = [];
        if (this.imagesInfoSub) {
            this.imagesInfoSub.unsubscribe();
        }
    }

    ngOnInit() { }

    ngOnDestroy() {
        if (this.imagesInfoSub) {
            this.imagesInfoSub.unsubscribe();
        }
    }

}
