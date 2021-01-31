import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, Platform } from '@ionic/angular';

import { StorageService } from '../shared/storage.service';
import { UtilityService } from '../shared/utility.service';

import { UserSelectedImage } from '../models/user-images.model';

import { Plugins } from '@capacitor/core';
import { Subscription } from 'rxjs';
const { Toast } = Plugins;

@Component({
    selector: 'app-list',
    templateUrl: './list.page.html',
    styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit, OnDestroy {
    savedImages: UserSelectedImage[];
    imagesInfoSub: Subscription;
    currentViewMode = "none";
    selectedImagesCount = 0;

    pressed(info) {
        this.currentViewMode = "selecting";
        if (!info.selected) {
            this.selectedImagesCount += 1;
        }
        info.selected = true;
    }

    openOptionMenu() {
        this.actionSheetCtrl.create({
            header: "Select Options",
            translucent: true,
            buttons: [{
                text: "Merge and Share",
                icon: "documents-outline",
                handler: () => {
                    const name = `Merg_${new Date().getTime()}.pdf`;
                    const userSelection = this.savedImages.slice().filter(item => {
                        return item.selected;
                    })
                    this.storage.mergePdf(userSelection, name).then(() => {
                        this.actionSheetCtrl.dismiss();
                    });
                }
            },
            {
                text: "Save all to device",
                icon: "save",
                handler: () => {

                    let totalSaved = 0;
                    for (const image of this.getSelectedImages()) {
                        this.storage.saveToDownloadDir(image).then(() => {
                            totalSaved += 1;
                            if (totalSaved === this.selectedImagesCount) {
                                Toast.show({
                                    text: "Saved All PDF in Downloads folder!"
                                })
                                this.actionSheetCtrl.dismiss();
                            }
                        })
                    }
                }
            },
            {
                text: "Share all",
                icon: "share",
                handler: () => {
                    this.storage.shareMultipleFiles(this.getSelectedImages()).then(() => {
                        this.actionSheetCtrl.dismiss();
                    })
                }
            },
            {
                text: "Delete all",
                icon: "trash",
                handler: () => {
                    let totalDeleted = 0;
                    for (let image of this.getSelectedImages()) {
                        this.storage.delete(image.id).subscribe(() => {
                            totalDeleted += 1;
                            if (totalDeleted === this.getSelectedImages().length) {
                                Toast.show({
                                    text: "Deleted all"
                                })
                            }
                        })
                    }
                    this.selectedImagesCount = 0;
                    this.currentViewMode = "none";
                }
            }],
        }).then(actionSheetCompo => {
            actionSheetCompo.present();
        })
    }

    selectAll() {
        this.selectedImagesCount = this.savedImages.length;
        for (let image of this.savedImages) {
            image.selected = true;
        }
    }

    deSelectAll() {
        for (const image of this.savedImages) {
            image.selected = false;
        }
        this.selectedImagesCount = 0;
        this.currentViewMode = "none";
    }

    onMoreOptions(info) {
        if (this.currentViewMode == "none") {
            this.actionSheetCtrl.create({
                header: "Choose Action",
                translucent: true,
                buttons: [
                    {
                        text: "Select",
                        icon: "checkbox-outline",
                        handler: () => {
                            this.currentViewMode = 'selecting';
                            info.selected = true;
                            this.selectedImagesCount += 1;
                            this.actionSheetCtrl.dismiss();
                        }
                    },
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
        } else {
            if (info.selected) {
                this.selectedImagesCount -= 1;
            } else {
                this.selectedImagesCount += 1;
            }
            info.selected = !info.selected;
        }
    }

    getSelectedImages() {
        return this.savedImages.slice().filter(image => {
            return image.selected;
        })
    }

    constructor(
        private storage: StorageService,
        private utility: UtilityService,
        private router: Router,
        private actionSheetCtrl: ActionSheetController,
        private platform: Platform
    ) {
        this.platform.backButton.subscribeWithPriority(10, () => {
            if (this.currentViewMode === "selecting") {
                this.currentViewMode = "none";
                this.deSelectAll();
                return;
            }
            this.router.navigateByUrl("/home");
        });
    }

    ionViewWillEnter() {
        setTimeout(() => {
            this.imagesInfoSub = this.storage.getAllImage().subscribe((imagesInfo) => {
                if (imagesInfo) {
                    this.savedImages = [];
                    for (var image of imagesInfo) {
                        let url = this.utility.getBrowserUrl(image.imageBase64.replace("data:image/jpeg;base64,", ""), "image/jpeg");
                        this.savedImages.push({
                            id: image.id,
                            url: url,
                            imageEncoded: image.imageBase64,
                            date: new Date(image.date).getTime(),
                            selected: false,
                            height: image.height,
                            width: image.width,
                        });
                    }
                }
            });
        }, 200)
    }

    ionViewWillLeave() {
        this.savedImages = [];
        if (this.imagesInfoSub) {
            this.imagesInfoSub.unsubscribe();
        }
        this.currentViewMode = "none";
        this.selectedImagesCount = 0;
    }

    ngOnInit() { }

    ngOnDestroy() {
        if (this.imagesInfoSub) {
            this.imagesInfoSub.unsubscribe();
        }
    }

}
