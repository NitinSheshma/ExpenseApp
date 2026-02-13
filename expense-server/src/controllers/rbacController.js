const rbacDao = require('../dao/rbacDao');

const rbacController ={
    create: async (request, response) => {
        try {
            const adminuser = request.user;
            const {name , email, role} = request.body;

            const user =await rbacDao.create(email, name,role,adminuser._id);

            return response.status(200).json({
                message: 'User created',
                user: user
            });

        } catch (error) {
            console.log(error);
            response.status(500).json({message: 'Internal server error'});
        }
    },
    update: async (request, response) => {
        try {

        } catch (error) {
            console.log(error);
            response.status(500).json({message :'Internal server error'});
        }
    },
    delete: async (request, response) => {
        try {

        } catch (error) {
            console.log(error);
            response.status(500).json({message: 'Internal server error'});
        }
    }
};

module.exports = rbacController;