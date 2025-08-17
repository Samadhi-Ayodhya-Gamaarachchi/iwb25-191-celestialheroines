import ballerinax/mongodb;

// MongoDB Configuration
public final string MONGODB_URI = "mongodb+srv://user01:celestial4@ballerinaproject.fdijaa6.mongodb.net/?retryWrites=true&w=majority&appName=BallerinaProject";
public final string DATABASE_NAME = "tikiricare";

// MongoDB Client Configuration
public mongodb:ClientConfiguration mongoConfig = {
    connectionString: MONGODB_URI,
    maxPoolSize: 10,
    minPoolSize: 1,
    maxIdleTime: 30000,
    waitQueueTimeout: 5000
};

// Collection names
public final string USERS_COLLECTION = "users";
public final string CHILDREN_COLLECTION = "children";
public final string VACCINES_COLLECTION = "vaccines";
public final string GROWTH_RECORDS_COLLECTION = "growth_records";
public final string MEDICAL_RECORDS_COLLECTION = "medical_records"; 