import { Entity, Column, PrimaryColumn, ManyToMany, JoinTable } from "typeorm";

@Entity("teacher")
export class TeacherEntity {

    @PrimaryColumn({
        length: 100
    })
    emailAddress: string;
}