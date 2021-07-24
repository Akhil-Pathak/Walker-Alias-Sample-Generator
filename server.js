import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import UserProbData from "./dBCard.js";
import dotenv from "dotenv";
import {probability_table_generator,sampler} from "./walker_alias.js";
import path from 'path';



// App config------------------------------------------
dotenv.config()
const app = express();
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, './client/build')));;
const port = process.env.PORT || 8000;

//Middlewares------------------------------------------
app.use(cors());
app.use(express.json());
// app.use("*",(req,res)=>res.sendStatus(404));


// dB config -------------------------------------------
mongoose
.connect(process.env.database_uri, {
    useNewUrlParser : true,
    useCreateIndex : true,
    useUnifiedTopology : true,
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

//APIs -------------------------------------------------

// app.get('/', (req, res) => {
//     res.status(200).send('Hello there wanderer')
// })

app.get('/sayhhi/:hi', (req, res) => {
    // console.log(res)
    res.status(200).send('This says Hi')
})

app.post('/prob/uploaddata',(req,res)=>{
    console.log("Got response: " + res.statusCode);
    console.log(req.body)
    const dBCard = req.body;
    const utils = probability_table_generator(dBCard.probMap);
    const total = dBCard.totalNum;
    for(var i = 0; i< total;++i){
        const sample = sampler(utils.weight_clean,utils.weights,utils.index);
        dBCard.finalResult[sample]++;
    }

    const filter = { userid: dBCard.userid };
    UserProbData.deleteMany(filter, function (err) {
        if(err) console.log(err);
        console.log("Successful deletion");
    });

    UserProbData.create(dBCard , (err,data) => {
        if(err){
            res.status(500).send(err);
            console.log(`fucked....`);
        } else {
            res.status(201).send(data);
            console.log(data);
        }
    })
})

app.get('/prob/downloaddata/:userid', (req,res) => {
    // console.log(res)
    console.log(req.params)
    UserProbData.find(req.params,(err,data) => {
        if(err){
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    })
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'./client/build/index.html'));
  });

// Listner -----------------------------------------------------------

app.listen(port, () => {
    console.log(`The app is  listening at http://localhost:${port}`)
})
