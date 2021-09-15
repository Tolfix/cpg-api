/**
 * @description
 * Used if this service is running in debug mode.
 */
export const DebugMode = process.env.DEBUG === "true" ? true : false;
export const HomeDir = ((__dirname.replace("\\build", "")).replace("/build", ""));

export const PORT = process.env.PORT ?? 8080;

export const MongoDB_URI = process.env.MONGO_URI ?? "mongodb://localhost/cpg";