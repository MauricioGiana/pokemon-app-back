const { Router } = require('express');
const router = Router();
const axios = require('axios');

module.exports = fetchPokemons = async (argument) => {
    try {
        let url;
        if (!argument) {
            url = "https://pokeapi.co/api/v2/pokemon";
            const result = await fetchFunc(url);
            await result.get(0, 15);
            await result.get(15, 30);
            await result.get(30, 40);
            return result.pokemons.sort((a, b) => a.id - b.id);
        }
        url = `https://pokeapi.co/api/v2/pokemon/${argument}`;
        const result = await fetchFunc(url);
        return result;
    } catch (error) {
        console.log(error);
    }
}

async function fetchFunc(url) {
    if (url.split("/").pop() === "pokemon") {
        try {
            const { data: res1 } = await axios(url);
            const { data: res2 } = await axios(res1.next);
            const results = [...res1.results, ...res2.results];
            const pokemons = [];
            return {
                pokemons,
                get: async (start, end) => {
                    await axios.all(results.slice(start, end).map(async result => {
                        const { data } = await axios(result.url)
                        pokemons.push({
                            name: data.name[0].toUpperCase() + data.name.slice(1),
                            id: data.id,
                            attack: data.stats[1].base_stat,
                            speed: data.stats[5].base_stat,
                            image: data.sprites.other.home.front_default,
                            types: data.types.map(type => ({
                                name: type.type.name,
                                id: type.type.url.split("/").slice(-2)[0]
                            })),
                        });
                    }))
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    try {
        const { data } = await axios(url);
        return {
            name: data.name[0].toUpperCase() + data.name.slice(1),
            id: data.id,
            height: data.height,
            weight: data.weight,
            hp: data.stats[0].base_stat,
            attack: data.stats[1].base_stat,
            defense: data.stats[2].base_stat,
            speed: data.stats[5].base_stat,
            image: data.sprites.other?.home.front_default,
            types: data.types.map(type => ({
                name: type.type.name,
                id: type.type.url.split("/").slice(-2)[0]
            })),
        }
    } catch (error) {
        return null;
    }
}
