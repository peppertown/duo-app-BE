import { Controller } from '@nestjs/common';
import { CoupleService } from './couple.service';

@Controller('couple')
export class CoupleController {
  constructor(private readonly coupleService: CoupleService) {}
}
