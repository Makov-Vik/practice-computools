import { extname } from 'path';

export const imageFileFilter = (_req: any, file: any, callback: any) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};

export const editFileName = (_req: any, file: any, callback: any) => {
  const fileExtName = extname(file.originalname);
  const randomName = Array(10)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${randomName}${fileExtName}`);
};