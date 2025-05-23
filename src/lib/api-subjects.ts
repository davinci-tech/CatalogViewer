// api-subjects.ts
import { BaseAPI } from './api-base';

export interface APISubject { // Exporting APISubject
    subjectID: string;
    name: string;
    abbreviation: string;
}

interface APIResponse {
    status: string;
    data: string;
}

export class SubjectAPI extends BaseAPI { // Extending BaseAPI
    private static getFormData(): URLSearchParams {
        const params = new URLSearchParams();
        params.append('iselev', 'true');
        params.append('apikey', this.APIKEY);
        params.append('idstudent', this.STUDENT_ID); // Student ID still required
        params.append('limitsup', '800');
        params.append('action', 'ACTION_GETDATABASE');
        params.append('encryption_key', '');
        params.append('limitinf', '0');
        params.append('table', 'matters'); // Different table for subjects
        return params;
    }

    private static parseSubjectEntry(entry: any[]): APISubject {
        if (entry.length < 5) { // Ensure correct length for subject data
             // It might be better to return null or filter out invalid entries
            // rather than throwing an error that could stop all processing.
            console.error('Invalid subject entry format:', entry);
            throw new Error('Invalid subject entry format');
        }

        return {
            subjectID: String(entry[0]),
            name: String(entry[2]),
            abbreviation: String(entry[4])
        };
    }

    public static async fetchSubjects(): Promise<APISubject[]> {
        try {
            const response = await fetch(this.URL, {
                method: 'POST',
                headers: this.getHeaders(),
                body: this.getFormData().toString() // .toString() is important
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

            const rawData = JSON.parse(responseData.data);
            
            if (!Array.isArray(rawData)) {
                console.error('Invalid data format received from API. Expected array in "data" field.', rawData);
                throw new Error('Invalid data format received from API. Expected array in "data" field.');
            }
            
            const subjects: APISubject[] = [];
            for (const entry of rawData) {
                try {
                    subjects.push(SubjectAPI.parseSubjectEntry(entry));
                } catch (parseError) {
                    console.warn('Skipping invalid subject entry due to parsing error:', parseError, entry);
                }
            }
            return subjects;

        } catch (error) {
            console.error('Failed to fetch subjects:', error);
            // Return empty array to prevent page crash on API error.
            return [];
        }
    }
}
