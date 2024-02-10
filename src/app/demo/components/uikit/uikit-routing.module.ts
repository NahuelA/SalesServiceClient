import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: "charts",
                data: { breadcrumb: "Charts" },
                loadChildren: () =>
                    import("./charts/chartsdemo.module").then(
                        (m) => m.ChartsDemoModule
                    ),
            },
            {
                path: "list",
                data: { breadcrumb: "List" },
                loadChildren: () =>
                    import("./list/listdemo.module").then(
                        (m) => m.ListDemoModule
                    ),
            },
            {
                path: "media",
                data: { breadcrumb: "Media" },
                loadChildren: () =>
                    import("./media/mediademo.module").then(
                        (m) => m.MediaDemoModule
                    ),
            },
            {
                path: "panel",
                data: { breadcrumb: "Panel" },
                loadChildren: () =>
                    import("./panels/panelsdemo.module").then(
                        (m) => m.PanelsDemoModule
                    ),
            },
            { path: "**", redirectTo: "/notfound" },
        ]),
    ],
    exports: [RouterModule],
})
export class UIkitRoutingModule {}
