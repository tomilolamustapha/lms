import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class EmailService {
    constructor(@InjectQueue('email')
    private emailQueue:Queue,
    ){}

    async sendQueuedEmail(data: any): Promise<{ jobId: number | string }> {
        const job = await this.emailQueue.add(data);
        console.log(`Job with id ${job.id} added to the email queue`);
        return { jobId: job.id };
      }

    }
