import { Sequelize } from "sequelize";
import { Postgres_Database, Postgres_Host, Postgres_Password, Postgres_Port, Postgres_User } from "../Config";

export const postgres = new Sequelize(`postgres://${Postgres_User}:${Postgres_Password}@${Postgres_Host}:${Postgres_Port}/${Postgres_Database}`);