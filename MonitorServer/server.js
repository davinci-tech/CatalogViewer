const express = require('express');
const morgan = require('morgan');
const axios = require('axios');
const { URLSearchParams } = require('url');
const app = express();
const port = process.env.PORT || 3000;

const TAUTHORIZATION = 'c3d33eac43e8a0c9';
const APIKEY = '993a775e83ab2a875060a921f1e61c7e3c690e99';
const API_URL = 'https://noteincatalog.ro/_api/app_parinti/v20_server_service.php';

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${day} ${month} ${year} ${hours}:${minutes}`;
}

async function fetchTable(tableName) {
    const params = new URLSearchParams({
        iselev: 'true',
        apikey: APIKEY,
        idstudent: '610023',
        limitsup: '800',
        action: 'ACTION_GETDATABASE',
        encryption_key: '',
        limitinf: '0',
        table: tableName
    });

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'tAuthorization': TAUTHORIZATION
    };

    try {
        const response = await axios.post(API_URL, params, { headers });
        if (!response.data || response.data.status !== 'ok') return null;
        return JSON.parse(response.data.data);
    } catch (error) {
        console.error('API Error:', error.message);
        return null;
    }
}

// Setup logging
app.use(morgan('combined'));

app.get('/grades', async (req, res) => {
    try {
        // Fetch raw data from external API
        const [scoresData, subjectsData] = await Promise.all([
            fetchTable('catalognote'),
            fetchTable('matters')
        ]);

        if (!scoresData || !subjectsData) {
            return res.status(500).send('Error fetching data from external API');
        }

        // Process subjects into a lookup map
        const subjects = subjectsData.reduce((acc, subject) => {
            acc[subject[0]] = subject[2].replace(/^\d+\.\s*/, ''); // Clean subject name
            return acc;
        }, {});

        // Process and format grades
        const formattedGrades = scoresData
            .map(entry => ({
                id: parseInt(entry[0]),
                subjectId: entry[4],
                score: entry[5].padStart(2, ' '),
                date: formatDate(entry[6]),
                processed: formatDate(entry[9])
            }))
            .filter(grade => subjects[grade.subjectId]) // Filter invalid subjects
            .map(grade => ({
                ...grade,
                subject: subjects[grade.subjectId]
            }))
            .sort((a, b) => a.id - b.id) // Sort by grade ID
            .map(grade =>
                `[id ${grade.id}] [date ${grade.date}] [proc ${grade.processed}]    ${grade.score} ${grade.subject}`
            );

        res.set('Content-Type', 'text/plain');
        return res.send(formattedGrades.join('\n'));
    } catch (error) {
        console.error('Server Error:', error.message);
        return res.status(500).send('Internal Server Error');
    }
});

app.get('/absences', async (req, res) => {
    try {
        // Fetch raw data from external API
        const [absencesData, subjectsData] = await Promise.all([
            fetchTable('catalogabsent'),
            fetchTable('matters')
        ]);

        if (!absencesData || !subjectsData) {
            return res.status(500).send('Error fetching data from external API');
        }

        // Process subjects into a lookup map
        const subjects = subjectsData.reduce((acc, subject) => {
            acc[subject[0]] = subject[2].replace(/^\d+\.\s*/, ''); // Clean subject name
            return acc;
        }, {});

        // Process and format absences
        const formattedAbsences = absencesData
            .map(entry => ({
                id: parseInt(entry[0]),
                subjectId: entry[4],
                date: formatDate(entry[5]),
                processed: formatDate(entry[9]),
                motivated: parseInt(entry[6]) === 1 ? '✅' : '❌'
            }))
            .filter(absence => subjects[absence.subjectId]) // Filter invalid subjects
            .map(absence => ({
                ...absence,
                subject: subjects[absence.subjectId]
            }))
            .sort((a, b) => a.id - b.id) // Sort by absence ID
            .map(absence =>
                `[id ${absence.id}] [date ${absence.date}] [proc ${absence.processed}]    ${absence.motivated} ${absence.subject}`
            );

        res.set('Content-Type', 'text/plain');
        return res.send(formattedAbsences.join('\n'));
    } catch (error) {
        console.error('Server Error:', error.message);
        return res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
