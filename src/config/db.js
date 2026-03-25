import mongoose from 'mongoose';

const connectMongoDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || process.env.URL_MONGODB;

        if (!uri) {
            throw new Error('La variable de entorno MONGODB_URI o URL_MONGODB no está configurada');
        }

        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log("Base de datos conectada");
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
        process.exit(1);
    }
}

export default connectMongoDB;