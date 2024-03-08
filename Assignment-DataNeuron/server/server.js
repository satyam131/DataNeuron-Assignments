const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();
const PORT = 5000;
const MONGODB_URI = 'mongodb://localhost:27017/resizecomps';

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

const Schema = mongoose.Schema;

const componentSchema = new Schema({
    id: String,
    data: String,
});

const Component = mongoose.model('Component', componentSchema);

let addCount = 0;
let updateCount = 0;

app.post('/api/addData/:id', async (req, res) => {
    const startTime = new Date();
    const { id } = req.params;
    const { data } = req.body;

    try {
        if (id && data !== undefined) {
            const component = await Component.findOneAndUpdate(
                { id },
                { data },
                { upsert: true, new: true }
            );

            addCount += 1;

            res.json({ success: true, message: 'Data added successfully.', component });
        } else {
            res.status(400).json({ success: false, message: 'Invalid request.' });
        }
    } catch (error) {
        console.error('Error adding data:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }

    //For calculating execution time of each API
    const endTime = new Date();
    console.log(`Execution time for /api/addData/:id: ${endTime - startTime}ms`);
});


app.post('/api/updateData/:id', async (req, res) => {
    const startTime = new Date();
    const { id } = req.params;
    const { data } = req.body;

    try {
        if (id && data !== undefined) {
            const component = await Component.findOneAndUpdate(
                { id },
                { data },
                { upsert: true, new: true }
            );

            updateCount += 1;
        
            res.json({ success: true, message: 'Data updated successfully.', component });
        } else {
            res.status(400).json({ success: false, message: 'Invalid request.' });
        }
    } catch (error) {
        console.error('Error updating data:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
    //For calculating execution time of each API
    const endTime = new Date();
    console.log(`Execution time for /api/updateData/:id: ${endTime - startTime}ms`);
});



app.get('/api/getCount', (req, res) => {
    const startTime = new Date();
    res.json({ addCount, updateCount });

    //For calculating execution time of each API
    const endTime = new Date();
    console.log(`Execution time for /api/getCount/:id: ${endTime - startTime}ms`);
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
