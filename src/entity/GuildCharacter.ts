import { 
    Entity, 
    Column,
    PrimaryColumn
} from "typeorm";
import { Length } from "class-validator";

@Entity()
export class GuildCharacter {

    @PrimaryColumn()
    guild_id! : number;

    @Column()
    @Length(32)
    name! : string;

    @Column()
    @Length(4)
    rank! : number;

    @Column()
    @Length(5)
    level! : number;

    @Column()
    @Length(4)
    class! : number;

    @Column()
    @Length(4)
    race! : number;

    @Column()
    @Length(4)
    gender! : number;

    @Column()
    @Length(11)
    achievement_points! : number;

    @Column()
    @Length(15)
    spec_name! : string;

    @Column()
    @Length(8)
    spec_role! : string;

    @Column()
    @Length(64)
    thumpnail! : string;







}