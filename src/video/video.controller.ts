import { Controller, Get, Param, Res } from '@nestjs/common';
import { SkipAuth } from 'src/common/decorators';

@Controller('public')
export class VideoController {
    
    @SkipAuth()
    @Get('courseVideo/:filename')
    async getCourseVideo(@Param('filename')filename : string,@Res() res :Response){
        res.sendFile(filename, { root: './public/courseVideo' });
    }

    

    
}


