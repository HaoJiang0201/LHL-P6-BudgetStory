exports.seed = function(knex, Promise) {
  return knex('categories').del()
    .then(function () {
      return Promise.all([
        knex('categories').insert({parent_id: 0, name: 'Expenses', notes: '', icon: ''}),
        knex('categories').insert({parent_id: 0, name: 'Incomes', notes: '', icon: ''}),
      ]);
    });
}