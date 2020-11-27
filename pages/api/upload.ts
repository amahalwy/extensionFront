import { NextApiRequest, NextApiResponse } from 'next';

import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';

const spacesEndpoint = new aws.Endpoint('nyc3.digitaloceanspaces.com');
const s3 = new aws.S3({
  endpoint: spacesEndpoint,
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'codecapture',
    acl: 'public-read',
    key: function (request, file, cb) {
      cb(null, file.originalname);
    },
  }),
}).single('file');

export const config = {
  api: {
    bodyParser: false,
  },
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  return new Promise((resolve, reject) =>
    // @ts-ignore
    upload(req, res, function (error: any, ...other) {
      if (error) {
        console.log(error);
        res.json({ error });
        return reject();
      }

      console.log('File uploaded successfully.');
      // @ts-ignore
      res.json({ success: true, file: true, ...req.file });
      return resolve();
    }),
  );
};
