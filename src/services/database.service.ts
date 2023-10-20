// External Dependencies
import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";
import { error } from "console";

// Global Variables
export const collections: { games?: mongoDB.Collection } = {}

// Initialize Connection
export async function connectToDatabase () {
    dotenv.config();
    if(!process.env.REACT_APP_DB_CONN_STRING){
      throw error("connection string is undefined")
    }

    if(!process.env.REACT_APP_GAMES_COLLECTION_NAME){
      throw error("collection string is undefined")
    }
    
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.REACT_APP_DB_CONN_STRING);
            
    await client.connect();
        
    const db: mongoDB.Db = client.db(process.env.DB_NAME);
   
    const gamesCollection: mongoDB.Collection = db.collection(process.env.REACT_APP_GAMES_COLLECTION_NAME);
 
  collections.games = gamesCollection;
       
         console.log(`Successfully connected to database: ${db.databaseName} and collection: ${gamesCollection.collectionName}`);
 }