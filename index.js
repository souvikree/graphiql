const express = require('express')
const {graphqlHTTP}= require('express-graphql')
const { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLList, GraphQLSchema } = require('graphql')
const app = express()

const Users = [
    {
        id: 1,
        name: 'Souvik',
        email: 'souvik32@gmail.com'
    },
    {
        id: 2,
        name: 'Souv',
        email: 'souv2@gmail.com'
    },
]

const userType= new GraphQLObjectType({
    name: 'User',
    description: 'This represents a user',
    fields: () =>({
        id: { type: new GraphQLNonNull(GraphQLInt)},
        name: { type: new GraphQLNonNull(GraphQLString)},
        email: { type: new GraphQLNonNull(GraphQLString)},
    }),
})

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields:()  => ({
        Users:{
            type: new GraphQLList(userType),
            description: 'List of All Users',
            resolve: () => Users
        },
        user: {
            type: userType,
            description: 'A single user',
            args: {
                id: {
                    type: GraphQLInt
                }
            },
            resolve: (parent, args) => Users.find(user => user.id === args.id)
        }
    })
})

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addUser: {
            type: userType,
            description: 'Add an User',
            args: {
                // id: {type: new GraphQLNonNull(GraphQLInt)},
                name: {type: new GraphQLNonNull(GraphQLString)},
                email: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve: (parent, args) => {
                const user = {id: Users.length + 1, name: args.name, email: args.email}  
                Users.push(user)
                return user
            }
        },
        removeUser: {
            type: userType,
            description: 'Remove an User',
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)},
                // name: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve: (parent, args) => {
                Users.filter(user => user.id !== args.id)
                return Users[args.id]
            }
        },
        updateUser: {
            type: userType,
            description: 'Update an User',
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)},
                name: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve: (parent, args) => {
                Users[args.id - 1].name = args.name
                return Users[args.id - 1]
            }
        }
    })  
})


const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})


app.use('/graphql', graphqlHTTP({
    graphiql:true,
    schema: schema,
}))



// const port = process.env.PORT || 8080;
const port = 5000;
app.listen(port, console.log(`Listening on port ${port}...`));