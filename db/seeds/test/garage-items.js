
exports.seed = (knex, Promise) => {
  return knex('garage').del()
    .then(() => {
      return Promise.all([
        knex('garage').insert([
          {
            id: 1,
            item_name: 'shovel',
            reason: 'digging holes in the backyard',
            cleanliness: 'dusty'
          },
          {
            id: 2,
            item_name: 'garbage bags',
            reason: 'bagging items to bury in holes',
            cleanliness: 'sparkling'
          },
          {
            id: 3,
            item_name: 'hacksaw',
            reason: 'cutting things apart to place in bags and bury in backyard',
            cleanliness: 'rancid'
          },
        ])
      ]);
    });
};
