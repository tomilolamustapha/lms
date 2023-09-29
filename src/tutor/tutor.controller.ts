import { Controller, Get, Render } from '@nestjs/common';

@Controller('tutor')
export class TutorController {
  constructor() {}
  @Get('')
  @Render('dashboard/tutor')
  dashboard() {}
}
