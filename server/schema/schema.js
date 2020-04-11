const graphql = require('graphql');
const {GraphQLObjectType, GraphQLString, GraphQLSchema,GraphQLID,GraphQLInt,GraphQLList} = graphql;
const _=require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');


//dummy data
// var books = [
//     {name:'book1', genre: '111', id:'1', authorId:'1'},
//     {name:'book2', genre: '222', id:'2', authorId:'2'},
//     {name:'book3', genre: '333', id:'3', authorId:'3'},
//     {name:'book4', genre: '444', id:'4', authorId:'2'},
//     {name:'book5', genre: '555', id:'5', authorId:'3'}
// ];
// var authors = [
//     {name:'author1', age: 22, id:'1'},
//     {name:'author2', age: 33, id:'2'},
//     {name:'author3', age: 44, id:'3'}
// ];


const BookType = new GraphQLObjectType({
    name:'Book',
    fields:()=>({
        id:{type: GraphQLString},
        name: {type: GraphQLString},
        genre: {type:GraphQLString},
        author:{
            type:AuthorType,
            resolve(parent,agrs){
                // console.log(parent);
                // return _.find(authors,{id:parent.authorId});
                return Author.findById(parent.authorId);

            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name:'Author',
    fields:()=>({
        id:{type: GraphQLString},
        name: {type: GraphQLString},
        age: {type:GraphQLInt},
        books:{
            type:new GraphQLList(BookType),
            resolve(parent,agrs){
                // return _.filter(books,{authorId:parent.id})
                return Book.find({authorId:parent.id});
            }
        }
    })
});

// how we intially jump into the graph
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields:{
        book:{
            type: BookType,
            args:{id:{type:GraphQLID}},
            resolve(parent,args){
                //code to get data from db
                // return _.find(books,{id:args.id});
                return Book.findById(args.id);
            }
        }, 
        author:{
            type: AuthorType,
            args:{id:{type:GraphQLID}},
            resolve(parent,args){
                //code to get data from db
                // return _.find(authors,{id:args.id});
                return Author.findById(args.id);
            }
        },
        books:{
            type:new GraphQLList(BookType),
            resolve(parent,args){
                // return books;
                return Book.find({});
            }
        },
        authors:{
            type:GraphQLList(AuthorType),
            resolve(parent,agrs){
                // return authors;
                return Author.find({});
            }
        }
    }
});


const Mutation = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        addAuthor:{
            type:AuthorType,
            args:{
                name:{type:GraphQLString},
                age:{type:GraphQLInt}
            },
            resolve(parent,args){
                let author = new Author({
                    name:args.name,
                    age:args.age
                });
                return author.save();
            }
        },
        addBook:{
            type:BookType,
            args:{
                name:{type:GraphQLString},
                genre:{type:GraphQLString},
                authorId:{type:GraphQLID}
            },
            resolve(parent,args){
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                });
                return book.save();
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query:RootQuery,
    mutation:Mutation
});