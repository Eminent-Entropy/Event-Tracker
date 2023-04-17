const http = require("http");
const path = require("path");
const fs = require("fs");

class Server {
    static requiredConfigs = ["port", "mimeLookup", "filesFolder"];
    static defaultConfigs = {
        "port": 80,
        "mimeLookup": {
            ".js": "application/javascript",
            ".html": "text/html",
            ".css": "text/css"
        },
        "filesFolder": "static"
    };

    /**
     * Ensures vaild config and returns a new Server instance 
     * @param {string=} configFile - path to config file
     * @returns {Server} Server
     */
    static init(configFile) {
        if (!configFile) {
            console.log("Using default configs...");
            return new Server(this.defaultConfigs);
        }
        
        fs.readFile(configFile, (err, data) => {
            /** @type {object} - parsed config json */
            let config;

            //reads config file if available
            if (err) {
                console.log(err);
                console.log("Could not read config file, using default values...");
                config = this.defaultConfigs;
            }
            else config = JSON.parse(data);

            //ensures all requires configs are included
            if ( !this.requiredConfigs.every(reqKey =>  reqKey in config) ){
                console.log("Config file is invalid, using default values...");
                config = this.defaultConfigs;
            }

            console.log("Configs loaded...");
            return new Server(config);
        });
    }

    /**
     * Sets up variables and starts the server
     * @param {object} config - Contains server configs
     */
    constructor(config) {
        console.log("Starting server...");

        /** @type {number} - port number */
        this.port = config["port"];
        /** @type {object} - object contains vaild mime types */
        this.mimeLookup = config["mimeLookup"];
        /** @type {string} - path to served files */
        this.filesFolder = config["filesFolder"];

        this.createServer();
        this.server.listen(this.port);
        console.log("Listening on port " + this.port);
    }


    /**
     * Creates the http server
     */
    createServer() {
        /** @type {http.Server} - http server */
        this.server = http.createServer((req,res)=>{
            switch(req.method){
                case "GET":
                    this.get(req, res);
                    break;
                case "POST":
                    this.post(req, res)
                    break;
            }
        });
    }

    /**
     * Handles GET requests
     * @param {http.IncomingMessage} req - HTTP Request
     * @param {http.ServerResponse} res - HTTP Response
     */
    get(req, res) {
        //setup file path
        /** @type {string} - requested file url*/
        let file;
        if(req.url =="/")
            file = "index.html";
        else
            file = req.url;

        /** @type {string} - path to requested file */
        let filepath = path.resolve(`./${this.filesFolder}/${file}`);

        //ensures requested file is not outside the application
        if (!filepath.includes(__dirname)) {
            this.forbidden(res);
            return;
        }

        //check mime
        /** @type {string} - requested file extension */
        let ext = path.extname(filepath);
        /** @type {string} - requested mime type*/
        let mimeType = this.mimeLookup[ext];
        if(!mimeType){
            this.notFound(res);
            return;
        }

        //finds file and reads if available
        fs.access(filepath, err => {
            if(err){
                this.notFound(res);
                return;
            }
            res.writeHead(200,{"Content-Type": mimeType});
            fs.createReadStream(filepath).pipe(res); //responds with file
        });
    }

    /**
     * Handles POST requests. Not needed now.
     * @param {http.IncomingMessage} req - HTTP Request
     * @param {http.ServerResponse} res - HTTP Response
     */
    post(req, res) {
        
    }

    /**
     * Handles file not found errors
     * @param {http.ServerResponse} response - HTTP Response
     */
    notFound(response) {
        response.writeHead(404,{"content-type":"text/plain"});
        response.write("404, could not find requested file.");
        response.end();
    }

    /**
     * Handles forbidden errors
     * @param {http.ServerResponse} response - HTTP Response
     */
    forbidden(response) {
        response.writeHead(403,{"content-type":"text/plain"});
        response.write("403, Forbidden");
        response.end();
    }
}
module.exports = Server;