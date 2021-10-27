export class ResultModel {
    Status: boolean = false;
    Data:   object = {};
    Message: string = "NA";
    Errors: Array<any> = [];
    Permission: object = {};
    AdminPermission: object = {};
}