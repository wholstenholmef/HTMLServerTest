const express = require("express");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const dataFile = path.join(__dirname, "data.json");

//Support POSTing form data with URL encoded
app.use(express.urlencoded({ extended : true }));

//Enable CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});

app.get("/server", async(req, res) => {
    let data = JSON.parse(await fs.readFile(dataFile, "utf-8")); 
    const totalVotes = Object.values(data).reduce((total, n) => total  += n, 0);

    data = Object.entries(data).map(([label, votes]) => {
        //Return the label of the entry and the votes represented in percentage
        return {
            label,
            percentage : ((100 * votes) / totalVotes).toFixed(1) || 0.0 
        }
    });
    console.log(data);
    res.json(data);
});

app.post("/server", async(req, res) => {
    const data = JSON.parse(await fs.readFile(dataFile, "utf-8")); 
    if(data.hasOwnProperty(req.body.add)){
        data[req.body.add]++;

        await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
    
        res.send("Vote successful");
        res.end();
    }
    else{
        res.send("The entry does not exist")
    }

});
//app.listen(3000, () => console.log("Server running"));