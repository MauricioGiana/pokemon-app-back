/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require('chai');
const session = require('supertest-session');
const app = require('../../src/app.js');
const { Pokemon, conn } = require('../../src/db.js');

const agent = session(app);
const pokemon = {
  name: 'Pikachu',
};

describe('Pokemon routes', () => {
  before(() => conn.authenticate()
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  }));
  beforeEach(() => Pokemon.sync({ force: true })
    .then(() => Pokemon.create(pokemon)));
  describe('GET /pokemons', () => {
    it('should get 200', () =>
      agent.get('/pokemons').expect(200)
    );
  });

  describe('POST /pokemons', function () {
    it('responde con 200', function(){
      return agent.post('/pokemons')
        .send({
          name: "Giana",
          types: ["grass", "poison", "flying"],
        })
        .expect(200);
    });
    it('crea un Pokemon en la base de datos', function(){
      return agent.post('/pokemons')
        .send({
          name: "Giana",
          types: "flying",
        })
        .then(() => {
          return Pokemon.findOne({
            where: {
              name: 'Giana'
            }
          });
        })
        .then(pokemon => {
          expect(pokemon).to.exist;
        });
    });
  });



});
