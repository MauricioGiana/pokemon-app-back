const { Router } = require("express");
const router = Router();
const { Favorite } = require("../db");


router.get("/", async (req, res, next) => {
    try {
        const favorites = await Favorite.findAll();
        res.json(favorites);
    } catch (error) {
        next(error);
    }
});

router.post("/add/:idPokemon", async (req, res, next) => {
    const { idPokemon } = req.params;
    try {
        const [favorite, created] = await Favorite.findOrCreate({
            where: { idPokemon },
            defaults: {
                idPokemon
            }
        });
        if (created) {
            res.status(200).json({ msg: "Pokemon added to favorites" });
        } else {
            res.status(400).json({ msg: "Favorite already exists" });
        }
    } catch (error) {
        next(error);
    }
});

router.delete("/quit/:idPokemon", async (req, res, next) => {
    const { idPokemon } = req.params;
    try {
        const deletedFavorite = await Favorite.destroy({ where: { idPokemon } });
        return res.json({ message: "Favorite deleted" });
    } catch (error) {
        next(error);
    }
});

router.delete("/deleteall", async (req, res, next) => {
    try {
        const deletedFavorites = await Favorite.destroy({ where: {} });
        return res.json({ message: "All favorites deleted" });
    } catch (error) {
        next(error);
    }
});



/* router.get("/", (req, res) => {
    const {ids} = req.cookies;
    ids ? res.json(ids) : res.json([]);
});

router.get("/add/:idPokemon", (req, res) => {
    const { idPokemon } = req.params;
    if (!req.cookies.ids) {
        res.cookie("ids", [idPokemon]);
        res.json({ msg: "Pokemon added to favorites" });
    }
    let ids = req.cookies.ids;
    if (!ids.includes(idPokemon)) {
        ids = [...ids, idPokemon];
        res.cookie("ids", ids);
        res.json({ msg: "Pokemon added to favorites" });
    } else {
        res.json({ msg: "Pokemon already in favorites" });
    }
});

router.get("/quit/:idPokemon", (req, res) => {
    const { idPokemon } = req.params;
    let ids = req.cookies.ids;
    ids = ids.filter(id => id !== idPokemon);
    res.cookie("ids", ids);
    res.json({ msg: "Pokemon removed from favorites" });
});

router.get("/deleteall", (req, res) => {
    res.clearCookie("ids");
    res.json({ msg: "All favorites deleted" });
}); */





module.exports = router;