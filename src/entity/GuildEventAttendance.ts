import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    PrimaryColumn
} from "typeorm";
import { Length } from "class-validator";

@Entity({ name: 'guilds_events_attendance' })
export class GuildEventAttendance {

    @PrimaryColumn("int")
    @Length(10)
    event_id!: number;

    @PrimaryColumn("int")
    user_id!: number;

    @Column()
    attending!: number;
};