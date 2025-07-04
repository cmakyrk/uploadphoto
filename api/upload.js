import { google } from 'googleapis';
import formidable from 'formidable';
import fs from 'fs';

// Vercel'in varsayılan gövde ayrıştırıcısını (body parser) bu rota için devre dışı bırakıyoruz.
// Bu, formidable'ın dosya yüklemesini doğru şekilde işlemesi için kritik öneme sahiptir.
export const config = {
  api: {
    bodyParser: false,
  },
};

// Google Drive API için kimlik doğrulama
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const drive = google.drive({ version: 'v3', auth });

// Ortam değişkeninden hedef klasör ID'sini alıyoruz.
const folderId = process.env.GOOGLE_FOLDER_ID;

// Google Drive'a tek bir dosya yüklemek için yardımcı fonksiyon
const uploadToDrive = (file) => {
  return new Promise((resolve, reject) => {
    // formidable, dosyayı sunucusuz fonksiyonun geçici bir alanına kaydeder.
    // Biz de bu geçici dosyadan bir okuma akışı (read stream) oluşturuyoruz.
    const fileStream = fs.createReadStream(file.filepath);

    const driveRequest = drive.files.create(
      {
        requestBody: {
          name: file.originalFilename,
          parents: [folderId],
        },
        media: {
          mimeType: file.mimetype,
          body: fileStream,
        },
      },
      (err, res) => {
        if (err) {
          console.error('Google Drive API Hatası:', err);
          return reject(err);
        }
        // Yükleme tamamlandıktan sonra geçici dosyayı siliyoruz.
        fs.unlinkSync(file.filepath);
        resolve(res);
      }
    );
  });
};

// Vercel sunucusuz fonksiyonumuzun ana işleyicisi
export default async function handler(req, res) {
  // Sadece POST isteklerini kabul et
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const form = formidable({});
    // formidable v3, gelen isteği ayrıştırır ve bir promise döndürür.
    // 'files' nesnesi, yüklenen dosyaları içerir.
    const [fields, files] = await form.parse(req);

    // Gelen tüm dosyaları paralel olarak Google Drive'a yüklemeyi deniyoruz.
    const uploadPromises = Object.values(files).flatMap(f => 
        Array.isArray(f) ? f.map(uploadToDrive) : [uploadToDrive(f)]
    );
    
    await Promise.all(uploadPromises);

    res.status(200).json({ success: true, message: 'Harika, anılarınız bize ulaştı!' });
  } catch (error) {
    console.error('Sunucu Hatası:', error);
    res.status(500).json({ success: false, message: 'Dosyalar yüklenirken sunucuda bir hata oluştu.' });
  }
} 