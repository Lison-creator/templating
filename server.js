/* On importe http */
const http = require("http");
const path = require("path");
const ejs = require("ejs");

let head = { "Content-Type": "text/html; charset=utf-8" }

/* Passerelle avec EJS : on crée une méthode*/

const renderView = (res, viewName, data = {}) => {
    /* data = {}: on rend le paramètre optionnel en créant un objet vide */

    /* Pour retrouver les routes plus facilement, on l'automatise */
    const fileName = path.resolve(__dirname, "views", "pages", viewName + ".ejs");

    ejs.renderFile(fileName, data, (error, contentHtml) => {

        res.writeHead(200);
        res.write(contentHtml);
        res.end();
    });
};

/* 
----------------------------------------------------------------
------------------------- LE ROUTER ----------------------------
----------------------------------------------------------------
 */

/* On créé un objet avec les différentes routes du site */
const router = {
    /* Route de base:  */
    "/": (req, res) => {

        const now = new Date();
        const optionsDate = { year: "numeric", month: "long", day: "numeric" };
        const dataHome = {
            dateDuJour: now.toLocaleDateString("fr-be", optionsDate)
        };
        renderView(res, "home", dataHome);
    },
    "/about": (req, res) => {
        renderView(res, "about");

    }
};
/* 
----------------------------------------------------------------
------------------------- LE SERVEUR ---------------------------
----------------------------------------------------------------
 */
const server = http.createServer((req, res) => {

    /* Log des requêtes */
    console.log(`Requête : [${req.method}] ${req.url}`);

    /* Système de routing  //TODO */

    /* On vérifie que l'url se trouve bien dans les routes (et donc dans l'objet "router") */

    if (req.url in router) {

        /* Si l'url existe bien, on déclenche le code du router */

        /* Dans la variable "action", on sélectionne dans l'objet "router" l'index où l'url existe */
        const action = router[req.url];

        /* Récupération de l'url */
        action(req, res);

        /* Le return met fin au code */
        return;
    }
    /* 
    ----------------------------------------------------------------
    ------------------------- ERREUR 404 ---------------------------
    ----------------------------------------------------------------
     */
    /* Gestion des erreurs: envoi une page 404 si non trouvé */
    res.writeHead(404);
    res.write(`<h1>Grave erreur: votre moniteur va s'autodétruire dans 5 secondes</h1>`);
    res.end();
});

/* On définit le port sur lequel écoute le serveur */
server.listen(3000, () => console.log("Le serveur écoute sur le port 3000"));