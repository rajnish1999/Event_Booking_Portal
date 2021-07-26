const express = require('express')
const { graphqlHTTP } = require('express-graphql');
const Mongoose  = require('mongoose');
require('dotenv').config();

const graphQlSchema = require('./graphql/schema/index')
const graphQlResolver = require('./graphql/resolvers/index')
const isAuth = require('./middlewares/is-auth')

const app = express()

app.use(express.json())

app.use(isAuth)

app.use('/graphql', graphqlHTTP({
    schema: graphQlSchema , 
    rootValue: graphQlResolver, 
    graphiql: true
}))

let port = process.env.PORT || 8000;
// console.log(process.env.MONGO_DB)
Mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@event-booking.vv2k1.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`, 
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

