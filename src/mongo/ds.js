import mongoose from 'mongoose';
import { PERSISTENCE, MONGODB_CNX_STR } from '../config/config.js';

class DBManager {
  constructor() {
    if (PERSISTENCE === 'MONGO') {
      this.connectToMongoDB();
    } else {
      this.contacts = [];  
    }
  }

  async connectToMongoDB() {
    try {
      await mongoose.connect(MONGODB_CNX_STR, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Conectado a MongoDB');
    } catch (error) {
      console.error('Error conectando a MongoDB:', error);
    }
  }
}

export default new DBManager();