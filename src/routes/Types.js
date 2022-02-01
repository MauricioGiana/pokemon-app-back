const { Router } = require("express");
const router = Router();
const { Type } = require("../db");
const axios = require("axios");
const sequelize = require("sequelize");



router.get("/", async (req, res) => {
    const types = await Type.findAll();
    if (!types || !types.length) {
        const { data: { results } } = await axios("https://pokeapi.co/api/v2/type");
        await axios.all(results.map(async type => {
            const { data: { name, id } } = await axios(type.url);
            await Type.create({ name, id });
        }))
        const tps = await Type.findAll();
        return res.json(tps.sort((a, b) => a.id - b.id));
    }
    res.json(types.sort((a, b) => a.id - b.id));
});

module.exports = router;