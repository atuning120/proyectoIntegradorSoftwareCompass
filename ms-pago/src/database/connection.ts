const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://diegomartinez:da280855@dev-cluster.ou83x.mongodb.net/?retryWrites=true&w=majority&appName=dev-cluster";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function connectToDatabase() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("¡Conectado exitosamente a MongoDB!");
    return client;
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
    throw error;
  }
}

