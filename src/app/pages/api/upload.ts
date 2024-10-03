import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

interface FileUploadResponse {
  message: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<FileUploadResponse>) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();
    form.uploadDir = "./";
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(400).json({ message: 'Error parsing form data' });
      }

      // Process the file here
      const filePath = path.join(process.cwd(), files.file?.path || '');
      fs.readFile(filePath, (err, data) => {
        if (err) {
          return res.status(500).json({ message: 'Error reading file' });
        }

        // Example: Save file to disk (in production, you'd want to use a proper storage service)
        fs.writeFile(path.join(process.cwd(), 'uploads', files.file?.name || ''), data, (err) => {
          if (err) {
            return res.status(500).json({ message: 'Error saving file' });
          }

          res.status(200).json({ message: 'File uploaded successfully' });
        });
      });
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
