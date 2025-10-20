const path = require("path");

module.exports = ({ env }) => {
  const DATABASE_FILENAME = path.join(
    __dirname,
    "..",
    env("DATABASE_FILENAME", ".tmp/data.db")
  );
  console.log("Database filename: ", env("DATABASE_FILENAME", ".tmp/data.db"));
  return {
    connection: {
      client: "sqlite",
      connection: {
        filename: DATABASE_FILENAME,
      },
      useNullAsDefault: true,
    },
  };
};
