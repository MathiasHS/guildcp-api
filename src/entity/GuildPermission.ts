import {Entity, PrimaryColumn, Column} from 'typeorm';

@Entity({ name: "guilds_permissions"})
export class GuildPermission {

    @PrimaryColumn()
    guild_id!: number;
    
    @PrimaryColumn()
    user_id!: number;

    @Column()
    permissions!: number;
};