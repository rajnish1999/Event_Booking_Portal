const bcrypt = require('bcrypt')
const Mongoose  = require('mongoose');

const Event = require('../../models/event')
const User = require('../../models/user');

const events = async (eventIds) => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } })
        return events.map((event) => {
            return {
                ...event._doc, 
                creator: user(event.creator)
            }
        })
    }catch( err ){
        throw err;
    }
        
}
const user = async (userId) => {
    try {
        const user = await User.findById(userId)
        return {
            ...user._doc,
            createdEvents: events(user.createdEvents)
        }
    } catch( err ){
        throw err
    }
}


module.exports = {
    events: async () => {
        try {
            const events = await Event.find()
            const arr = events.map((event) => {
                return {
                    ...event._doc,
                    date: new Date(event.date).toISOString(),
                    creator: user(event.creator)
                }
             })
            return arr;
        } catch(err){
            throw err;
        }
    },
    createEvent: async (args) => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: Mongoose.Types.ObjectId("60f9a87754caec7463a24076")
        })
       
        let eventData

        try {
            const data = await event.save()
            eventData = {
                ...data._doc,
                creator: user(data.creator)
            }
            // console.log(data)
            const userCreated = await User.findById(data.creator);
            if(!userCreated){
                throw new Error('user not found')
            }
            userCreated.createdEvents.push(event)
            
            await userCreated.save()
            
            return eventData
        } catch(err) {
            throw err;
        }
        
    },
    createUser: async (args) => {
        try {
            const user = await User.findOne({ email: args.userInput.email })
                
            if(user){
                throw new Error('email already exist')
            }
            
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
            const hashedUser = new User({
                email: args.userInput.email,
                password: hashedPassword
            })
            
            const data = hashedUser.save()
                
            return data
        } catch(err){
            throw err;
        }
    }
}