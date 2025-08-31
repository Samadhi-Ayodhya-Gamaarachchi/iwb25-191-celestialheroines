import ballerina/log;
import ballerina/time;
import ballerinax/mongodb;

// MongoDB Configuration
public final string MONGODB_URI = "mongodb+srv://user01:celestial4@ballerinaproject.fdijaa6.mongodb.net/?retryWrites=true&w=majority&appName=BallerinaProject";
public final string DATABASE_NAME = "tikiricare";

// Collection names
public final string USERS_COLLECTION = "users";
public final string CHILDREN_COLLECTION = "children";
public final string VACCINES_COLLECTION = "vaccines";
public final string GROWTH_RECORDS_COLLECTION = "growth_records";
public final string MEDICAL_RECORDS_COLLECTION = "medical_records";

// Type definitions
public type User record {
    string id?;
    string email;
    string password;
    string name;
    string? telephone;
    string role;
};

public type Child record {
    string id?;
    string name;
    string gender;
    string dateOfBirth;
    float? height;
    float? weight;
    float? bmi;
    string? parentId;
};

public type GrowthRecord record {
    string id?;
    string childId;
    float height;
    float weight;
    float bmi;
    string recordedDate;
};

// MongoDB client instance
mongodb:Client? mongoClient = ();

// Initialize MongoDB connection
public function initMongoDB() returns error? {
    mongodb:ConnectionConfig mongoConfig = {
        connection: MONGODB_URI
    };
    
    mongodb:Client|error mongoClientResult = new (mongoConfig);
    
    if (mongoClientResult is error) {
        log:printError("Failed to connect to MongoDB", mongoClientResult);
        return mongoClientResult;
    }
    
    mongoClient = mongoClientResult;
    log:printInfo("Successfully connected to MongoDB");
    return;
}

// Get MongoDB client
function getMongoClient() returns mongodb:Client|error {
    mongodb:Client? currentClient = mongoClient;
    if (currentClient is ()) {
        return error("MongoDB client not initialized");
    }
    return currentClient;
}

// Helper function to get current timestamp
function getCurrentTimestamp() returns string {
    return time:utcToString(time:utcNow());
}

// User operations
public function createUser(User user) returns string|error {
    mongodb:Client mongoClientRef = check getMongoClient();
    mongodb:Database db = check mongoClientRef->getDatabase(DATABASE_NAME);
    mongodb:Collection collection = check db->getCollection(USERS_COLLECTION);
    
    map<json> userDoc = {
        "email": user.email,
        "password": user.password,
        "name": user.name,
        "telephone": user.telephone,
        "role": user.role,
        "createdAt": getCurrentTimestamp(),
        "updatedAt": getCurrentTimestamp()
    };
    
    mongodb:Error? result = collection->insertOne(userDoc);
    if (result is mongodb:Error) {
        return result;
    }
    return "user-created-successfully";
}

public function getUserByEmail(string email) returns User|error? {
    mongodb:Client mongoClientRef = check getMongoClient();
    mongodb:Database db = check mongoClientRef->getDatabase(DATABASE_NAME);
    mongodb:Collection collection = check db->getCollection(USERS_COLLECTION);
    
    map<json> filter = {"email": email};
    map<json>|mongodb:Error? findResult = collection->findOne(filter);
    
    if (findResult is mongodb:Error) {
        return findResult;
    }
    
    if (findResult is ()) {
        return ();
    }
    
    json idField = findResult["_id"];
    json emailField = findResult["email"];
    json passwordField = findResult["password"];
    json nameField = findResult["name"];
    json? telephoneField = findResult["telephone"];
    json roleField = findResult["role"];
    
    return {
        id: idField.toString(),
        email: emailField.toString(),
        password: passwordField.toString(),
        name: nameField.toString(),
        telephone: telephoneField is () ? () : telephoneField.toString(),
        role: roleField.toString()
    };
}

// Child operations
public function createChild(Child child, string parentId) returns string|error {
    mongodb:Client mongoClientRef = check getMongoClient();
    mongodb:Database db = check mongoClientRef->getDatabase(DATABASE_NAME);
    mongodb:Collection collection = check db->getCollection(CHILDREN_COLLECTION);
    
    map<json> childDoc = {
        "name": child.name,
        "gender": child.gender,
        "dateOfBirth": child.dateOfBirth,
        "parentId": parentId,
        "height": child.height,
        "weight": child.weight,
        "bmi": child.bmi,
        "createdAt": getCurrentTimestamp(),
        "updatedAt": getCurrentTimestamp()
    };
    
    mongodb:Error? result = collection->insertOne(childDoc);
    if (result is mongodb:Error) {
        return result;
    }
    return "child-created-successfully";
}

