import { Component, OnInit } from "@angular/core";

import {
    Capacitor,
    Plugins,
    CameraSource,
    CameraResultType,
} from "@capacitor/core";

const { Toast, App } = Plugins;

import { StorageService } from "../shared/storage.service";
import { ImageCroppedEvent } from "ngx-image-cropper";
import { Platform, IonRouterOutlet } from "@ionic/angular";

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
        private storage: StorageService,
        private platform: Platform,
        private routerOutlet: IonRouterOutlet
    ) {
        this.platform.backButton.subscribeWithPriority(1, () => {
            alert()
            if (!this.routerOutlet.canGoBack()) {
                App.exitApp();
            }
        });
    }

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
        }).then((image) => {
            this.loadedImage = image.dataUrl;
        }).catch((err) => {
            console.error("error");
            console.log(err);
        });
    }

    croppedImage(event: ImageCroppedEvent) {
        this.userCroppedImage = event;
    }

    onCropImage() {
        if (this.userCroppedImage) {
            this.storage.set(this.userCroppedImage.base64, this.userCroppedImage.height, this.userCroppedImage.width).subscribe(() => {
                Toast.show({
                    text: "Saved Cropped Image"
                })
                this.onCropCancle()
            })
        }
    }

    onCropCancle() {
        this.loadedImage = null;
    }
}
