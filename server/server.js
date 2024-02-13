const fs = require('fs');
const express = require("express");
const bodyParser = require("body-parser");
const pg = require('pg');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
let pgClient = undefined; //db access information must be in config file


/** CONFIGURATION **/

const configFile = "config.json";
//Overidden by config file
let PORT = 80;
let staticDir = "static";


/** Handle Requests **/

//Serve static files
app.use(express.static(staticDir, {extensions:["html"], index: "index.html"}));

//Serve requests for information about an event
app.get("/event.json", (req, res) => {
    try {
        pgClient.query(`SELECT events.name, sections.name as section, starttime, endtime, people, description
                        FROM events INNER JOIN sections
                        ON events.sectionId = sections.id
                        WHERE events.id = $1`,
                        [req.query.id],
                        (err, result) => {
                            res.type("application/json");
                            res.status(200);
                            res.send(JSON.stringify({
                                "event-id": req.query.id,
                                "name": result.rows[0]["name"],
                                "section": result.rows[0]["section"],
                                "startTime": new Date(result.rows[0]["starttime"]),
                                "endTime": new Date(result.rows[0]["endtime"]),
                                "people": result.rows[0]["people"],
                                "desc": result.rows[0]["description"]
                            }));
                        });
    } catch(err) {
        error500(err, res);
    }
});

//Serve requests for list of all exisiting events
app.get("/events.json", (req, res) => {
    Promise.allSettled([
        pgClient.query(`SELECT id, name, starttime, endtime, people, description 
                    FROM events
                    WHERE sectionId = 1;`),
        pgClient.query(`SELECT id, name, starttime, endtime, people, description 
                    FROM events
                    WHERE sectionId = 2;`)
    ]).then(results => {
        res.type("application/json");
        res.status(200);
        res.send({
            "accepted": results[0].value.rows,
            "proposed": results[1].value.rows
        })
    });
    
});

//Handle event addition and edit requests
app.post("/submit-event", (req, res) => {
    try {
        if (req.body["event-id"] == -1) {
            pgClient.query(`INSERT INTO events
                            (name, sectionId, starttime, endtime, people, description)
                            values($1, (SELECT id FROM sections WHERE name = $2), $3, $4, $5, $6);`,
                            [req.body.name, req.body.section, new Date(req.body.startTime), new Date(req.body.endTime), req.body.people, req.body.desc],
                            (err, result) => { if (err) error500(err, res); });
        }
        else {
            pgClient.query(`UPDATE events 
                            SET name = $1, sectionId = (SELECT id FROM sections WHERE name = $2), starttime = $3, endtime = $4, people = $5, description = $6 
                            WHERE id = $7;`, 
                            [req.body.name, req.body.section, new Date(req.body.startTime), new Date(req.body.endTime), req.body.people, req.body.desc, req.body["event-id"]], 
                            (err, result) => { if (err) error500(err, res); });
        }
    } catch(err) {
        error500(err, res);
    }
    res.status(200);
    res.redirect("/");
});

//Handle event deletion requests
app.post("/delete-event.json", (req, res) => {
    try {
        pgClient.query(`DELETE FROM events
                        WHERE id = $1`,
                        [req.query["id"]], 
                        (err, result) => { 
                            if (err) error500(err, res); 
                            else {
                                res.status(200);
                                res.redirect("/");
                            }
                        });
    } catch(err) {
        error500(err, res);
    }
})


/** Request Errors **/

//handle 500 errors
app.use(function (err, req, res, next) {
	error500(err, res)
});

/**
 * Responds with server error and logs it to console
 * @param {Error} err 
 * @param {Response} res 
 */
function error500(err, res) {
    console.error(err);
	res.type("text/plain");
	res.status(500);
	res.send("500 - Server Error");
}

//handle 404 errors
app.use(function(req, res) {
    error404(res);
});

/**
 * Responds with 404 error
 * @param {Response} res 
 */
function error404(res) {
    res.status(404);
	//res.sendFile(__dirname + '/public/notfound.html');
    res.send("404 - File Not Found");
}


/** Server Startup **/

//Read config file if it exists and setup database access if available
try {
    let data = fs.readFileSync(configFile);
    let configs = JSON.parse(data);
    if (configs["port"]) PORT = configs["port"];
    if (configs["filesFolder"]) staticDir = configs["filesFolder"];

    try {
        if (configs["pgClient"]) {
            pgClient = new pg.Client({
                user: configs["pgClient"]["user"],
                password: configs["pgClient"]["password"],
                host: configs["pgClient"]["host"],
                port: configs["pgClient"]["port"],
                database: configs["pgClient"]["database"]
            });
            pgClient.connect();
        }
        else console.log("No database information provided, static files only.");
    } catch (err) { console.log("Error accessing database, static files only."); }
} catch(err) {
    console.log("Error reading config file, using defaults, static files only.");
}

//start server on specified port
app.listen(PORT, function() {
    console.log("Express started on http://localhost:" + PORT + "; press Ctrl-C to terminate.");
});
