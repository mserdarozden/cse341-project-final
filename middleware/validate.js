const validator = require('../helpers/validate');
const saveBook = async (req, res, next) => {
    const validationRule = {
        title: 'required|string',
        author: 'required|string',
        genre: 'required|string',
        publishedYear: 'required|integer|min:1000|max:2099',
        ISBN: 'required|string',
        copiesAvailable: 'required|integer|min:0',
        description: 'required|string'
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

const saveAuthor = async (req, res, next) => {
    const validationRule = {
        name: 'required|string',
        birthdate: 'required|date',
        nationality: 'required|string',
        biography: 'required|string'
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

const saveEvent = async (req, res, next) => {
    const validationRule = {
        eventName: 'required|string',
        eventDate: 'required|date',
        location: 'required|string',
        description: 'required|string',
        capacity: 'required|integer|min:1',
        organizer: 'required|string'
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

const saveMember = async (req, res, next) => {
    const validationRule = {
        firstName: 'required|string',
        lastName: 'required|string',
        email: 'required|email',
        phone: 'required|string|min:10|max:15'
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
    saveBook,
    saveAuthor,
    saveEvent,
    saveMember
};