import * as multer from 'multer';
import { randomBytes } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../../public/uploads');

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    randomBytes(12, function (err, bytes) {
      if (err) return cb(err, null);

      const fn = bytes.toString('hex') + path.extname(file.originalname);
      cb(null, fn);
    });
  },
});

const upload = {
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
};

export default upload;
