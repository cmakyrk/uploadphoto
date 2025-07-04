const { google } = require('googleapis');
const stream = require('stream');
const express = require('express');
const multer = require('multer');

const app = express();
const upload = multer();

// Google Drive API için kimlik doğrulama
const auth = new google.auth.GoogleAuth({
  // Vercel'deki ortam değişkenlerinden alınacak
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const drive = google.drive({ version: 'v3', auth });

// 'public' klasöründeki statik dosyaları sunmak için (opsiyonel, Vercel bunu zaten yapar)
app.use(express.static('public'));

app.post('/api/upload', upload.array('files'), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'Lütfen en az bir dosya seçin.' });
  }

  // Vercel ortam değişkeninden alınacak olan hedef klasör ID'si
  const folderId = process.env.GOOGLE_FOLDER_ID;

  try {
    // Tüm dosyaları paralel olarak yüklemeyi dene
    const uploadPromises = req.files.map(file => {
      const bufferStream = new stream.PassThrough();
      bufferStream.end(file.buffer);

      return drive.files.create({
        requestBody: {
          name: file.originalname,
          parents: [folderId],
        },
        media: {
          mimeType: file.mimetype,
          body: bufferStream,
        },
      });
    });

    await Promise.all(uploadPromises);

    res.status(200).json({ success: true, message: 'Harika, anılarınız bize ulaştı!' });

  } catch (error) {
    console.error('Google Drive Yükleme Hatası:', error);
    res.status(500).json({ success: false, message: 'Dosyalar Google Drive\'a yüklenirken bir hata oluştu.' });
  }
});

// Vercel'in uygulamayı çalıştırabilmesi için export ediyoruz.
module.exports = app; 