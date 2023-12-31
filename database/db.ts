import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('library', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

export default sequelize;