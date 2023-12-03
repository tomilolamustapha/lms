import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserGuard } from 'src/common/guards';
import { TutorService } from './tutor.service';
import { CourseService } from 'src/course/course.service';
import { AdminService } from 'src/admin/admin.service';
import { diskStorage, FileFilterCallback } from 'multer';
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

@UseGuards(UserGuard)
@Controller('tutor')
export class TutorController {
  constructor(
    private readonly adminService: AdminService,
    private readonly tutorService: TutorService,
    private readonly courseService: CourseService,
  ) {}
  @Get('')
  async dashboard(@Req() req: Request, @Res() res: Response) {
    const message = res.locals.message;
    const payload: any = req.user;

    const stats = await this.tutorService.getTutorStats(payload.user.id);
    const ulpoadedCourses = await this.courseService.getRecentlyUploadedCourses(
      payload.user.id,
    );

    res.render('tutor/dashboard', {
      message,
      user: payload.user,
      stats: stats,
      recentCourses: ulpoadedCourses,
    });
  }

  @Get('my-courses')
  async course(@Req() req: Request, @Res() res: Response) {
    const message = res.locals.message;
    const payload: any = req.user;

    const courses = await this.tutorService.getAllTutorCourse(payload.user.id);

    res.render('tutor/my-course', {
      message,
      user: payload.user,
      courses: courses.allCourse,
    });
  }

  @Get('my-courses/add-course')
  addCoursePage(@Req() req: Request, @Res() res: Response) {
    const message = res.locals.message;
    const payload: any = req.user;

    res.render('tutor/add-course', {
      message,
      user: payload.user,
    });
  }

  @Post('my-courses/add-course')
  async addCourse(@Req() req: Request, @Res() res: Response) {
    const payload: any = req.user;

    try {
      const course = await this.courseService.createCourse(
        req.body,
        payload.user.id,
      );

      req.flash('success', course.mesaage);
      res.redirect('/tutor/my-courses');
    } catch (error) {
      req.flash('error', error.message);
      res.redirect('/tutor/my-courses/add-course');
    }
  }

  @Get('my-courses/course/:id')
  async viewCoursePage(@Req() req: Request, @Res() res: Response) {
    const message = res.locals.message;
    const payload: any = req.user;

    const course = await this.courseService.getCourseById(+req.params.id);

    res.render('tutor/view-course', {
      message,
      user: payload.user,
      course: course.data,
    });
  }

  @Get('my-courses/course/:id/upload')
  async upload(@Req() req: Request, @Res() res: Response) {
    const message = res.locals.message;
    const payload: any = req.user;

    const course = await this.courseService.getCourseById(+req.params.id);

    res.render('tutor/content-upload', {
      message,
      user: payload.user,
      course: course.data,
    });
  }
}
