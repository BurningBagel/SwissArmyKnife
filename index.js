/*
    TODO
    -Find useful APIs!
        -Lets aim for a nice round 5 at least
        *IP LOCATION https://ip-api.com/docs
        *EMAIL VERIFICATION https://mailboxlayer.com/
        *DICTIONARY https://dictionaryapi.com/
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


const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

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

        console.log(JSON.stringify(editedResponse));

        res.render("iplocator.ejs",{response:editedResponse});
    } catch (error) {
        res.redirect("iplocator.ejs",{response:error});
    }
    
});

// EMAIL VERIFIER
app.get("/email",(req,res) => {
    res.render("index.ejs",{active:"email"});
});

// DICTIONARY
app.get("/dictionary",(req,res) => {
    res.render("index.ejs",{active:"dictionary"});
});

// QR CODE GENERATOR
app.get("/qrcode",(req,res) => {
    res.render("index.ejs",{active:"qrcode"});
});

// JSON BIN
app.get("/jsonbin",(req,res) => {
    res.render("index.ejs",{active:"jsonbin"});
});



app.listen(3000,() => {
    console.log("Ready");
});