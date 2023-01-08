import { HttpException } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { SessionInfo } from '@middle-wares/session-info.decorator';
import { Roles } from '@middle-wares/roles.decorator';

import { ProfileDayReportService } from "./profile-day-report.service";
import { ProfileDayReportInput, ProfileDayReportSearchInput, ProfileDayReportEntityInput, ProfileDayReportToggleInput } from './profile-day-report.input';
import { ProfileDayReportModel } from './profile-day-report.model';

@Resolver()
export class ProfileDayReportResolver {

constructor(private service: ProfileDayReportService) { }

@Roles() //'profile-day-report', 'read_access'
@Query(() => [ProfileDayReportModel]) // Search @SessionInfo() sessionInfo: any
async ProfileDayReportSearch(@Args('input') input: ProfileDayReportSearchInput) {
    try {
        // this.service.sessionInfo = sessionInfo;
        const data = JSON.parse(JSON.stringify(input));
        return await this.service.search(data);
    } catch (error) {
        console.log(error);
        throw new HttpException(error, 600)
    }
}

@Roles() //'profile-day-report', 'read_access'
@Query(() => ProfileDayReportModel) // Entity @SessionInfo() sessionInfo: any
async ProfileDayReportEntity(@Args('input') input:  ProfileDayReportEntityInput) {
    try {
        // this.service.sessionInfo = sessionInfo;
        const data = JSON.parse(JSON.stringify(input.id));
        return await this.service.entity(data);
    } catch (error) {
        console.log(error);
        throw new HttpException(error, 600)
    }
}

@Roles('profile-day-report', 'write_access') //'profile-day-report', 'write_access'
@Mutation(() => ProfileDayReportModel) // Save
async ProfileDayReportSave(@Args('input') input: ProfileDayReportInput, @SessionInfo() sessionInfo: any) {
    try {
        this.service.sessionInfo = sessionInfo;
        const data = JSON.parse(JSON.stringify(input));
        return await this.service.save(data);
    } catch (error) {
        console.error(error);
        throw new HttpException(error, 600)
    }
}

@Roles('profile-day-report', 'write_access') //'profile-day-report', 'write_access'
@Mutation(() => [ProfileDayReportModel]) // Save Batch
async ProfileDayReportSaveBatch(@Args('input', { type: () => [ProfileDayReportInput] }) input: ProfileDayReportInput[], @SessionInfo() sessionInfo: any) {
    try {
        this.service.sessionInfo = sessionInfo;
        const data = JSON.parse(JSON.stringify(input));
        return await this.service.saveBatch(data);
    } catch (error) {
        console.error(error);
        throw new HttpException(error, 600)
    }
}

@Roles('profile-day-report', 'write_access') //'profile-day-report', 'write_access'
@Mutation(() => ProfileDayReportModel) // Toggle
async ProfileDayReportToggle(@Args('input') input: ProfileDayReportToggleInput, @SessionInfo() sessionInfo: any) {
    try {
        this.service.sessionInfo = sessionInfo;
        const data = JSON.parse(JSON.stringify(input.id));
        return await this.service.toggle(data);
    } catch (error) {
        console.error(error);
        throw new HttpException(error, 600)
    }
}

@Roles('profile-day-report', 'write_access') //'profile-day-report', 'write_access'
@Mutation(() => ProfileDayReportModel) // Toggle
async ProfileDayReportDelete(@Args('input') input: ProfileDayReportToggleInput, @SessionInfo() sessionInfo: any) {
    try {
        this.service.sessionInfo = sessionInfo;
        const data = JSON.parse(JSON.stringify(input.id));
        return await this.service.delete(data);
    } catch (error) {
        console.error(error);
        throw new HttpException(error, 600)
    }
}

}