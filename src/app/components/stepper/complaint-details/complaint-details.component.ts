import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { IComplaintDetails, Product } from "src/app/types";
import { FormGroupType } from "../stepper.component";
import { Question } from "src/app/questions";
import { Subject, takeUntil } from "rxjs";
import { IImageMapArea } from "./image-hotspot/image-hotspot.component";

@Component({
    selector: "app-complaint-details",
    templateUrl: "./complaint-details.component.html",
    styleUrls: ["./complaint-details.component.scss"]
})
export class ComplaintDetailsComponent implements OnInit, OnDestroy {
    @Input() form!: FormGroup<FormGroupType<IComplaintDetails>>;
    @Input() products!: Product[];
    @Input() problemDetailsQuestions!: Question[];

    @Output() nextClicked: EventEmitter<any> = new EventEmitter();

    complaintDescriptionForm!: FormGroup;

    imageHotspotValues: Question[] = [];

    selectedProduct?: Question<string> | undefined;
    currentIndex: number = 0;

    private readonly destroy$ = new Subject<void>();

    constructor(private formBuilder: FormBuilder) {
        this.imageHotspotValues = [
            {
                id: "simponi_device_failure_location",
                type: "image-map",
                required: true,
                questionText: "Image 1",
                imageUrl: "./assets/Autoinjector.png",
                areas: [
                    {
                        value: "Activation Button",
                        x: 291,
                        y: 65,
                        radius: 15,
                        mark: "6",
                        nextQuestionId: "needle_damage_type"
                    },
                    {
                        value: "Expiration Date",
                        x: 30,
                        y: 84,
                        radius: 15,
                        mark: "7",
                        nextQuestionId: "who_administered"
                    },
                    {
                        value: "Thin hidden needle",
                        x: 568,
                        y: 66,
                        radius: 15,
                        mark: "4",
                        nextQuestionId: "who_administered"
                    },
                    {
                        value: "Green Safety Sleeve",
                        x: 507,
                        y: 62,
                        radius: 15,
                        mark: "3",
                        nextQuestionId: "button_stuck"
                    },
                    {
                        value: "Tamper Evident Seal",
                        x: 422,
                        y: 59,
                        radius: 15,
                        mark: "2",
                        nextQuestionId: "who_administered"
                    }
                ]
            },
            {
                id: "pfs_before",
                type: "image-map",
                required: true,
                questionText: "Image 2",
                imageUrl: "./assets/PFS-before1.jpg",
                areas: [
                    {
                        value: "Cap",
                        x: 41.328125,
                        y: 21,
                        radius: 15,
                        mark: "1",
                        nextQuestionId: "who_administered"
                    },
                    {
                        value: "Green Safety Sleeve",
                        x: 34.328125,
                        y: 166,
                        radius: 15,
                        mark: "3",
                        nextQuestionId: "button_stuck"
                    },
                    {
                        value: "Viewing Window",
                        x: 35.328125,
                        y: 266,
                        radius: 15,
                        mark: "5",
                        nextQuestionId: "who_administered"
                    },
                    {
                        value: "Expiration Date",
                        x: 33.328125,
                        y: 360,
                        radius: 15,
                        mark: "7",
                        nextQuestionId: "needle_damage_type"
                    }
                ]
            }
        ];
    }

    ngOnInit() {
        this.selectedProduct = this.imageHotspotValues[0];

        // this.complaintDescriptionForm = this.formBuilder.group({
        //     issueDescription: [""],
        //     uploadImage: [""]
        // });

        // this.form.valueChanges
        //     .pipe(takeUntil(this.destroy$))
        //     .subscribe((value) => console.log(value));
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onProductImageChange(question: Question) {
        if (this.selectedProduct) {
            delete this.selectedProduct;
        }
        this.selectedProduct = question;
    }

    onSelectedValuesChange(selectedValues: IImageMapArea) {
        this.form.patchValue({ selectedComplaint: selectedValues.value });
    }

    resetProblemDetails() {}

    nextQuestion() {
        // console.log(this.currentIndex, this.problemDetailsQuestions);
        // if (this.currentIndex < this.problemDetailsQuestions.length - 1) {
        //     this.currentIndex++;
        // }
        this.nextClicked.emit();
    }

    previousQuestion() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        }
    }

    isLastQuestion() {
        // return true;
        return this.currentIndex === this.problemDetailsQuestions.length - 1;
    }

    submitAnswers() {
        // Handle the submission logic here
        console.log("Answers submitted!");
    }
}
