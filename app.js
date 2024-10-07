require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
// security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')

//connectDB
const connectDB = require('./db/connect')

//middlewares
const authenticateUser = require('./middleware/authentication')
const authAdmin = require('./middleware/authAdmin')
//routers
const authRouter = require('./routes/auth')
const moviesRouter = require('./routes/movies')
const adminMoviesRoute = require('./routes/adminMoviesManage')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');


app.use(express.json());

// extra packages
app.set('trust proxy',1)
app.use(rateLimit({
  windowMs : 15*60*1000, //15minutes
  max : 100 // limit each IP to 100 requests per windowMs
}))
app.use(helmet())
// const corsOptions = {
//   origin: 'http://localhost:5173', // your frontend origin
//   credentials: true,               // allow cookies and credentials
//   optionsSuccessStatus: 200        // some browsers require 200 status for successful preflight
// };
app.use(cors());
app.use(xss())

app.get('/',(req,res)=>{
  res.send('jobs api')
})
// routes

// common authentication for users and admin
app.use('/api/v1/auth',authRouter)
// route for users
app.use('/api/v1/movies',authenticateUser,moviesRouter)
//route for admin
app.use('/api/v1/admin/movies',authAdmin,adminMoviesRoute)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
