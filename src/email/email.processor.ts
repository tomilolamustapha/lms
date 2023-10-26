import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process } from '@nestjs/bull';
import { Controller } from '@nestjs/common';
import { Job } from 'bull';

@Controller('email')
export class EmailProcessor {
    //constructor(private mailService: MailerService) { }
    @Process()
    //

    @OnQueueActive()
    onActive(job: Job) {
        console.log(`Job ${job.id} started`);
    }

    @OnQueueCompleted()
    onComplete(job: Job, result: any) {
        console.log(`Job ${job.id} completed with result:`, result);
    }

    @OnQueueFailed()
    onError(job: Job, error: Error) {
        console.error(`Job ${job.id} failed with error:`, error);
    }
}
