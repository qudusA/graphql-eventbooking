const { buildSchema } = require("graphql");

module.exports = buildSchema(`

type Event{
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
    creator: User!
}

type User{
    _id: ID!
    email: String!
    password: String
    eventCreated: [Event!]!

}

type Bookings{
    _id: ID!
    event: Event!
    user: User!
    createdAt: String!
    updatedAt: String!
}

type VerifiedUser{
    _id: ID!
    email: String!
    tokenExpiration: Int!
    token: String!
}

input EventInput{
    title: String!
    description: String!
    price: Float!
    date: String!
    creator: ID
}

input UserInput{
    email: String!
    password: String!
}

type rootQuery{
    events: [Event!]!
    bookings: [Bookings!]!
    Login(userInput: UserInput!): VerifiedUser!

}

type rootMutation{
    createEvent(eventInput: EventInput!): Event!
    createUser(userInput: UserInput): User
    createBookings(bookingInput: ID!): Bookings!
}


schema{
    query: rootQuery
    mutation: rootMutation
}

`);
