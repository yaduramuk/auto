import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProfileDayReportService } from './profile-day-report/profile-day-report.service';
import { ProfileDayReportResolver } from './profile-day-report/profile-day-report.resolver';
import { ProfileDayReport } from './profile-day-report/profile-day-report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProfileDayReport])],
  providers: [ProfileDayReportResolver, ProfileDayReportService],
})
export class ProfileDayReportModule {}