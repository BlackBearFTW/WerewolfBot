abstract class BaseCommand {
    name: string;
    description: string;
    options?: Object;

    protected constructor(name: string, description: string, options?: Object) {
        this.name = name;
        this.description = description;
        this.options = options;
    }
}