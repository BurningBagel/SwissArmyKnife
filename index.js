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

const app = express();

app.use(express.static("public"));


app.get("/", (req,res) => {
    res.render("index.ejs");
});

app.listen(3000,() => {
    console.log("Ready");
});