// api-absents.ts
import { BaseAPI } from './api-base';

export interface APIAbsent {
    id: string;
    studentID: string;
    subjectID: string;
    date: Date;
    lastUpdate: Date;
    motivated: boolean;
}

interface APIResponse {
    status: string;
    data: string;
}

export class AbsentAPI extends BaseAPI {
    private static getFormData(): URLSearchParams {
        const params = new URLSearchParams();
        params.append('iselev', 'true');
        params.append('apikey', this.APIKEY);
        params.append('idstudent', this.STUDENT_ID);
        params.append('limitsup', '800');
        params.append('action', 'ACTION_GETDATABASE');
        params.append('encryption_key', '');
        params.append('limitinf', '0');
        params.append('table', 'catalogabsent');  // Table for absences
        return params;
    }

    private static parseAbsentEntry(entry: any[]): APIAbsent {
        if (entry.length < 10) { // entry[9] is lastUpdate, so length should be at least 10
            console.error('Invalid absent entry format:', entry);
            throw new Error('Invalid absent entry format');
        }

        return {
            id: String(entry[0]),
            studentID: String(entry[3]),
            subjectID: String(entry[4]),
            date: new Date(entry[5]), // Date is at index 5
            lastUpdate: new Date(entry[9]),
            motivated: Boolean(Number(entry[6]))  // Motivated status is at index 6
        };
    }

    public static async fetchAbsents(): Promise<APIAbsent[]> {
        try {
            const response = await fetch(this.URL, {
                method: 'POST',
                headers: this.getHeaders(),
                body: this.getFormData().toString() // Ensure body is stringified
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
            
            const absents: APIAbsent[] = [];
            for (const entry of rawData) {
                try {
                    absents.push(AbsentAPI.parseAbsentEntry(entry));
                } catch (parseError) {
                    console.warn('Skipping invalid absent entry due to parsing error:', parseError, entry);
                }
            }
            return absents;

        } catch (error) {
            console.error('Failed to fetch absences:', error);
            // Return empty array to prevent page crash on API error.
            return []; 
        }
    }
}
