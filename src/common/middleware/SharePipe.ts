import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import * as path from 'path';
import * as sharp from 'sharp';
import * as fs from 'fs';

@Injectable()
export class SharpPipe implements PipeTransform<Express.Multer.File, Promise<string>> {

    async transform(video?: Express.Multer.File, folderName?: any): Promise<string> {
        if (!video?.originalname) {
          throw new BadRequestException('Invalid video');
        }
    
        const originalName = path.parse(video.originalname).name;
        const filename = Date.now() + '-' + originalName + '.png';

        const directory = path.join(process.cwd(), 'public', folderName || '');

        if (!fs.existsSync(directory)) {
          fs.mkdirSync(directory, { recursive: true });
        }
    
    
        const outputPath = path.join(directory, filename);


    
        await sharp(video.buffer)
          .resize(800)
          .webp({ effort: 3 })
          .toFile(outputPath);

          const baseUrl = process.env.ENV == 'production'
          ? process.env.PRODUCTION_BASE_URL
          : process.env.STAGING_BASE_URL || 'http://localhost:3330/';

         const route = path.relative(process.cwd(), outputPath).replace(/\\/g, '/');
    
        return baseUrl + route;
      }

}