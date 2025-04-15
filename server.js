
// const express = require("express");
// const mongodb = require("./data/database");
// const bodyParser = require("body-parser");
// const passport = require("passport");
// const session = require("express-session");
// const cors = require("cors");

// //const port = process.env.TEST_PORT || process.env.PORT || 3000; // Usa TEST_PORT si está definido
// const port = process.env.PORT || 3000; // Render asigna automáticamente el puerto a process.env.PORT

// const app = express();

// app
//   .use(bodyParser.json())
//   .use(
//     session({
//       secret: "secret",
//       resave: false,
//       saveUninitialized: true,
//     })
//   )
//   .use(passport.initialize())
//   .use(passport.session())
//   .use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader(
//       "Access-Control-Allow-Headers",
//       "Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization"
//     );
//     res.setHeader(
//       "Access-Control-Allow-Methods",
//       "POST, GET, PUT, PATCH, OPTIONS, DELETE"
//     );
//     next();
//   })
//   .use(cors({ methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"] }))
//   .use(cors({ origin: "*" }))
//   .use("/", require("./routes/index.js"));

// app.get("/", (req, res) => {
//   res.send(
//     req.session.user !== undefined
//       ? `Logged in as ${req.session.user.displayName}`
//       : "Logged Out"
//   );
// });

// // Middleware de manejo de errores
// app.use((err, req, res, next) => {
//   console.error(err);
//   res.status(500).json({ message: "Internal Server Error", error: err.message });
// });

// let server;

// const startServer = async () => {
//   return new Promise((resolve, reject) => {
//     mongodb.initDb((err) => {
//       if (err) {
//         console.log(err);
//         reject(err);
//       } else {
//         server = app.listen(port, () => {
//           console.log(`Database is listening and node Running on port ${port}`);
//           resolve(server);
//         });
//         server.on("error", (error) => {
//           if (error.code === "EADDRINUSE") {
//             console.error(`Port ${port} is already in use.`);
//           } else {
//             console.error("Error starting server:", error);
//           }
//           reject(error);
//         });
//       }
//     });
//   });
// };

// const stopServer = async () => {
//   if (server) {
//     await new Promise((resolve) => server.close(resolve));
//     console.log("Server stopped.");
//   }
// };
// module.exports = { app, startServer, stopServer };
// // Llamar a startServer automáticamente si se ejecuta directamente
// if (require.main === module) {
//   startServer().catch((err) => {
//     console.error('Failed to start server:', err.message);
//   });
// }
const express = require("express");
const mongodb = require("./data/database");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const GitHubStrategy = require("passport-github2").Strategy;

const port = process.env.PORT || 3000; // Render asigna automáticamente el puerto a process.env.PORT

const app = express();

// Configuración de middlewares
app
  .use(bodyParser.json())
  .use(
    session({
      secret: "secret",
      resave: false,
      saveUninitialized: true,
    })
  )
  .use(passport.initialize())
  .use(passport.session())
  .use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, PATCH, OPTIONS, DELETE"
    );
    next();
  })
  .use(cors({ methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"] }))
  .use(cors({ origin: "*" }))
  .use("/", require("./routes/index.js"));

// Configuración de Passport.js (excluido en entorno de pruebas)
if (process.env.NODE_ENV !== "test") {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
      },
      function (accessToken, refreshToken, profile, done) {
        return done(null, profile);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  // Ruta de callback de GitHub
  app.get(
    "/github/callback",
    passport.authenticate("github", {
      failureRedirect: "/api-docs",
      session: false,
    }),
    (req, res) => {
      req.session.user = req.user;
      res.redirect("/");
    }
  );
}

// Ruta principal
app.get("/", (req, res) => {
  res.send(
    req.session.user !== undefined
      ? `Logged in as ${req.session.user.displayName}`
      : "Logged Out"
  );
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

let server;

// Inicialización del servidor
const startServer = async () => {
  return new Promise((resolve, reject) => {
    mongodb.initDb((err) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        server = app.listen(port, () => {
          console.log(`Database is listening and node Running on port ${port}`);
          resolve(server);
        });
        server.on("error", (error) => {
          if (error.code === "EADDRINUSE") {
            console.error(`Port ${port} is already in use.`);
          } else {
            console.error("Error starting server:", error);
          }
          reject(error);
        });
      }
    });
  });
};

// Detener el servidor
const stopServer = async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
    console.log("Server stopped.");
  }
};

module.exports = { app, startServer, stopServer };

// Llamar a startServer automáticamente si se ejecuta directamente
if (require.main === module) {
  startServer().catch((err) => {
    console.error("Failed to start server:", err.message);
  });
}