import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';



const app = express();

const PORT = 3000;

const DICTIONARY = "https://api.dictionaryapi.dev/api/v2/entries/en/    "
const CURRENCY = "https://api.frankfurter.app/latest";


app.use(bodyParser.urlencoded({ extended: true }));


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname,"public")));
// BASE

app.get("/", (req,res) => {
    res.render("index.ejs",{active:"none"});
});

// IP LOCATOR

app.get("/iplocator",(req,res) => {
    res.render("iplocator.ejs",{active:"iplocator"});
});

app.post("/iplocator", async (req,res) => {

    try {
        const response = await axios.get("http://ip-api.com/json/"+req.body.ip);
        
        var editedResponse = JSON.stringify(response.data).replaceAll(",","\n");
        editedResponse = editedResponse.replaceAll("\t","");
        editedResponse = editedResponse.replaceAll("{","");
        editedResponse = editedResponse.replaceAll("}","");

        res.render("iplocator.ejs",{response:editedResponse});
    } catch (error) {
        res.redirect("iplocator.ejs",{response:error});
    }
    
});

// EMAIL VERIFIER
app.get("/email",(req,res) => {
    res.render("email.ejs",{active:"email"});
});

app.post("/email", async (req,res) => {

    const options = {
        method: 'GET',
        url: 'https://mailcheck.p.rapidapi.com/',
        params: {
          domain: req.body.email
        },
        headers: {
          'X-RapidAPI-Key': 'cfd0af0902msh2a708c8ebcd6a33p1ae34ejsn1dc73742d1fe',
          'X-RapidAPI-Host': 'mailcheck.p.rapidapi.com'
        }
      };

      try {
        const response = await axios.request(options);
        
        res.render("email.ejs",{active:"email",valid:response.data.valid});
    } catch (error) {
        res.render("email.ejs",{active:"email",error:error});
        console.log(error);
      }
});

// DICTIONARY
app.get("/dictionary",(req,res) => {
    res.render("dictionary.ejs",{active:"dictionary"});
});

app.post("/dictionary", async (req,res) => {
    
    try {

        const response = await axios.get(DICTIONARY + req.body.word);

        var word = response.data[0]["word"];
        word = word[0].toUpperCase() + word.slice(1);
        
        const meanings = response.data[0]["meanings"];

        var arrayToSend = [];

        meanings.forEach(meaning => {
            var anchor = meaning["partOfSpeech"];
            var definitions = [];

            for (let j = 0; j < meaning["definitions"].length; j++){
                definitions.push(meaning["definitions"][j]["definition"]);
            }

            var entry = [anchor,definitions];
            arrayToSend.push(entry);
        });
        
        res.render("dictionary.ejs",{active:"dictionary",answer:arrayToSend,word:word});

    } catch (error) {
        res.render("dictionary.ejs",{active:"dictionary",answer:JSON.stringify(error)});
    }
    
});

// QR CODE GENERATOR
app.get("/qrcode",(req,res) => {
    res.render("qrCode.ejs",{active:"qrcode"});
});

app.post("/qrcode",(req,res) => {
    res.render("qrCode.ejs",{active:"qrcode",qrcode:"https://qrtag.net/api/qr.png?url="+req.body.url});
});


// CURRENCY
app.get("/currency",(req,res) => {
    res.render("currency.ejs",{active:"currency"});
});

app.post("/currency", async (req,res) => {
    try {

        if (req.body.curr1 == req.body.curr2){
            res.render("currency.ejs",{active:"currency",response:`${req.body.amount} ${req.body.curr1} = ${req.body.amount} ${req.body.curr2}`});
        }
        else{
            const response = await axios.get(CURRENCY,{ params: {
                amount: req.body.amount,
                from: req.body.curr1,
                to: req.body.curr2
            },});
            
            var result = response.data["rates"][req.body.curr2];

            result =  `${req.body.amount} ${req.body.curr1} = ${result} ${req.body.curr2}`; 

            res.render("currency.ejs",{active:"currency",response:result});    
        }
    } catch (error) {
        res.render("currency.ejs",{active:"currency",response:error});
    }
    
});

app.listen(PORT,() => {
    console.log("Ready");
});