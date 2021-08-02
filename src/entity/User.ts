import {
    Entity, 
    PrimaryGeneratedColumn, 
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
    OneToMany
} from "typeorm";
import { Length } from 'class-validator';
import * as bcrypt from 'bcryptjs';

@Entity({name: 'accounts'})
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    @Length(4, 32)
    username!: string;

    @Column()
    @Length(6, 175)
    password!: string;

    @Column()
    @Length(2, 4)
    region!: string;

    @Column()
    @Length(6, 16)
    battletag!: string;

    @Column()
    @Length(6, 254)
    email!: string;

    @Column()
    @CreateDateColumn()
    joined_date!: Date;

    @Column()
    @UpdateDateColumn()
    last_login_date!: Date;
    
    @Column()
    @UpdateDateColumn()
    last_sync_date!: Date;

    /* Funker ikke sånn, da prøver den 
    @OneToOne(type => Settings, setting => setting.user_id)
    @JoinColumn()
    settings: Settings;
    */
    /*@OneToMany(type => GuildPermission, permission => permission.user_id)
    guild_permissions!: GuildPermission[];
    */

    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 12);
    }

    checkIfUnencryptedPasswordisValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }
};
