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
  const documentFormats = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  const isVideo = videoFormats.includes(file.mimetype);
  const isDocument = documentFormats.includes(file.mimetype);

  if (isVideo || isDocument) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Only MP4, MKV, PDF, DOCX, and other allowed formats are allowed!',
      ),
    );
  }
}
@Controller('document')
export class DocumentController {
  constructor() {}

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
    @Req() req: Request,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const type = file.mimetype.startsWith('video/') ? 'videos' : 'files';

    // const dto: UploadDto = {
    //   type:type,
    //   name: file.filename,
    //   content: filePath,
    // };

    // const upload = await this.lmsService.addPage(dto);

    // return upload;
  }

  @Get(':type/:name')
  async serveFile(@Req() req: Request, @Res() res: Response) {
    const type = req.params.type;
    const name = req.params.name;
    const rootDirectory =
      type === 'videos' ? './documents/videos' : './documents/files';
    res.sendFile(`${name}`, { root: rootDirectory });
  }
}
