// api-grades.ts
export interface APIGrade { // Exporting APIGrade
    studentID: string;
    subjectID: string;
    score: number;
    date: Date;
    lastUpdate: Date;
}

interface APIResponse {
    status: string;
    data: string;
}

export class GradeAPI { // Exporting GradeAPI
    private static readonly TAUTHORIZATION = 'c3d33eac43e8a0c9';
    private static readonly APIKEY = '993a775e83ab2a875060a921f1e61c7e3c690e99';
    private static readonly URL = 'https://noteincatalog.ro/_api/app_parinti/v20_server_service.php';
    private static readonly STUDENT_ID = '610023';

    private static getHeaders(): Headers {
        const headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('tAuthorization', GradeAPI.TAUTHORIZATION);
        return headers;
    }

    private static getFormData(): URLSearchParams {
        const params = new URLSearchParams();
        params.append('iselev', 'true');
        params.append('apikey', GradeAPI.APIKEY);
        params.append('idstudent', GradeAPI.STUDENT_ID);
        params.append('limitsup', '800');
        params.append('action', 'ACTION_GETDATABASE');
        params.append('encryption_key', '');
        params.append('limitinf', '0');
        params.append('table', 'catalognote');
        return params;
    }

    private static parseGradeEntry(entry: any[]): APIGrade {
        if (entry.length < 10) {
            // It might be better to return null or filter out invalid entries
            // rather than throwing an error that could stop all processing.
            // For now, sticking to the provided logic.
            console.error('Invalid grade entry format:', entry);
            throw new Error('Invalid grade entry format');
        }

        return {
            studentID: String(entry[3]),
            subjectID: String(entry[4]),
            score: Number.parseFloat(entry[5]),
            date: new Date(entry[6]),
            lastUpdate: new Date(entry[9])
        };
    }

    public static async fetchGrades(): Promise<APIGrade[]> {
        try {
            const response = await fetch(GradeAPI.URL, {
                method: 'POST',
                headers: GradeAPI.getHeaders(),
                body: GradeAPI.getFormData().toString() // .toString() is important for URLSearchParams with fetch body
            });

            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status}`, await response.text());
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData: APIResponse = await response.json();
            
            if (responseData.status !== 'ok') {
                console.error(`API error: ${responseData.status}`, responseData);
                throw new Error(`API error: ${responseData.status}`);
            }

            // The data field is a JSON string, so it needs to be parsed again.
            const rawData = JSON.parse(responseData.data); 
            
            if (!Array.isArray(rawData)) {
                console.error('Invalid data format received from API. Expected array in "data" field.', rawData);
                throw new Error('Invalid data format received from API. Expected array in "data" field.');
            }
            
            // Filter out entries that don't parse correctly if parseGradeEntry can throw
            const grades: APIGrade[] = [];
            for (const entry of rawData) {
                try {
                    grades.push(GradeAPI.parseGradeEntry(entry));
                } catch (parseError) {
                    console.warn('Skipping invalid grade entry due to parsing error:', parseError, entry);
                }
            }
            return grades;

        } catch (error) {
            console.error('Failed to fetch grades:', error);
            // Instead of re-throwing, which might crash the page, 
            // consider returning an empty array or a specific error object.
            // For now, re-throwing as per original structure (implicitly).
            // Return empty array to prevent page crash on API error.
            return []; 
        }
    }
}
