class UserModel {
    public ID: number = 0;
    public GUILD: string = "";
    public CATEGORY: string = "";
    public STARTED: boolean = false;
    public CREATION_DATE: Date = new Date();
}

export default UserModel;