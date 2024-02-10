import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Table } from "primeng/table";
import { MessageService, ConfirmationService } from "primeng/api";
import { ProductService } from "../../service/product.service";
import { Product } from "../../contracts/product";
import { CustomResponse } from "../../contracts/response";
import { Subscription } from "rxjs";
import { ActivatedRoute, Params } from "@angular/router";

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

    selectedEmployee: Product = {};

    idFrozen: boolean = false;

    loading: boolean = true;

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
        this._productService.get().subscribe((products: CustomResponse) => {
            this.products = products.result as Product[];
            this.loading = false;
        });

        this._routeSubscription = this._productService.refresh$.subscribe(
            () => {
                this._productService
                    .get()
                    .subscribe((products: CustomResponse) => {
                        this.products = products.result as Product[];
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

        this._productService
            .add(this.product)
            .subscribe((product: CustomResponse) => {
                this.messageService.add({
                    severity: "success",
                    summary: "Registro creado con éxito",
                    detail: product.result.toString(),
                    life: 3000,
                });

                if (product.statusCode === 400)
                    this.messageService.add({
                        severity: "error",
                        summary:
                            "Hubo un error al registrar el producto, inténtalo de nuevo.",
                        detail: product.result.toString(),
                        life: 3000,
                    });
            });

        // if (this.employee.username) {
        //     if (this.product.id) {
        //         // @ts-ignore
        //         this.product.inventoryStatus = this.product.inventoryStatus
        //             .value
        //             ? this.product.inventoryStatus.value
        //             : this.product.inventoryStatus;
        //         this.products[this.findIndexById(this.product.id)] =
        //             this.product;
        //         this.messageService.add({
        //             severity: "success",
        //             summary: "Successful",
        //             detail: "Product Updated",
        //             life: 3000,
        //         });
        //     } else {
        //         this.product.id = this.createId();
        //         this.product.code = this.createId();
        //         this.product.image = "product-placeholder.svg";
        //         // @ts-ignore
        //         this.product.inventoryStatus = this.product.inventoryStatus
        //             ? this.product.inventoryStatus.value
        //             : "INSTOCK";
        //         this.products.push(this.product);
        //         this.messageService.add({
        //             severity: "success",
        //             summary: "Successful",
        //             detail: "Product Created",
        //             life: 3000,
        //         });
        //     }

        //     this.products = [...this.products];
        //     this.productDialog = false;
        //     this.product = {};
        // }
    }
}
