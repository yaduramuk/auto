import { ObjectType, Field } from '@nestjs/graphql';
	import JSON from 'graphql-type-json'
	import { HotelModel } from '@hotel/hotel.model';
@ObjectType()
export class ProfileDayReportModel {

	@Field({ nullable: true })
  id:string
	@Field({ nullable: true })
  profileId:string
	@Field({ nullable: true })
  dayDate:Date
	@Field( (type)=> JSON,{ nullable: true })
  data:JSON
	@Field({ nullable: true })
  shift:string
	@Field({ nullable: true })
  note:string
	@Field({ nullable: true })
  locked:boolean
	@Field({ nullable: true })
  priority:string
	@Field({ nullable: true })
  active:boolean
	@Field({ nullable: true })
  createdBy:string
	@Field({ nullable: true })
  createdOn:Date
	@Field({ nullable: true })
  updatedBy:string
	@Field({ nullable: true })
  updatedOn:Date

@Field({ nullable: true })
message: string | null;
}
