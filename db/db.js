import { Sequelize } from "sequelize";

const sequelize = new Sequelize("postgresql://db_contacts_77w8_user:ZqaltwG6TMYibjapMS7uNrHNkexlaopB@dpg-d6e54f75r7bs73bekk20-a.frankfurt-postgres.render.com/db_contacts_77w8", {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
})

export async function connectToPostgres() {
    try {
        await sequelize.authenticate();
        console.log("Connect to DB executed successfully");
    } catch(e) {
        console.error('Database connection error:', e);
        process.exit(1);
    }
}

export default sequelize;
