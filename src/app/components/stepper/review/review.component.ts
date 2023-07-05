import { Component, Input } from "@angular/core";

@Component({
    selector: "app-review",
    templateUrl: "./review.component.html",
    styleUrls: ["./review.component.scss"]
})
export class ReviewComponent {
    @Input() complaintSubmitted!: boolean;
    @Input() formControls: any;

    privacyPolicyChecked = false;

    submitComplaint(): void {
        this.complaintSubmitted = true;
    }
}
