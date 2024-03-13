/*
    TODO
    -Find useful APIs!
        -Lets aim for a nice round 5 at least
        *IP LOCATION https://ip-api.com/docs
        *EMAIL VERIFICATION https://mailboxlayer.com/
        *DICTIONARY https://dictionaryapi.dev/
        *QR CODE GENERATOR https://www.qrtag.net/api/
        *JSON BIN STORAGE https://extendsclass.com/json-storage.html
        
        

    -Main webpage layout
        -Header buttons
        -Footer info
        -Main page text layout listing what each button does

    -API page layout
        -Header buttons, but how to dynamically change which one is highlighted?
        -Footer as usual
        -Body will depend on each API

*/
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';



const app = express();

const DICTIONARY = "https://api.dictionaryapi.dev/api/v2/entries/en/    "
const QRCODE = "";


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
    // console.log(req.body);

    try {
        const response = await axios.get("http://ip-api.com/json/"+req.body.ip);

        // console.log(response);
        
        var editedResponse = JSON.stringify(response.data).replaceAll(",","\n");
        editedResponse = editedResponse.replaceAll("\t","");
        editedResponse = editedResponse.replaceAll("{","");
        editedResponse = editedResponse.replaceAll("}","");

        //console.log("START"+editedResponse); 

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

        // var editedResponse = JSON.stringify(response.data);
        //console.log(response.data.valid);
        
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
    //Dictionary will just give the definitions, lets not worry about examples or synonyms
    
    try {
        // console.log("heres the word: " + req.body.word);

        // console.log(DICTIONARY + req.body.word);

        const response = await axios.get(DICTIONARY + req.body.word);

        //Do we do formatting for the response here in the backend, or tell the frontend to assemble it?
        //Chat gpt says do it back here, and it makes sense to me so letsa gooooo

        //we need to access the first item of the list we get back, then look for the following dictionary keys
        //"word", for the word itself
        //For each in "meanings"
            // "partOfSpeech" for word type(noun,verb,adjective,etc.)
            // for each in "definitions"
                //"definition" is the meaning of the word
        
        /*
        Word
            noun
                1. blablabla

                2. blebleble




        */
        // console.log(response.data);


        var word = response.data[0]["word"];
        word = word[0].toUpperCase() + word.slice(1);
        //console.log("word: ",word);
        
        const meanings = response.data[0]["meanings"];
        //console.log(meanings[1]);

        var formattedAnswer = "";

        // meanings.forEach(meaning => {
        //     formattedAnswer += "\t" + meaning["partOfSpeech"] + "\n";
        //     for (let index = 0; index < meaning["definitions"].length; index++) {
        //         const definition = meaning["definitions"][index]["definition"];
        //         formattedAnswer += "\t\t" + (index+1) + ". " + definition + "\n";
        //     }
        //     formattedAnswer += "\n\n";
            
        // });

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
        
        //FORMAT ANSWER[[PARTOFSPEECH,[DEFINITIONS]]]

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


// JSON BIN
app.get("/jsonbin",(req,res) => {
    res.render("index.ejs",{active:"jsonbin"});
});



app.listen(3000,() => {
    console.log("Ready");
});