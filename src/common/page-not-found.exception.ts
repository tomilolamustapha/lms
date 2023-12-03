import {
  ExceptionFilter,
  Catch,
  NotFoundException,
  ArgumentsHost,
} from '@nestjs/common';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // Handle 404 response here, render a 'not-found.pug' page, or redirect

    response.status(404).render('response/page-not-found'); // Assuming you have a 'not-found.pug' page
  }
}
