
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('tables').del()
    .then(function () {
      // Inserts seed entries
      return knex('tables').insert([
        {table_name: '#1', capacity: 6},
        {table_name: '#2', capacity: 6},
        {table_name: 'Bar #1', capacity: 1},
        {table_name: 'Bar #2', capacity: 1},
      ]);
    });
};

/* original params for ref
knex('table_name')
{id: 1, colName: row 1}
*/