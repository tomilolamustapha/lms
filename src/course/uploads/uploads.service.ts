// import { Injectable, UploadedFile } from '@nestjs/common';
// import { Multer } from 'multer';
// import * as fs from 'fs';

// @Injectable()
// export class UploadsService {
//   constructor(private readonly multer: Multer) {}

//   async uploadVideo(@UploadedFile() file: Express.Multer.File) {
//     try {
//       if (!file.mimetype.startsWith('video/')) {
//         throw new Error(
//           'Invalid file format.Only MP4 ,MKV are allowed, Try to upload a video',
//         );
//       }

//       const videoPath = `uploads/videos/${file.filename}`;
//       await fs.promises.writeFile(videoPath, file.buffer);

//       return {
//         message: 'Video uploaded successfully',
//         filename: file.filename,
//         videoPath: videoPath,
//       };
//     } catch (error) {
//       // Handle errors, log them, and return an error response
//       throw new Error(`Failed to upload video: ${error.message}`);
//     }
//   }

//   async uploadDocument(file: Express.Multer.File) {
//     try {
//       const allowedDocumentTypes = ['application/pdf', 'application/msword'];
//       if (!allowedDocumentTypes.includes(file.mimetype)) {
//         throw new Error(
//           'Invalid document format. Please upload a PDF or Word document.',
//         );
//       }

//       const documentPath = `uploads/documents/${file.filename}`;
//       await fs.promises.writeFile(documentPath, file.buffer);

//       return {
//         message: 'Document uploaded successfully',
//         filename: file.filename,
//         documentPath: documentPath,
//       };
//     } catch (error) {
//       // Handle errors, log them, and return an error response
//       throw new Error(`Failed to upload document: ${error.message}`);
//     }
//   }
// }
