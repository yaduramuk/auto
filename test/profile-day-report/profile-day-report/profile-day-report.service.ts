import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Transaction, TransactionRepository } from 'typeorm';
import { App } from '@common/App';
import { Props } from '@constants/Props';
import { ProfileDayReport } from "./profile-day-report.entity";

@Injectable()
export class ProfileDayReportService {

    @InjectRepository(ProfileDayReport)
    private profileDayReportRepository: Repository<ProfileDayReport>;
    public sessionInfo: any;

    constructor() {}

    async entity(id: any) {
        try {
            let query:any =  { id: id};
            let data: any = await this.profileDayReportRepository.findOne(query, {
                relations: [],
                join: {
                    alias: "ProfileDayReport",
                    leftJoinAndSelect: {
                    }
                }
            });

            return data ? data : null;
        } catch (error) {
            throw error;
        }
    }

    async search(item: any) {
        try {
            let query: any = {};
            if (item) {
                query = item
            }
            // if(item.fromDate && item.toDate){
            //     query.updatedOn = Between(new Date(item.fromDate).toISOString(), new Date(item.toDate).toISOString());
            // } else {
            //     throw { message: Props.INVALID_DATA };
            // }
            let data: any[] = await this.profileDayReportRepository.find({
                relations: [],
                where: query
            });

            return data ? data : null;
        } catch (error) {
            throw error;
        }
    }

    @Transaction()
    async save(item: any,
        @TransactionRepository(ProfileDayReport) profileDayReportRepository?: Repository<ProfileDayReport>
        ) {
        try {
            await this.validate(item);
            let ProfileDayReportData: any = await profileDayReportRepository.save(item);
            let returnData = { id: item.id, message: Props.SAVED_SUCCESSFULLY };
            return returnData;
        } catch (error) {
            throw error;
        }
    }

    @Transaction()
    async saveBatch(items: ProfileDayReport[],
        @TransactionRepository(ProfileDayReport) profileDayReportRepository?: Repository<ProfileDayReport>
        ) {
        try {
            for (let item of items) {
                await this.validate(item);
            }
            let ProfileDayReportData: any = await profileDayReportRepository.save(items);
            let returnData = items.map(ele => {
                return { id: ele.id, message: Props.SAVED_SUCCESSFULLY }
            })
            return returnData;
        } catch (error) {
            throw error;
        }
    }

    @Transaction()
    async toggle(id: any, @TransactionRepository(ProfileDayReport) profileDayReportRepository?: Repository<ProfileDayReport>) {
        try {
            let data: any = await profileDayReportRepository.findOne(id);
            if (!data) throw { message: Props.RECORD_NOT_EXISTS };
            data.active = !data.active;
            data.updatedBy = this.sessionInfo.id;
            data.updatedOn = new Date(App.DateNow());
            let result: any = await profileDayReportRepository.save(data);
            let returnData = { id: id, message: Props.REMOVED_SUCCESSFULLY };
            return returnData;
        } catch (error) {
            throw error;
        }
    }

    @Transaction()
    async delete(id: any, @TransactionRepository(ProfileDayReport) profileDayReportRepository?: Repository<ProfileDayReport>) {
        try {
            let data: any = await profileDayReportRepository.findOne(id);
            if (!data) throw { message: Props.RECORD_NOT_EXISTS }; 
            let result: any = await profileDayReportRepository.delete(data);
            let returnData = { id: id, message: Props.REMOVED_SUCCESSFULLY };
            return returnData;
        } catch (error) {
            throw error;
        }
    }

    async validate(item: ProfileDayReport){
        if (!item.id || item.id.toString() == "" || item.id.toString() == "0") {
            item.id = null;
        }
        if (!item.id) {
          let uid = App.uuidv4();
          item.id = uid;
          item.createdBy = this.sessionInfo ? this.sessionInfo.id : 'system';
          item.createdOn = new Date(App.DateNow());
        }
        item.updatedBy = this.sessionInfo ? this.sessionInfo.id : 'system';
        item.updatedOn = new Date(App.DateNow());
    }
}