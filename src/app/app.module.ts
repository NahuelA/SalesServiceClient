import { NgModule } from "@angular/core";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { AppLayoutModule } from "./layout/app.layout.module";
import { ProductService } from "./demo/service/product.service";
import { CustomerService } from "./demo/service/customer.service";
import {
    HttpClient,
    HttpClientModule,
    provideHttpClient,
    withInterceptors,
} from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { RadioButtonModule } from "primeng/radiobutton";
import { CalendarModule } from "primeng/calendar";
import { DropdownModule } from "primeng/dropdown";
import { FileUploadModule } from "primeng/fileupload";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { ConfirmPopupModule } from "primeng/confirmpopup";
import { EmployeeService } from "./demo/service/employee.service";
import { SaleService } from "./demo/service/sale.service";
import { ReceiptService } from "./demo/service/receipt.service";
import { authInterceptor } from "./demo/interceptors/auth.interceptor";
import { AuthenticationService } from "./demo/service/authentication.service";
import { EmailService } from "./demo/service/email.service";
import { ReminderService } from "./demo/service/reminder.service";

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
    return new TranslateHttpLoader(httpClient);
}

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        RadioButtonModule,
        DropdownModule,
        CalendarModule,
        FileUploadModule,
        TableModule,
        ConfirmPopupModule,
        ButtonModule,
        AppRoutingModule,
        AppLayoutModule,
    ],

    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        CustomerService,
        ProductService,
        EmployeeService,
        SaleService,
        ReceiptService,
        AuthenticationService,
        EmailService,
        ReminderService,
        provideHttpClient(withInterceptors([authInterceptor])),
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
