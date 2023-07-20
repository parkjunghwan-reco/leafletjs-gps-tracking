const express = require('express');
const fs = require('fs');
const csvParser = require('csv-parser');

const app = express();

const csvFolderPath = './data';

// API 엔드포인트 '/csvdata'를 생성합니다.
app.get('/csvdata', (req, res) => {
  fs.readdir(csvFolderPath, (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read directory' });
    }

    const csvFiles = files.filter((file) => file.endsWith('.csv'));
    const dataArray = [];

    const readFiles = (index) => {
      if (index === csvFiles.length) {
        return res.json(dataArray);
      }

      const filePath = `${csvFolderPath}/${csvFiles[index]}`;
      const results = [];

      fs.createReadStream(filePath)
          .pipe(csvParser())
          .on('data', (data) => results.push(data))
          .on('end', () => {
            dataArray.push(results);
            readFiles(index + 1);
          })
          .on('error', (error) => {
            console.error(error);
            return res.status(500).json({ error: 'Failed to read CSV file' });
          });
    };

    readFiles(0);
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});