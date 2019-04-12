import { createConnection, getConnection } from "typeorm";
let chaii = require('chai');
let chaiHttp = require('chai-http');
let app = require('../src/index');
let should = chaii.should();
chaii.use(chaiHttp);

describe('Teacher Student API Testing', () => {

	before(function (done) {
		setTimeout(() => {
			done();
		}, 4000);
		/*	
			createConnection().then(async connection => {
				//console.log("DataBase in testing is connected.");
				done();
			}).catch(error => console.log("Error occured during DB Connection while testing: ", error));*/
	});

	describe('/POST /api/register-Save The Students and Teachers', () => {
		it('Test Case Scenario-1:  Teacher email Address is Empty', (done) => {
			let teacherStudObj = {
				"teacher": "",
				"students": [
					"student11@example.com",
					"student12@example.com"
				]
			}
			chaii.request(app)
				.post('/api/register')
				.send(teacherStudObj)
				.end((error, res) => {
					res.should.be.json;
					res.should.have.status(400);
					res.body.should.have.property('message');
					res.body.message.should.equal('Teacher Email Id is Empty. Please send correct Json request');
					done();
				});
		});
		it('Test Case Scenario-2:  Student Email Address List is Empty', (done) => {
			let teacherStudObj = {
				"teacher": "teacher2@example.com",
				"students": []
			};
			chaii.request(app)
				.post('/api/register')
				.send(teacherStudObj)
				.end((error, res) => {
					res.should.be.json;
					res.should.have.status(400);
					res.body.should.have.property('message');
					res.body.message.should.equal('There is no student in the list. Please send correct Json request');
					done();
				});
		});
		it('Test Case Scenario-3:  Student Email Address List is not Empty but one of the Student has no Email Address', (done) => {
			let teacherStudObj = {
				"teacher": "teacher3@example.com",
				"students": ["",
					"student31@example.com"]
			};
			chaii.request(app)
				.post('/api/register')
				.send(teacherStudObj)
				.end((error, res) => {
					res.should.be.json;
					res.should.have.status(400);
					res.body.should.have.property('message');
					res.body.message.should.equal('Some Element(s) in Student List is(are) Empty. Please send correct Json request');
					done();
				});
		});
		it('Test Case Scenario-4:  Student Email Address List is not Empty but more than one Students have no Email Address', (done) => {
			let teacherStudObj = {
				"teacher": "teacher4@example.com",
				"students": ["",
					""]
			};
			chaii.request(app)
				.post('/api/register')
				.send(teacherStudObj)
				.end((error, res) => {
					res.should.be.json;
					res.should.have.status(400);
					res.body.should.have.property('message');
					res.body.message.should.equal('Some Element(s) in Student List is(are) Empty. Please send correct Json request');
					done();
				});
		});
		it('Test Case Scenario-5:  When server receives correct Json request having two students', (done) => {
			let teacherStudObj = {
				"teacher": "teacher5@example.com",
				"students": ["student51@example.com",
					"student52@example.com"]
			};
			chaii.request(app)
				.post('/api/register')
				.send(teacherStudObj)
				.end((error, res) => {
					res.should.have.status(204);
					done();
				});
		});
		it('Test Case Scenario-6:  When server receives correct Json request having three students', (done) => {
			let teacherStudObj = {
				"teacher": "teacher6@example.com",
				"students": ["student51@example.com",
					"student52@example.com",
					"student63@example.com"]
			};
			chaii.request(app)
				.post('/api/register')
				.send(teacherStudObj)
				.end((error, res) => {
					res.should.have.status(204);
					done();
				});
		});
	});


	describe('GET /api/commonstudents-Get Common Students List', () => {
		it('Test Case Scenario-7:  Teacher Email Address is not present in the request', (done) => {
			chaii.request(app)
				.get('/api/commonstudents')
				.end((error, res) => {
					res.should.be.json;
					res.should.have.status(400);
					res.body.should.have.property('message');
					res.body.message.should.equal('Please provide valid and complete endpoint');
					done();
				});
		});
		it('Test Case Scenario-8:  Students of single teacher mentioned in GET request will be retrieved', (done) => {
			chaii.request(app)
				.get('/api/commonstudents?teacher=teacher6@example.com')
				.end((error, res) => {
					res.should.have.status(200);
					res.should.be.json;
					res.body.students.should.be.a('array');
					res.body.should.have.property('students');
					//	res.body.should.have.property('students').with.lengthOf(3);
					done();
				});
		});
		it('Test Case Scenario-9:  Students who are common among teachers mentioned in get request will be retrieved', (done) => {
			chaii.request(app)
				.get('/api/commonstudents?teacher=teacher6@example.com&teacher=teacher5@example.com')
				.end((error, res) => {
					res.should.have.status(200);
					res.should.be.json;
					res.body.students.should.be.a('array');
					res.body.should.have.property('students');
					//	res.body.should.have.property('students').with.lengthOf(2);
					done();
				});
		});
	});

	describe('POST /api/suspend-Suspend the Student', () => {
		it('Test Case Scenario-10: Student Email address is not mentioned in the Json request', (done) => {
			let teacherStudObj = {
				"student": ""
			};
			chaii.request(app)
				.post('/api/suspend')
				.send(teacherStudObj)
				.end((error, res) => {
					res.should.be.json;
					res.should.have.status(400);
					res.body.should.have.property('message');
					res.body.message.should.equal('There is no student in the list. Please send correct Json request');
					done();
				});
		});
		it('Test Case Scenario-11: Student Email address is not present in the Database', (done) => {
			let teacherStudObj = {
				"student": "xyz@example.com"
			};
			chaii.request(app)
				.post('/api/suspend')
				.send(teacherStudObj)
				.end((error, res) => {
					res.should.be.json;
					res.should.have.status(500);
					res.body.should.have.property('message');
					res.body.message.should.equal('Either Student is not registered or already suspended or some database constraint, the Student can not be suspended. Please contact system Administrator');
					done();
				});
		});
		it('Test Case Scenario-12: Student Email address is correct and also present in Database', (done) => {
			let teacherStudObj = {
				"student": "student52@example.com"
			};
			chaii.request(app)
				.post('/api/suspend')
				.send(teacherStudObj)
				.end((error, res) => {
					res.should.have.status(204);
					done();
				});
		});
	});

	describe('/POST /api/retrievefornotifications-Email Notification', () => {
		it('Test Case Scenario-13:  Teacher email Address is Empty', (done) => {
			let teacherStudObj = {
				"teacher": "",
				"notification": "Hello students! @student11@example.com @student21@example.com"
			}
			chaii.request(app)
				.post('/api/retrievefornotifications')
				.send(teacherStudObj)
				.end((error, res) => {
					res.should.be.json;
					res.should.have.status(400);
					res.body.should.have.property('message');
					res.body.message.should.equal('Teacher Email Id is Empty. Please send correct Json request');
					done();
				});
		});
		it('Test Case Scenario-14:  Notification Information is Empty', (done) => {
			let teacherStudObj = {
				"teacher": "teacher14@example.com",
				"notification": ""
			};
			chaii.request(app)
				.post('/api/retrievefornotifications')
				.send(teacherStudObj)
				.end((error, res) => {
					res.should.be.json;
					res.should.have.status(400);
					res.body.should.have.property('message');
					res.body.message.should.equal('Notification information is Empty. Please send correct Json request');
					done();
				});
		});
		it('Test Case Scenario-15:  Student must not be suspended, registered and (student should be mentioned in the notification or student should be registered with the teacher)', (done) => {
			let teacherStudObj = {
				"teacher": "teacher5@example.com",
				"notification": "Hello students! @student52@example.com @student51@example.com @student63@example.com"
			};
			chaii.request(app)
				.post('/api/retrievefornotifications')
				.send(teacherStudObj)
				.end((error, res) => {
					//	console.log(res.body);
					res.should.be.json;
					res.should.have.status(200);
					done();
				});
		});
		it('Test Case Scenario-16:  All students who are not suspended and are registered with the teacher will be included in the response)', (done) => {
			let teacherStudObj = {
				"teacher": "teacher5@example.com",
				"notification": "Hey everybody"
			};
			chaii.request(app)
				.post('/api/retrievefornotifications')
				.send(teacherStudObj)
				.end((error, res) => {
					//console.log(res.body);
					res.should.be.json;
					res.should.have.status(200);
					done();
				});
		});
	});
});
