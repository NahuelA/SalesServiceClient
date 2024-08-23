import { Component, OnInit, OnDestroy } from "@angular/core";
import { MenuItem } from "primeng/api";
import { Subscription, debounceTime } from "rxjs";
import { LayoutService } from "src/app/layout/service/app.layout.service";
import { SaleService } from "../../service/sale.service";
import { Sale } from "../../contracts/sale";
import { AnalyticsService } from "../../service/analytics.service";
import { SaleOverviewDto } from "../../contracts/Dtos/saleOverviewDto";
import { CustomerOverviewDto } from "../../contracts/Dtos/customerOverviewDto";
import { GrossRevenueOverview } from "../../contracts/Dtos/grossRevenueOverviewDto";

@Component({
    templateUrl: "./dashboard.component.html",
    styleUrl: "../../../../assets/demo/styles/dashboard.scss",
})
export class DashboardComponent implements OnInit, OnDestroy {
    items!: MenuItem[];
    limit: number = 50;

    date: string[] = new Date().toLocaleDateString("es-AR").split("/");
    sales!: Sale[];
    sale: Sale = {};
    dialogForSeeSale: boolean = false;

    saleOverview: SaleOverviewDto = {};
    customerOverview: CustomerOverviewDto = {};
    grossRevenueOverview: GrossRevenueOverview = {};
    salesData: any;
    spotSalesData: any;
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
    spotSalesR: any;

    chartOptions: any;

    subscription!: Subscription;

    constructor(
        private salesService: SaleService,
        private analyticsService: AnalyticsService,
        public layoutService: LayoutService
    ) {
        this.subscription = this.layoutService.configUpdate$
            .pipe(debounceTime(25))
            .subscribe((config) => {
                this.initChart();
            });
    }

    ngOnInit() {
        this.salesService.get(this.limit).subscribe((data: any) => {
            this.sales = data.result as Sale[];
        });

        this.analyticsService.get(2024).subscribe((data: any) => {
            this.spotSalesR = data.result?.profit; // Spot sales
            this.monthlyCollectionDataR = data.result?.collect; // Fee * Fees collected
            this.salesDataR = data.result?.sales; // Total sales
            this.initChart();
        });

        var month = Number.parseInt(this.date.at(1));
        var year = Number.parseInt(this.date.at(2));

        this.analyticsService.saleOverview(month, year).subscribe({
            next: (saleOverview) => {
                this.saleOverview = saleOverview;
            },
        });

        this.analyticsService.customerOverview(month, year).subscribe({
            next: (customerOverview) => {
                this.customerOverview = customerOverview;
            },
        });

        this.analyticsService.grossRevenueOverview(month, year).subscribe({
            next: (grossRevenue) => {
                this.grossRevenueOverview = grossRevenue;
            },
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

        this.spotSalesData = {
            labels: this.months,
            datasets: [
                {
                    label: "Dinero de ventas al contado",
                    data: this.spotSalesR,
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
                    label: "Dinero a cuotas",
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

    seeSaleDialog(sale: Sale) {
        this.dialogForSeeSale = true;
        this.sale = sale;
    }

    hideDialogForSaleDetails() {
        this.dialogForSeeSale = false;
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
