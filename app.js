const express = require('express')
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const Mongoose  = require('mongoose');

require('dotenv').config();

const app = express()

app.use(express.json())

const events = []

app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`

        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event!
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `), 
    rootValue: {
        events: () => {
            return events
        },
        createEvent: (args) => {
            const event = {
                _id: Math.random().toString(),
                ...args.eventInput
            }
            events.push(event);
            return event
        }
    }, graphiql: true
}))

let port = process.env.PORT || 3000;

Mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@event-booking.vv2k1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, 
        {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        }      
).then(() => {
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    })
}).catch((err) => console.log(err));