public function getChildrenByParentId(string parentId) returns Child[]|error {
    mongodb:Client mongoClientRef = check getMongoClient();
    mongodb:Database db = check mongoClientRef->getDatabase(DATABASE_NAME);
    mongodb:Collection collection = check db->getCollection(CHILDREN_COLLECTION);
    
    map<json> filter = {"parentId": parentId};
    stream<map<json>, mongodb:Error?>|mongodb:Error findResult = collection->find(filter);
    
    if (findResult is mongodb:Error) {
        return findResult;
    }
    
    Child[] children = [];
    mongodb:Error? e = findResult.forEach(function(map<json> childDoc) {
        json idField = childDoc["_id"];
        json nameField = childDoc["name"];
        json genderField = childDoc["gender"];
        json dobField = childDoc["dateOfBirth"];
        json? heightField = childDoc["height"];
        json? weightField = childDoc["weight"];
        json? bmiField = childDoc["bmi"];
        json? parentIdField = childDoc["parentId"];
        
        Child childRecord = {
            id: idField.toString(),
            name: nameField.toString(),
            gender: genderField.toString(),
            dateOfBirth: dobField.toString(),
            height: heightField is () ? () : <float>heightField,
            weight: weightField is () ? () : <float>weightField,
            bmi: bmiField is () ? () : <float>bmiField,
            parentId: parentIdField is () ? () : parentIdField.toString()
        };
        children.push(childRecord);
    });
    
    if (e is mongodb:Error) {
        return e;
    }
    
    return children;
}

// Growth record operations
public function createGrowthRecord(GrowthRecord growthRecord) returns string|error {
    mongodb:Client mongoClientRef = check getMongoClient();
    mongodb:Database db = check mongoClientRef->getDatabase(DATABASE_NAME);
    mongodb:Collection collection = check db->getCollection(GROWTH_RECORDS_COLLECTION);
    
    map<json> recordDoc = {
        "childId": growthRecord.childId,
        "height": growthRecord.height,
        "weight": growthRecord.weight,
        "bmi": growthRecord.bmi,
        "recordedDate": growthRecord.recordedDate,
        "createdAt": getCurrentTimestamp()
    };
    
    mongodb:Error? result = collection->insertOne(recordDoc);
    if (result is mongodb:Error) {
        return result;
    }
    return "growth-record-created-successfully";
}

public function getGrowthRecordsByChildId(string childId) returns GrowthRecord[]|error {
    mongodb:Client mongoClientRef = check getMongoClient();
    mongodb:Database db = check mongoClientRef->getDatabase(DATABASE_NAME);
    mongodb:Collection collection = check db->getCollection(GROWTH_RECORDS_COLLECTION);
    
    map<json> filter = {"childId": childId};
    stream<map<json>, mongodb:Error?>|mongodb:Error findResult = collection->find(filter);
    
    if (findResult is mongodb:Error) {
        return findResult;
    }
    
    GrowthRecord[] records = [];
    mongodb:Error? e = findResult.forEach(function(map<json> recordDoc) {
        json idField = recordDoc["_id"];
        json childIdField = recordDoc["childId"];
        json heightField = recordDoc["height"];
        json weightField = recordDoc["weight"];
        json bmiField = recordDoc["bmi"];
        json dateField = recordDoc["recordedDate"];
        
        GrowthRecord growthRecordData = {
            id: idField.toString(),
            childId: childIdField.toString(),
            height: <float>heightField,
            weight: <float>weightField,
            bmi: <float>bmiField,
            recordedDate: dateField.toString()
        };
        records.push(growthRecordData);
    });
    
    if (e is mongodb:Error) {
        return e;
    }
    
    return records;
}

// Test connection function
public function testConnection() returns map<string>|error {
    mongodb:Client mongoClientRef = check getMongoClient();
    mongodb:Database db = check mongoClientRef->getDatabase(DATABASE_NAME);
    
    // Try to list collections to test connection
    string[]|mongodb:Error collections = db->listCollectionNames();
    
    if (collections is mongodb:Error) {
        return {
            "status": "error",
            "message": "Failed to connect to database",
            "error": collections.message()
        };
    }
    
    return {
        "status": "success",
        "message": "Successfully connected to MongoDB",
        "database": DATABASE_NAME,
        "collections": collections.toString()
    };
}

// Close MongoDB connection
public function closeMongoDB() returns error? {
    if (mongoClient is mongodb:Client) {
        log:printInfo("MongoDB connection closed");
        mongoClient = ();
    }
    return;
}
