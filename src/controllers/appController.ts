import { Request, Response } from "express";
import { StudentRepo } from "../repository/studentRepository";
import { TeacherRepo } from "../repository/teacherRepository";
import { TeacherStudentRepo } from "../repository/teacherStudentMapRepository";
import { StudentEntity } from "../entity/student";
import { TeacherEntity } from "../entity/teacher";
import { TeacherStudentEntity } from "../entity/teacherStudentMap";


// Registering Students
export let registerStudent = async (req: Request, res: Response) => {

    if (!(req.body.teacher) || (req.body.teacher.length == 0)) {
        res.status(400).json({ "message": "Teacher Email Id is Empty. Please send correct Json request" });
    } else if (req.body.students.length > 0) {
        let studentRepo: StudentRepo = new StudentRepo();
        let teacherRepo: TeacherRepo = new TeacherRepo();
        let teacherStudentRepo: TeacherStudentRepo = new TeacherStudentRepo();
        var arr = req.body.students;
        var saveTheEntity = true;
        for (var i = 0; i < arr.length; i++) {
            if (!(arr[i]) || (arr[i].length == 0)) {
                saveTheEntity = false;
                res.status(400).json({ "message": "Some Element(s) in Student List is(are) Empty. Please send correct Json request" });
                break;
            }
        }
        if (saveTheEntity) {
            for (var i = 0; i < arr.length; i++) {
                let stud: StudentEntity = new StudentEntity();
                let tchrstud: TeacherStudentEntity = new TeacherStudentEntity();
                stud.emailAddress = arr[i];
                stud.status = "Active";
                // studentArr.push(stud);
                studentRepo.saveStudent(stud);
                tchrstud.teacherEmailAddress = req.body.teacher;
                tchrstud.studentEmailAddress = arr[i];
                teacherStudentRepo.saveTeacherStudent(tchrstud);
            }
            let tchr: TeacherEntity = new TeacherEntity();
            tchr.emailAddress = req.body.teacher;
            teacherRepo.saveTeacher(tchr).then((result: any) => {
                // console.log("Result : " + result);
                // res.header('application/json');
                res.status(204).send();
            }).catch(error => {
                res.status(500).json({ "message": "Something went wrong. Please contact System administrator." })
            });
        }
    } else {
        res.status(400).json({ "message": "There is no student in the list. Please send correct Json request" });
    }
};


// Getting Common Students
export let getCommonStudents = async (req: Request, res: Response) => {
    let teacherstudentRepo: TeacherStudentRepo = new TeacherStudentRepo();
    const unique = (value, index, self) => {
        return self.indexOf(value) === index;
    }
    if (Object.keys(req.query).length !== 0) {
        var teacherArray = new Array();
        if (typeof req.query.teacher != "string") {
            for (var i = 0; i < req.query.teacher.length; i++) {
                var element = { "teacherEmailAddress": req.query.teacher[i] };
                teacherArray.push(element);
            }
            var arryOfArray = new Array();
            var studentsArray = new Array();
            teacherstudentRepo.getCommonStudents(teacherArray).then((result: any) => {
                for (var i = 0; i < req.query.teacher.length; i++) {
                    var arry = new Array();
                    for (var h = 0; h < result.length; h++) {
                        if (result[h].teacherEmailAddress.toString().trim() == req.query.teacher[i].toString().trim()) {
                            arry.push(result[h].studentEmailAddress);
                        }
                    }
                    arryOfArray.push(arry);
                }
                for (var i = 0; i < arryOfArray.length - 1; i++) {
                    for (var k = 0; k < arryOfArray[i].length; k++) {
                        for (var j = 0; j < arryOfArray[i + 1].length; j++) {
                            if (arryOfArray[i][k].toString().trim() == arryOfArray[i + 1][j].toString().trim()) {

                                studentsArray.push(arryOfArray[i + 1][j]);

                                // console.log(arryOfArray[i + 1][j]);
                            }
                        }
                    }
                    arryOfArray[i + 1] = Object.assign([], studentsArray);
                    studentsArray.splice(0, studentsArray.length);
                    // arryOfArray[i + 1]=studentsArray;
                }
                // console.log(arryOfArray[arryOfArray.length - 1]);
                res.json({ "students": arryOfArray[arryOfArray.length - 1].filter(unique) });
            }).catch(error => {
                res.status(500).json({ "message": "Something went wrong. Please contact System administrator." })
            });
        } else {
            var element = { "teacherEmailAddress": req.query.teacher };
            teacherstudentRepo.getCommonStudents(element).then((result: any) => {
                var arry = new Array();
                for (var i = 0; i < result.length; i++) {
                    arry.push(result[i].studentEmailAddress);
                }
                res.json({ "students": arry.filter(unique) });
            }).catch(error => {
                res.status(500).json({ "message": "Something went wrong. Please contact System administrator." })
            });
        }
    } else {
        res.status(400).json({ "message": "Please provide valid and complete endpoint" });
    }
};


// Susprnding Student
export let suspendStudent = async (req: Request, res: Response) => {
    if (req.body.student) {
        let studentRepo: StudentRepo = new StudentRepo();
        studentRepo.updateStudent({ "emailAddress": req.body.student }, { "status": "Suspend" }).then((result: any) => {
            if (result.raw.affectedRows != 0) {
                res.status(204).send();
            }
            else {
                res.status(500).json({ "message": "Either Student is not registered or already suspended or some database constraint, the Student can not be suspended. Please contact system Administrator" });
            }
        }).catch(error => {
            res.status(500).json({ "message": "Something went wrong. Please contact System Administrator." })
        });
    } else {
        res.status(400).json({ "message": "There is no student in the list. Please send correct Json request" });
    }

};


// Notification
export let retrieveForNotifications = async (req: Request, res: Response) => {
    if (!(req.body.teacher) || (req.body.teacher.length == 0)) {
        res.status(400).json({ "message": "Teacher Email Id is Empty. Please send correct Json request" });
    } else if (!(req.body.notification) || (req.body.notification.length == 0)) {
        res.status(400).json({ "message": "Notification information is Empty. Please send correct Json request" });
    } else {
        {
            let teacherstudentRepo: TeacherStudentRepo = new TeacherStudentRepo();
            let studentRepo: StudentRepo = new StudentRepo();
            var element = { "teacherEmailAddress": req.body.teacher };
            teacherstudentRepo.getCommonStudents(element).then((result: any) => {
                var arry = new Array();
                for (var i = 0; i < result.length; i++) {
                    arry.push(result[i].studentEmailAddress);
                }
                var studentList = req.body.notification.split(" @");
                for (var i = 0; i < studentList.length; i++) {
                    arry.push(studentList[i]);
                }
                var queryArray = new Array();
                if (arry.length >= 1) {
                    for (var i = 0; i < arry.length; i++) {
                        var element = { "emailAddress": arry[i], "status": "Active" };
                        queryArray.push(element);
                    }
                    var queryCondition = { where: queryArray }
                    studentRepo.getStudents(queryCondition).then((result: any) => {
                        var studentArray = new Array();
                        for (var i = 0; i < result.length; i++) {
                            studentArray.push(result[i].emailAddress);
                        }
                        var resObject = { "recipients": studentArray }
                        res.json(resObject);
                    });
                }
            }).catch(error => {
                res.status(500).json({ "message": "Something went wrong. Please contact System administrator." })
            });
        }
    }
};
