const validator = require('../helpers/validate');
const saveStudent = async (req, res, next) => {
    const validationRule = {
        firstName: 'required|string',
        lastName: 'required|string',
        email: 'required|email',
        birthdate: 'required|date',
        address: 'required|string',
        phoneNumber: 'required|string|min:10|max:15',
        enrollmentYear: 'required|integer|min:2000|max:2099',
        major: 'required|string',
        gpa: 'required|numeric|min:0|max:4'
    };

    await validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        } else {
            next();
        }
    }).catch( err => console.log(err))
}

const saveCourse = async (req, res, next) => {
    const validationRule = {
        title: 'required|string',
        description: 'required|string',
        credits: 'required|integer|min:1|max:10',
        teacherName: 'required|string'
    };

    await validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        } else {
            next();
        }
    }).catch( err => console.log(err))
}

module.exports = {
    saveStudent,
    saveCourse
};