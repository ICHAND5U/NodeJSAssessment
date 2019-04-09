import { StudentEntity } from "../entity/student";
import { getManager } from "typeorm";

export class StudentRepo {

    getStudents(arg) {

        return getManager().getRepository(StudentEntity).find(arg);
    }

    saveStudent(student: StudentEntity) {
        return getManager().getRepository(StudentEntity).save(student);
    }

    updateStudent(prm1, prm2) {
        return getManager().getRepository(StudentEntity).update(prm1, prm2);
    }

}