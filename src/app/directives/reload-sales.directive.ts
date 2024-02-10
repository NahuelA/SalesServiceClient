import {
    Directive,
    Input,
    OnChanges,
    SimpleChanges,
    TemplateRef,
    ViewContainerRef,
} from "@angular/core";
import { Sale } from "../demo/contracts/sale";

@Directive({
    selector: "[appReloadSales]",
    standalone: true,
})
export class ReloadSalesDirective implements OnChanges {
    @Input() reloadSales: Sale[];
    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainerRef: ViewContainerRef
    ) {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["appReloadSales"]) {
            this.viewContainerRef.clear();
            this.viewContainerRef.createEmbeddedView(this.templateRef);
        }
    }
}
