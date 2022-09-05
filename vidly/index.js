const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const genres = [
    { id:1, name:'Shojo' },
    { id:2, name:'Shonen' },
    { id:3, name:'Echhi' },
];

app.get('/api/genres', (req, res) => {
    res.send(genres);
});

// HTTP GET (getting data)
app.get('/api/genres/:id', (req, res) => {
    const genre = genres.find( c => c.id === parseInt(req.params.id) );
    if (!genre) return res.status(404).send('The genre with the given ID was not found.')
    res.send(genre);
});

// HTTP POST (adding data)
app.post('/api/genres', (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
        const genre = {
            id: genres.length + 1,
            name: req.body.name
        };
        genres.push(genre);
        res.send(genre);
});

// HTTP PUT (updating data)
app.put('/api/genres/:id', (req, res) => {
    const genre = genres.find( c => c.id === parseInt(req.params.id) );
    if (!genre) return res.status(404).send('The genre with the given ID was not found');
    
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    genre.name = req.body.name;
    res.send(genre);
});

// HTTP DELETE (deleting data)
app.delete('/api/genres/:id', (req, res) => {
    const genre  = genres.find( c => c.id === parseInt(req.params.id) );
    if (!genre) return res.status(404).send('The genre with the given ID was not found');

    const index = genres.indexOf(genre);
    genres.splice(index, 1);

    res.send(genre);
});

// Validate
function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string().min(5).required()
    });
    
    return schema.validate({ name: genre.name });
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`))