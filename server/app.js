const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();

//connect to mlabl db
mongoose.connect("mongodb+srv://penny:test123@cluster0-xu3u7.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once('open',()=>{
    console.log('connect to database');
});


//allow cross-origin requests
app.use(cors());


app.use("/graphql", graphqlHTTP({
    schema,
    graphiql:true
}));

app.listen(4000, ()=>{
    console.log('now listening for requests on port 4000');
});