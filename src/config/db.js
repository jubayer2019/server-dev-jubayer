import mongoose from "mongoose";

export async function connectDatabase(uri) {
  const connectionUri = uri || "mongodb://127.0.0.1:27017/portfolio";

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  await mongoose.connect(connectionUri, {
    autoIndex: true,
    serverSelectionTimeoutMS: 10000,
  });

  return mongoose.connection;
}

export async function connectDatabaseWithFallback(primaryUri, fallbackUri) {
  const defaultLocalUri = "mongodb://127.0.0.1:27017/portfolio";
  const primary = primaryUri || defaultLocalUri;
  const fallback = fallbackUri || defaultLocalUri;

  try {
    return await connectDatabase(primary);
  } catch (primaryError) {
    if (primary === fallback) {
      throw primaryError;
    }

    console.error("Primary MongoDB connection failed. Trying fallback URI.");
    return connectDatabase(fallback);
  }
}
