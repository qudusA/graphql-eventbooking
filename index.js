const app = require("./app");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const mongoConnect = require("./utils/mongoose");
const schemaIndex = require("./graphql/schema/index");
const resolverIndex = require("./graphql/resolver/index");
const isAuth = require('./middleware/auth');

app.use(bodyParser.json());

app.use(isAuth);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schemaIndex,
    rootValue: resolverIndex,
    graphiql: true,
  })
);

(async () => {
  const client = await mongoConnect;
  //   console.log(client);
  const port = 3080;
  app.listen(port, () => {
    console.log(`application listens at port: ${port}`);
  });
})();
