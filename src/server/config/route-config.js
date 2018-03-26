(function (routeConfig) {

  'use strict';

  routeConfig.init = function (app) {

    // *** routes *** //
    const userRoutes = require('../routes/user');
    const authRoutes = require('../routes/auth');
    const itemRoutes = require('../routes/item');
    // *** register routes *** //
    app.use('/api/v1/user', userRoutes);
    app.use('/api/v1/auth', authRoutes);
    app.use('/api/v1/item', itemRoutes);
  };

})(module.exports);
