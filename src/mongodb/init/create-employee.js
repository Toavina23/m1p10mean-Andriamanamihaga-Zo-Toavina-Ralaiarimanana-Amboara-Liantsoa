const { User } = require('../../models/user')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')

dotenv.config()

const PASSWORD_HASH_SALT_ROUND = 8
const defaultSchedule = {
    Lundi: { startTime: '08:00', endTime: '17:00' },
    Mardi: { startTime: '08:00', endTime: '17:00' },
    Mercredi: { startTime: '08:00', endTime: '17:00' },
    Jeudi: { startTime: '08:00', endTime: '17:00' },
    Vendredi: { startTime: '08:00', endTime: '17:00' },
}

mongoose.connect(process.env.DB_URL)
bcrypt.hash('John21Doe', PASSWORD_HASH_SALT_ROUND)
    .then(async (hashedPassword) => {
        const userData = {
            firstname: 'John',
            lastname: 'Doe',
            email: 'john@example.com',
            password: hashedPassword,
            role: 'EMPLOYEE',
            starting_day: new Date('2017-05-06'),
            commission: 25,
            schedule: defaultSchedule,
            verified: 1
        }
        const user = await User.findOne({ email: userData.email })
        if(user) {
            console.log('Employee is up to date.')
        } else {
            await User.create(userData)
            console.log('Employee created successfully.')
        }
    })
