import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Table } from "primeng/table";
import { MessageService, ConfirmationService } from "primeng/api";
import { ProductService } from "../../service/product.service";
import { Product } from "../../contracts/product";
import { Subscription } from "rxjs";

@Component({
    templateUrl: "./product.component.html",
    providers: [MessageService, ConfirmationService],
})
export class ProductComponent implements OnInit {
    title: string = "Productos";
    searchPlaceholder: string = "Buscar producto";

    products?: Product[] = [];
    private _routeSubscription: Subscription;

    product: Product = {};
    submitted: boolean = false;
    dialog: boolean = false;

    idFrozen: boolean = false;

    loading: boolean = true;

    deleteDialog: boolean = false;
    updateDialog: boolean = false;

    categories: any[] = [
        { label: "Hogar y muebles", value: "HOGAR_Y_MUEBLES" },
        { label: "Electrodomésticos", value: "ELECTRODOMESTICOS" },
        { label: "Tecnología", value: "TECNOLOGIA" },
        { label: "Belleza y cuidado", value: "BELLEZA_Y_CUIDADO_PERSONAL" },
        { label: "Accesorios", value: "ACCESORIOS" },
        { label: "Herramientas", value: "HERRAMIENTAS" },
        { label: "Industrias y oficinas", value: "INDUSTRIAS_Y_OFICINAS" },
        { label: "Computación", value: "COMPUTACION" },
        {
            label: "Electrónica | audio-video",
            value: "ELECTRONICA_AUDIO_Y_VIDEO",
        },
        { label: "Celulares", value: "CELULARES_Y_TELEFONOS" },
    ];

    @ViewChild("filter") filter!: ElementRef;

    constructor(
        private _productService: ProductService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this._productService.get().subscribe((products) => {
            this.products = products.data;
            this.loading = false;
        });

        this._routeSubscription = this._productService.refresh$.subscribe(
            () => {
                this._productService.get().subscribe((products) => {
                    this.products = products.data;
                    this.loading = false;
                });
            }
        );
    }

    ngOnDestroy(): void {
        this._routeSubscription.unsubscribe();
    }

    openNew() {
        this.product = {};
        this.submitted = false;
        this.dialog = true;
    }

    openUpdateDialog(product: Product) {
        this.updateDialog = true;
        this.product = product;
    }

    openDeleteDialog(product: Product) {
        this.deleteDialog = true;
        this.product = product;
    }

    hideUpdateDialog() {
        this.updateDialog = false;
    }

    hideDeleteDialog() {
        this.deleteDialog = false;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            "startsWith"
        );
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = "";
    }

    hideDialog() {
        this.dialog = false;
        this.submitted = false;
    }

    saveProduct() {
        this.submitted = true;
        this.dialog = false;

        this._productService.add(this.product).subscribe({
            next: (product) => {
                this.messageService.add({
                    severity: "success",
                    summary: product.message,
                    life: 3000,
                });
            },
            error: ({ error }: any) => {
                if (error.errors !== null)
                    error?.errors?.map((x) => {
                        this.messageService.add({
                            severity: "error",
                            summary: x.errorMessage,
                            life: 4000,
                        });
                    });
                else
                    this.messageService.add({
                        severity: "error",
                        summary: error.message,
                        life: 3000,
                    });
            },
        });
    }

    remove() {
        this.deleteDialog = false;

        this._productService.delete(this.product.code).subscribe({
            next: (product) => {
                this.messageService.add({
                    severity: "success",
                    summary: product.message,
                    life: 3000,
                });
                this._productService.get().subscribe((products) => {
                    this.products = products.data;
                    this.loading = false;
                });
            },
            error: ({ error }) => {
                this.messageService.add({
                    severity: "error",
                    summary: error.message,
                    life: 3000,
                });
            },
        });
    }

    update() {
        this.updateDialog = false;

        this._productService.update(this.product.code, this.product).subscribe({
            next: (product) => {
                this.messageService.add({
                    severity: "success",
                    summary: product.message,
                    life: 3000,
                });
            },
            error: ({ error }: any) => {
                if (error.errors !== null)
                    error?.errors?.map((x) => {
                        this.messageService.add({
                            severity: "error",
                            summary: x.errorMessage,
                            life: 4000,
                        });
                    });
                else
                    this.messageService.add({
                        severity: "error",
                        summary: error.message,
                        life: 3000,
                    });
            },
        });
    }
}
