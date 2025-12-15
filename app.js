const express = require("express")
require("dotenv").config()
const { connectDB } = require("./config/db")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: true,  
  credentials: true
}))


const userRouter = require("./routes/userRoutes")
const jobApplicationRouter = require("./routes/jobApplicationRoutes")
const reminderRouter = require("./routes/reminderRoutes")
const companyRouter = require("./routes/companyRoutes")
const jobListingRouter = require("./routes/jobListingRoutes")
const dashboardRouter = require("./routes/dashboardRoutes")
const jonSearchRouter = require("./routes/jobSearchRoutes")
const applicationNoteRouter = require("./routes/applicationNotesRoutes")

app.use("/", userRouter)
app.use("/",jobApplicationRouter)
app.use("/",reminderRouter)
app.use("/",companyRouter)
app.use("/",jobListingRouter)
app.use("/",dashboardRouter)
app.use("/",jonSearchRouter)
app.use("/",applicationNoteRouter)

connectDB().then(()=>{
    console.log("Connected to database")
    app.listen(process.env.PORT,()=>{
    console.log("Server listening to PORT",process.env.PORT)
})
}).catch((err) => {
    console.log(err)
})
