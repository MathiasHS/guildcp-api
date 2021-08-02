import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn
} from "typeorm";
import { Length } from "class-validator";


@Entity({ name: 'guilds_events'})
export class GuildEvent {

    @PrimaryGeneratedColumn()
    @Length(10)
    id! : number;

    @Column()
    guild_id!: number;

    @Column()
    @Length(32)
    name! : string;

    @Column()
    @Length(256)
    description! : string;

    @Column()
    time! : Date
};