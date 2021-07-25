const bcrypt = require('bcrypt')
const Mongoose  = require('mongoose');

const Event = require('../../models/event')
const User = require('../../models/user');
const Booking = require('../../models/booking');


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

const singleEvent = async (eventId) => {
    try{
        const event = await Event.findById(eventId)
        return {
            ...event._doc, 
            creator: user(event.creator)
        }
    }catch(err){

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
    },
    bookings: async () => {
        try {
            const bookings = await Booking.find();

            if(!bookings) {
                throw new Error('No booking found')
            }

            return bookings.map((booking) => {
                return {
                    ...booking._doc,
                    user: user(booking.user),
                    event: singleEvent(booking.event),
                    createdAt: new Date(booking.createdAt).toISOString(),
                    updatedAt: new date(booking.updatedAt).toISOString()
                }
            })
        } catch(err){
            throw err;
        }
    },
    bookEvent: async (args) => {
        const fetchedEvent = await Event.findById(args.eventId)
        const booking = new Booking({
            user: Mongoose.Types.ObjectId('60f9a87754caec7463a24076'),
            event: fetchedEvent
        })
        const result = await booking.save();

        return {
            ...result._doc,
            user: user(booking.user),
            event: singleEvent(booking.event),
            createdAt: new Date(result.createdAt).toISOString(),
            updatedAt: new Date(result.updatedAt).toISOString()
        }
    }, 
    cancelBooking: async (args) => {
          try{
            const booking = await Booking.findById(args.bookingId)
            const bookingEvent = await booking.populate('event').execPopulate()
            // console.log(bookingEvent);
            // console.log("eventBookDeleted is");
            const temp = bookingEvent.event
            // console.log(booking.event);
            // console.log( {...bookingEvent});
            // console.log( {...bookingEvent._doc});
            console.log(temp);
            const eventBookDeleted = {
                ...temp._doc,
                creator: await user(temp.creator)
            }
            console.log(eventBookDeleted);
            // console.log({eventBookDeleted});
            // console.log({...eventBookDeleted});
            // console.log(eventBookDeleted.title);

            await Booking.deleteOne({_id: args.bookingId})
            return eventBookDeleted
          }catch(err){
              throw err;
          }
    }
}


