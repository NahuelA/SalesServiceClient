export class Sleep {
    static async sleep(ms: number) {
        new Promise((resolve) => setTimeout(resolve, ms));
    }
}
