import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class DocumentLocationService {
    getParams(location: Location) {
        const params = location.href.split("?")?.at(1)?.split("&");

        return params;
    }

    getLimit(location: Location) {
        const limit: number = parseInt(
            this.getParams(location)?.at(0)?.split("=")?.at(0)
        );

        return limit;
    }

    getDniOrId(location: Location) {
        const href = location.href.split("/");
        const hrefLength = location.href.split("/").length;
        const match = href.at(hrefLength - 1).match("[0-9]+");

        // If the url not contains numbers, return false
        if (match === null) return 0;

        const dniOrId: number = Number.parseInt(href.at(hrefLength - 1));

        return dniOrId;
    }
}
