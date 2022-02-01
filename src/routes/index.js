const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const Pokemons = require('./Pokemons.js');
const Types = require('./Types.js');
const Favorites = require('./Favorites.js');

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.use("/pokemons", Pokemons);
router.use("/types", Types);
router.use("/favorites", Favorites);



module.exports = router;
