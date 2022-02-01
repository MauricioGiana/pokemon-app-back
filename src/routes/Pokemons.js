const { Router } = require('express');
const router = Router();
const axios = require('axios');
const { Pokemon, Type } = require('../db');
const fetchPokemons = require('../utils');

let pokemonsApi;



router.get("/", async (req, res, next) => {
    try {
        if (req.query.name) {
            const pokemonApi = await fetchPokemons(req.query.name);
            const pokemonDb = await Pokemon.findOne({ where: { name: req.query.name }, include: Type });
            if (pokemonApi) return res.json(pokemonApi);
            if (pokemonDb) return res.json(pokemonDb);
            return res.status(404).json({ message: "Pokemon not found" });
        }
        let response = [];
        const pokemonsDb = await Pokemon.findAll({
            attributes: ['id', 'name', 'image', 'attack', "speed", "isCreated"],
            include: Type,
        });
        if (req.query.filter === "db") response = [...pokemonsDb];
        if (!pokemonsApi) pokemonsApi = await fetchPokemons();
        if (req.query.filter === "api") response = [...pokemonsApi];
        if (!req.query.filter) response = [...pokemonsApi, ...pokemonsDb];
        if (req.query.type) {
            response = response.filter(pokemon => pokemon.types.some(type => type.name === req.query.type));
        }
        if (req.query.order) {
            const { order } = req.query;
            const [prop, ord] = order.split("-");
            if (ord === "asc") response.sort((a, b) => {
                if (prop === "name") {
                    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                    return 0;
                };
                if (a[prop] > b[prop]) return 1;
                if (a[prop] < b[prop]) return -1;
                return 0;
            })
            else response.sort((a, b) => {
                if (prop === "name") {
                    if (a.name.toLowerCase() < b.name.toLowerCase()) return 1;
                    if (a.name.toLowerCase() > b.name.toLowerCase()) return -1;
                    return 0;
                };
                if (a[prop] < b[prop]) return 1;
                if (a[prop] > b[prop]) return -1;
                return 0;
            })
        }
        const totalPages = Math.ceil(response.length / 12);
        if (req.query.getallpokemons) {
            return res.json({
                totalPages,
                results: response
            });
        }
        if (req.query.page) {
            const { page } = req.query;
            if (1 > page > totalPages) return res.status(400).json({ msg: "Page not found" })
            let end = page * 12; start = end - 12;
            return res.json({
                totalPages,
                results: response.slice(start, end)
            });
        }
        res.json({
            totalPages,
            results: response.slice(0, 12)
        });
    } catch (error) {
        next(error);
    }
});

router.get("/:idPokemon", async (req, res, next) => {
    const { idPokemon } = req.params;
    try {
        const pokemonApi = await fetchPokemons(idPokemon);
        if (pokemonApi) return res.json(pokemonApi);
        const pokemonDb = await Pokemon.findOne({ where: { id: idPokemon }, include: Type });
        if (pokemonDb) return res.json(pokemonDb);
        return res.status(404).json({ message: "Pokemon not found" });
    } catch (error) {
        next(error);
    }
});

router.post("/", async (req, res, next) => {
    const params = {}
    for (let key in req.body) {
        key !== "types" && (params[key] = req.body[key]);
    }
    if (params.image === "") params.image = "https://cdn.pixabay.com/photo/2019/11/18/15/46/pokemon-4635112_960_720.png";
    const types = req.body.types;
    try {
        const [pokemon, created] = await Pokemon.findOrCreate({
            where: { name: params.name },
            defaults: params
        });
        if (created && types && types.length) {
            const typesDb = await Type.findAll({ where: { name: types } });
            pokemon.addTypes(typesDb.map(type => type.id));
        }
        created ?
            res.status(200).json({ msg: "Pokemon created successfully" }) :
            res.status(400).json({ msg: "Pokemon already exists" });
    } catch (error) {
        next(error);
    }
});

router.put("/edit/:idPokemon", async (req, res, next) => {
    const newParams = {};
    for (let key in req.body) {
        key !== "types" && (req.body[key] && (newParams[key] = req.body[key]));
    }
    const types = req.body.types;
    const { idPokemon } = req.params;
    try {
        await Pokemon.update(newParams, { where: { id: idPokemon } });
        if (types && types.length) {
            const typesDb = await Type.findAll({ where: { name: types } });
            const pokemon = await Pokemon.findOne({ where: { id: idPokemon } });
            pokemon.setTypes(typesDb.map(type => type.id));
            res.json({ msg: "Pokemon updated successfully" });
        }
    } catch (error) {
        next(error);
    }
});

router.delete("/delete/:idPokemon", async (req, res, next) => {
    const { idPokemon } = req.params;
    try {
        if (idPokemon) {
            const deletedPokemon = await Pokemon.destroy({ where: { id: idPokemon } });
            return res.json({ message: "Pokemon deleted" });
        }
    } catch (error) {
        next(error);
    }
});

router.delete("/clearcreatedpokemons", async (req, res, next) => {
    try {
        const deletedPokemons = await Pokemon.destroy({ where: {} });
        return res.json({ message: "All pokemons deleted" });
    } catch (error) {
        next(error);
    }
});



module.exports = router;






