import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
  	import { Hotel } from "@hotel/hotel.entity";

@Entity("profile_day_report")
export class ProfileDayReport {

@PrimaryColumn({ name:"id" })
  id:string
@Column({ name:"profile_id" })
  profileId:string
@Column({ name:"day_date" })
  dayDate:Date
@Column({ name:"data", type: "json" })
  data:JSON
@Column({ name:"shift" })
  shift:string
@Column({ name:"note" })
  note:string
@Column({ name:"locked" })
  locked:boolean
@Column({ name:"priority" })
  priority:string
@Column({ name:"active" })
  active:boolean
@Column({ name:"created_by" })
  createdBy:string
@Column({ name:"created_on" })
  createdOn:Date
@Column({ name:"updated_by" })
  updatedBy:string
@Column({ name:"updated_on" })
  updatedOn:Date

}