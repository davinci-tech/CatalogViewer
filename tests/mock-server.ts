/// Run with: npx ts-node-dev mock-server.ts

// server.ts
import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = 3000;

// Enable URL-encoded form parsing
app.use(express.urlencoded({ extended: true }));

// Mock database
const mockData: Record<string, any[][]> = {
    matters: [
        ['MATH_ID', '', 'Mathematics', '', ''],
        ['PHYS_ID', '', 'Physics', '', '']
    ],
    catalognote: [
        [uuidv4(), '', '', '610023', 'MATH_ID', '9', '2023-10-05', '', '', new Date().toISOString()],
        [uuidv4(), '', '', '610023', 'MATH_ID', '10', '2023-10-05', '', '', new Date().toISOString()],
        [uuidv4(), '', '', '610023', 'MATH_ID', '10', '2023-10-05', '', '', new Date().toISOString()],
        [uuidv4(), '', '', '610023', 'PHYS_ID', '8', '2023-10-06', '', '', new Date().toISOString()]
    ],
    catalogabsent: [
        [uuidv4(), '', '', '610023', 'MATH_ID', '2023-10-05', '1', '', '', new Date().toISOString()],
        [uuidv4(), '', '', '610023', 'PHYS_ID', '2025-05-23', '0', '', '', new Date().toISOString()]
    ],
    // necesar_note: [
    //     [uuidv4(), 'CATALOG_1', 'MATH_ID', 'CLASS_1', '5'],
    //     [uuidv4(), 'CATALOG_2', 'PHYS_ID', 'CLASS_2', '7']
    // ],
    // students: [
    //     [uuidv4(), 'CATALOG_1', 'CLASS_1', 'John Student', 'john.student']
    // ]
};

// Single endpoint that handles all requests
app.post('/_api/app_parinti/v20_server_service.php', (req: Request, res: Response) => {
    const table = req.body.table;

    if (!mockData[table]) {
      res.status(404).json({
          status: 'error',
          message: 'Table not found'
      });
      return;
    }

    // Return mock data in the expected format
    res.json({
        status: 'ok',
        data: JSON.stringify(mockData[table])
    });
});

app.listen(PORT, () => {
    console.log(`Simple API server running on http://localhost:${PORT}`);
});
