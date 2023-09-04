const express = require("express");
const ExpressError = require("../expressError")
const db = require("../db");

let router = new express.Router();

router.get("/", async (req, res, next) =>{
    try {
        const results = await db.query(`SELECT code, name, description FROM companies`);

    return res.json({"compaines": results.rows});
    }
    catch(e){
        return next(e);
    }
});

router.get("/:code", async (req, res, next)=>{
    const code = req.params.code
    try {
        const results = await db.query(`SELECT name, description FROM companies WHERE code = $1`, [code]);
        const company = results.rows[0];
        return res.json({"company": company});
    }
    catch(e){
        return next(e);
    }
})

router.post("/", async function(req, res, next){
    try{
    let { code, name, description } = req.body;
    const results = await db.query('INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description', [code, name, description]);
    console.log(results)
    return res.json({"company": results.rows[0]});
    }
    catch(e){
        return next(e);
    }
})

module.exports = router;