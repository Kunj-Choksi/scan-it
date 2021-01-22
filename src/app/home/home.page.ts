import { Component, OnInit } from "@angular/core";
import { Camera } from "@ionic-native/camera/ngx";

import {
    Capacitor,
    Plugins,
    CameraSource,
    CameraResultType,
} from "@capacitor/core";
import { ModalController } from "@ionic/angular";
import { CropperPage } from "../cropper/cropper.page";
import { StorageService } from "../shared/storage.service";
import { ImageCroppedEvent } from "ngx-image-cropper";

@Component({
    selector: "app-home",
    templateUrl: "home.page.html",
    styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit {
    public images = [];
    public userCroppedImage;
    public loadedImage: string;

    constructor(
        private camera: Camera,
        private modalCtrl: ModalController,
        private storage: StorageService
    ) { }

    ngOnInit() { }

    captureimage() {
        if (!Capacitor.isPluginAvailable("Camera")) {
            return;
        }
        Plugins.Camera.getPhoto({
            quality: 100,
            source: CameraSource.Camera,
            correctOrientation: true,
            height: 3120,
            width: 1440,
            resultType: CameraResultType.DataUrl,
        })
            .then((image) => {
                this.loadedImage = image.dataUrl;
                /* this.modalCtrl
                    .create({
                        component: CropperPage,
                        componentProps: {
                            image: image.dataUrl
                        },
                    })
                    .then((modalComp) => {
                        modalComp.present();
                        return modalComp.onDidDismiss();
                    })
                    .then((responseData) => {
                        if (responseData && responseData.data && responseData.data.userCroppedImage) {
                            this.userCroppedImage = responseData.data.userCroppedImage.base64;
                            this.storage.set(this.userCroppedImage);
                        }
                    }); */
            })
            .catch((err) => {
                console.error("error");
                console.log(err);
            });

    }

    croppedImage(event: ImageCroppedEvent) {
        this.userCroppedImage = event;
    }

    onCropImage() {
        if (this.userCroppedImage) {
            this.storage.set(this.userCroppedImage);
            this.onCropCancle()
        }
    }

    onCropCancle() {
        this.loadedImage = null;
    }
}
