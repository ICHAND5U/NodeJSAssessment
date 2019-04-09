import { TeacherStudentEntity } from "../entity/teacherStudentMap";
import { getManager } from "typeorm";

export class TeacherStudentRepo {


    getCommonStudents(arr) {
        console.log("Inside Teacher student map");
        return getManager().getRepository(TeacherStudentEntity).find({
            where: arr
        });
    }

    saveTeacherStudent(tchrStud: TeacherStudentEntity) {
        return getManager().getRepository(TeacherStudentEntity).save(tchrStud);
    }

}