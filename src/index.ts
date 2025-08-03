import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import router from './routes/index.ts';
import sequelize from './models/db.ts';

dotenv.config();

const app = express();

app.use(cookieParser());

app.use(bodyParser.json());
app.use(express.json())
app.use('/public', express.static('public'));

app.use('/api', router())

app.listen(process.env.PORT || 3000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
    });


//db connection
sequelize.authenticate()
  .then(() => console.log('✅ Database connected'))
  .catch(err => console.error('❌ Unable to connect to DB:', err));

// ✅ Sync models to DB before starting server
sequelize.sync({ force: false })
  .then(() => {
    console.log('✅ Tables synced here migration is note created');

    
  })
  .catch(err => {
    console.error('❌ Sync error:', err);
  });