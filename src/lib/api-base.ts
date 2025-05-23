export class BaseAPI {
    protected static readonly TAUTHORIZATION = 'c3d33eac43e8a0c9';
    protected static readonly APIKEY = '993a775e83ab2a875060a921f1e61c7e3c690e99';
    protected static readonly URL = ['https://noteincatalog.ro/_api/app_parinti/v20_server_service.php', 'http://localhost:3000/_api/app_parinti/v20_server_service.php'][0];
    protected static readonly STUDENT_ID = '610023';

    protected static getHeaders(): Headers {
        const headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('tAuthorization', this.TAUTHORIZATION);
        return headers;
    }
}
