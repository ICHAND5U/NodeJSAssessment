import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("student")
export class StudentEntity {

    @PrimaryColumn({
        length: 100
    })
    emailAddress: string;

    @Column({
        length: 50
    })
    status: string;
}