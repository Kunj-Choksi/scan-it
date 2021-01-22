import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { ImageCroppedEvent } from "ngx-image-cropper";

@Component({
    selector: "app-cropper",
    templateUrl: "./cropper.page.html",
    styleUrls: ["./cropper.page.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CropperPage implements OnInit {
    @Input() image = '';

    private userCroppedImage;

    constructor(private modalCtrl: ModalController) { }

    onClose() {
        this.modalCtrl.dismiss();
    }

    croppedImage(event: ImageCroppedEvent) {
        this.userCroppedImage = event;
    }

    onCropImage() {
        this.modalCtrl.dismiss({ croppedImage: this.userCroppedImage });
    }

    ngOnInit() {}
}
