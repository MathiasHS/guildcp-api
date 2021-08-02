import {Entity, PrimaryColumn, Column} from 'typeorm';
import { Length } from 'class-validator';

@Entity({ name: "guilds" })
export class Guild {

    @PrimaryColumn()
    @Length(10)
    id!: number;

    @Column()
    @Length(6)
    region!:  string;

    @Column()
    @Length(32)
    name!: string;

    @Column()
    @Length(32)
    realm!: string;

    @Column()
    @Length(6)
    level!: number;

    @Column()
    @Length(4)
    faction!: number;

    @Column()
    @Length(10)
    achievement_points!: number;

    @Column()
    @Length(10)
    owner_id!: number;

    @Column()
    @Length(20)
    last_modified!: number;
};