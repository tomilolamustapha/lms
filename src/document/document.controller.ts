import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { diskStorage, FileFilterCallback } from 'multer';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { CourseService } from 'src/course/course.service';
import { UserGuard } from 'src/common/guards';

function makeid(length: number) {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const storage = diskStorage({
  destination: (req, file, cb) => {
    const isVideo = file.mimetype.startsWith('video/');
    const destination = isVideo ? './documents/videos' : './documents/files';
    cb(null, destination);
  },
  filename: (req, file, cb) => {
    const filename: string = makeid(10);
    const extension: string = extname(file.originalname);
    cb(null, `${filename}${extension}`);
  },
});

function filter(req: any, file: any, cb: FileFilterCallback) {
  const videoFormats = ['video/mp4', 'video/mkv'];
  const documentFormats = ['application/pdf', 'text/plain'];

  const isVideo = videoFormats.includes(file.mimetype);
  const isDocument = documentFormats.includes(file.mimetype);

  if (isVideo || isDocument) {
    cb(null, true);
  } else {
    req.fileFilterError = new Error(
      'Only MP4, MKV, PDF, TXT, and other allowed formats are allowed!',
    );
    cb(null, false);
  }
}
@UseGuards(UserGuard)
@Controller('document')
export class DocumentController {
  constructor(private readonly courseService: CourseService) {}

  @Get('')
  course(@Req() req: Request, @Res() res: Response) {
    res.send('hello');
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: storage,
      fileFilter: filter,
    }),
  )
  async uploadFile(
    @Req() req: Request & { fileFilterError?: Error },
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { id, title, instruction ,duration} = req.body;
    try {
      if (req.fileFilterError) {
        throw req.fileFilterError;
      }

      const type = file.mimetype.startsWith('video/') ? 'videos' : 'files';

      if (type === 'videos') {
        const upload = await this.courseService.uploadVideo(
          +id,
          title,
          file.filename,
          instruction,
          duration,
        );
        req.flash('success', upload.message);
        res.redirect(`/tutor/my-courses/course/${id}`);
      } else {
        const upload = await this.courseService.uploadDocument(
          +id,
          title,
          file.filename,
          instruction,
          duration,
        );
        req.flash('success', upload.message);
        res.redirect(`/tutor/my-courses/course/${id}`);
      }
    } catch (error) {
      req.flash('error', error.message);
      res.redirect(`/tutor/my-courses/course/${id}/upload`);
    }
  }

  @Get(':type/:name')
  async serveFile(@Req() req: Request, @Res() res: Response) {
    const type = req.params.type;
    const name = req.params.name;
    var rootDirectory = '';
    if (type === 'Video') {
      rootDirectory = './documents/videos';
    } else {
      rootDirectory = './documents/files';
    }
    res.sendFile(`${name}`, { root: rootDirectory });
  }
}
