import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";


@Entity("teacher_student_map")
export class TeacherStudentEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 100
    })
    teacherEmailAddress: string;

    @Column({
        length: 100
    })
    studentEmailAddress: string;
}