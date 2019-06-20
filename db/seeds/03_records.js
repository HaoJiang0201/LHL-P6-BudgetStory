exports.seed = function(knex, Promise) {
  return knex('records').del()
    .then(function () {
      return Promise.all([
      ]);
    });
}