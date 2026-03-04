import { Sequelize } from "sequelize";

const sequelize = new Sequelize("YOUR_URL", {
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
