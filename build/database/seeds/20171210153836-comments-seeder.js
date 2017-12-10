'use strict';
module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.bulkInsert('comments', [
            {
                post_id: 1,
                user_id: 2,
                body: 'Your article is really long.. can you shorten it?',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                post_id: 1,
                user_id: 2,
                body: 'Actually, can you split it into two articles?',
                created_at: new Date(),
                updated_at: new Date()
            }
        ], { individualHooks: true });
    },
    down: function (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('comments', null, {});
    }
};
//# sourceMappingURL=20171210153836-comments-seeder.js.map