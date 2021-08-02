import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity({ name: "accounts_settings"})
export class Settings {

    @PrimaryGeneratedColumn()
    user_id!: number;

    @Column()
    visible!: number;

    @Column()
    show_email!: number;

    @Column()
    show_battletag!: number;

    @Column()
    manage_guild!: number;
};

