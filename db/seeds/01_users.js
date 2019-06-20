exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        knex('users').insert({first_name: 'Hao', last_name: 'Jiang', email:'haojiang0201@gmail.com', password:'123456'})
      ]);
    });
}