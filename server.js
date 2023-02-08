const express = require('express');
const path = require('path');

const app = express();
const protocol = 'http';
const host = 'localhost';
const port = 4200;
const fileDirectory = path.resolve(__dirname, './dist');

app.use(express.static(fileDirectory));
app.get('*', (_req, res) => {
	res.sendFile('index.html', { root: fileDirectory }, err => {
		res.end();

		if (err) {
			console.log(err);
		}
	});
});

app.listen(port, () => console.log(`App listening at ${protocol}://${host}:${port}`));
