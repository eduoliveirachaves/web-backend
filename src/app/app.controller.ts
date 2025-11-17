import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  healthCheck(): { status: string; timestamp: number } {
    return { status: 'ok', timestamp: Date.now() };
  }
}
