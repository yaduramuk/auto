import { InputType, Field } from '@nestjs/graphql';
	import JSON from 'graphql-type-json'
	import { HotelInput } from '@hotel/hotel.input';

@InputType()
export class ProfileDayReportInput {

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

}

@InputType()
export class ProfileDayReportSearchInput {

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

}

@InputType()
export class ProfileDayReportEntityInput {

  @Field({ nullable: true })
  id: string;

}

@InputType()
export class ProfileDayReportToggleInput {

  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  active:boolean

}
