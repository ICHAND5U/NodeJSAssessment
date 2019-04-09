import { TeacherEntity } from "../entity/teacher";
import { getManager } from "typeorm";

export class TeacherRepo {

    getAllTeachers() {

        return getManager().getRepository(TeacherEntity).find();
    }

    saveTeacher(teacher: TeacherEntity) {
        return getManager().getRepository(TeacherEntity).save(teacher);
    }

}