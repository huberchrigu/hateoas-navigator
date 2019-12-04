export class RelativeLink {
    constructor(private href: string) {
    }

    getUri(): string {
        return this.href;
    }
}
