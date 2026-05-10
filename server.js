const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use('/outputs', express.static('outputs'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

app.post('/remove-password', upload.single('pdf'), (req, res) => {
  const password = req.body.password;

  if (!req.file || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please upload PDF and enter password.'
    });
  }

  const inputPath = req.file.path;
  const outputFileName = 'unlocked-' + req.file.filename;
  const outputPath = path.join('outputs', outputFileName);

  const command = `qpdf --password="${password}" --decrypt "${inputPath}" "${outputPath}"`;

  exec(command, (error) => {
    fs.unlinkSync(inputPath);

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Wrong password or unsupported PDF.'
      });
    }

    res.json({
      success: true,
      message: 'Password removed successfully.',
      download: `/outputs/${outputFileName}`
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});