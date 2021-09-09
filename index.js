const {
  ApolloServer,
  // PubSub
} = require('apollo-server');
const mongoose = require('mongoose');
const { key } = require('./config');

const { typeDefs, resolvers } = require('./graphql');

// const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    req
    // pubsub
  })
});
const db = key.mongoURI;
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to mongo');
    return server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => console.log(err));

const port = process.env.PORT || 5000;

