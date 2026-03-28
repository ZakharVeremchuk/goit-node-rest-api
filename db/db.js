import { Sequelize } from "sequelize";
import 'dotenv/config';

const { DB_URL } = process.env;

const sequelize = new Sequelize(DB_URL, {
    dialect: 'postgres',
    ssl: false
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
