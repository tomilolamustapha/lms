import { Module } from '@nestjs/common';
import { MulterOptionsFactory } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({})
export class MulterModule  implements MulterOptionsFactory{
    createMulterOptions(): MulterOptions | Promise<MulterOptions> {
      return{
          storage: diskStorage({
              destination: './uploads',
              filename(req, file, callback) {
                  //Generate a unique filename
                  const randomName = Array(32)
                  .fill(null)
                  .map(() => Math.round(Math.random() * 16).toString(16))
                  .join('');
                  callback(null,  `${randomName}${extname(file.originalname)}`)
              },
          })
      }
  }
  }
