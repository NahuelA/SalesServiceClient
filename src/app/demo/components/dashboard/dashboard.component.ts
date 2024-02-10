import { Component, OnInit, OnDestroy } from "@angular/core";
import { MenuItem } from "primeng/api";
import { Subscription, debounceTime } from "rxjs";
import { LayoutService } from "src/app/layout/service/app.layout.service";
import { SaleService } from "../../service/sale.service";
import { Sale } from "../../contracts/sale";
import { CustomResponse } from "../../contracts/response";
import { ProfitService } from "../../service/profit.service";

@Component({
    templateUrl: "./dashboard.component.html",
})
export class DashboardComponent implements OnInit, OnDestroy {
    items!: MenuItem[];
    limit: number = 50;

    sales!: Sale[];
    dialogForSeeSale: boolean = false;

    salesData: any;
    profit: any;
    monthlyCollection: any;

    months: any = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
    ];

    salesDataR: any = [];
    monthlyCollectionDataR: any = [];
    profitDataR: any;

    chartOptions: any;

    subscription!: Subscription;

    constructor(
        private salesService: SaleService,
        private profitService: ProfitService,
        public layoutService: LayoutService
    ) {
        this.subscription = this.layoutService.configUpdate$
            .pipe(debounceTime(25))
            .subscribe((config) => {
                this.initChart();
            });
    }

    ngOnInit() {
        this.salesService.get(this.limit).subscribe((data: CustomResponse) => {
            this.sales = data.result as Sale[];
        });

        this.profitService.get(2024).subscribe((data: any) => {
            this.profitDataR = data.result?.profit; // Fee * Total fees
            this.monthlyCollectionDataR = data.result.collect; // Fee * Fees collected
            this.salesDataR = data.result.sales; // Total sales
            this.initChart();
        });
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue("--text-color");
        const textColorSecondary = documentStyle.getPropertyValue(
            "--text-color-secondary"
        );
        const surfaceBorder =
            documentStyle.getPropertyValue("--surface-border");

        this.salesData = {
            labels: this.months,
            datasets: [
                {
                    label: "Cantidad de ventas",
                    data: this.salesDataR,
                    fill: true,
                    backgroundColor:
                        documentStyle.getPropertyValue("--purple-800"),
                    borderColor: documentStyle.getPropertyValue("--purple-400"),
                    tension: 0.4,
                },
            ],
        };

        this.profit = {
            labels: this.months,
            datasets: [
                {
                    label: "Ganancia mensual",
                    data: this.profitDataR,
                    fill: true,
                    backgroundColor:
                        documentStyle.getPropertyValue("--green-800"),
                    borderColor: documentStyle.getPropertyValue("--green-400"),
                    tension: 0.4,
                },
            ],
        };

        this.monthlyCollection = {
            labels: this.months,
            datasets: [
                {
                    label: "Dinero cobrado",
                    data: this.monthlyCollectionDataR,
                    fill: true,
                    backgroundColor:
                        documentStyle.getPropertyValue("--orange-800"),
                    borderColor: documentStyle.getPropertyValue("--orange-400"),
                    tension: 0.4,
                },
            ],
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
                y: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
            },
        };
    }

    seeProductDialog() {
        this.dialogForSeeSale = true;
    }

    hideDialogForProductDetails() {
        this.dialogForSeeSale = false;
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
