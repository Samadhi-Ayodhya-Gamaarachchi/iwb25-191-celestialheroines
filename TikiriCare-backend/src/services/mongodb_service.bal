import ballerinax/mongodb;
import ballerina/log;
import ballerina/uuid;
import ballerina/time;

// Import types and config
import types;
import mongodb_config;

// MongoDB Client
mongodb:Client mongoClient = check new mongodb:Client(mongoConfig);

// User Database Operations
public function createUser(User user) returns error? {
    mongodb:InsertOneResult result = check mongoClient->insertOne(
        mongodb_config::DATABASE_NAME,
        mongodb_config::USERS_COLLECTION,
        user
    );
    
    if (result.insertedId is string) {
        user.id = result.insertedId;
    }
    
    log:printInfo("User created with ID: " + user.id);
    return ();
}

public function findUserByEmail(string email) returns User? {
    map<string> filter = {
        "email": email
    };
    
    var result = mongoClient->findOne(
        mongodb_config::DATABASE_NAME,
        mongodb_config::USERS_COLLECTION,
        filter
    );
    
    if (result is map<string>) {
        return result.cloneWithType(User);
    }
    
    return ();
}

public function updateUser(string userId, map<string> updates) returns error? {
    map<string> filter = {
        "_id": userId
    };
    
    map<string> updateDoc = {
        "$set": updates
    };
    
    mongodb:UpdateResult result = check mongoClient->updateOne(
        mongodb_config::DATABASE_NAME,
        mongodb_config::USERS_COLLECTION,
        filter,
        updateDoc
    );
    
    log:printInfo("User updated: " + result.modifiedCount + " documents modified");
    return ();
}

// Child Database Operations
public function createChild(Child child) returns error? {
    mongodb:InsertOneResult result = check mongoClient->insertOne(
        mongodb_config::DATABASE_NAME,
        mongodb_config::CHILDREN_COLLECTION,
        child
    );
    
    if (result.insertedId is string) {
        child.id = result.insertedId;
    }
    
    log:printInfo("Child created with ID: " + child.id);
    return ();
}

public function findChildrenByParentId(string parentId) returns Child[] {
    map<string> filter = {
        "parentId": parentId
    };
    
    var result = mongoClient->find(
        mongodb_config::DATABASE_NAME,
        mongodb_config::CHILDREN_COLLECTION,
        filter
    );
    
    if (result is map<string>[]) {
        Child[] children = [];
        foreach map<string> doc in result {
            Child child = doc.cloneWithType(Child);
            children.push(child);
        }
        return children;
    }
    
    return [];
}

public function findChildById(string childId) returns Child? {
    map<string> filter = {
        "_id": childId
    };
    
    var result = mongoClient->findOne(
        mongodb_config::DATABASE_NAME,
        mongodb_config::CHILDREN_COLLECTION,
        filter
    );
    
    if (result is map<string>) {
        return result.cloneWithType(Child);
    }
    
    return ();
}

public function updateChild(string childId, map<string> updates) returns error? {
    map<string> filter = {
        "_id": childId
    };
    
    map<string> updateDoc = {
        "$set": updates
    };
    
    mongodb:UpdateResult result = check mongoClient->updateOne(
        mongodb_config::DATABASE_NAME,
        mongodb_config::CHILDREN_COLLECTION,
        filter,
        updateDoc
    );
    
    log:printInfo("Child updated: " + result.modifiedCount + " documents modified");
    return ();
}

public function deleteChild(string childId) returns error? {
    map<string> filter = {
        "_id": childId
    };
    
    mongodb:DeleteResult result = check mongoClient->deleteOne(
        mongodb_config::DATABASE_NAME,
        mongodb_config::CHILDREN_COLLECTION,
        filter
    );
    
    log:printInfo("Child deleted: " + result.deletedCount + " documents deleted");
    return ();
}

// Vaccine Database Operations
public function createVaccine(Vaccine vaccine) returns error? {
    mongodb:InsertOneResult result = check mongoClient->insertOne(
        mongodb_config::DATABASE_NAME,
        mongodb_config::VACCINES_COLLECTION,
        vaccine
    );
    
    if (result.insertedId is string) {
        vaccine.id = result.insertedId;
    }
    
    log:printInfo("Vaccine created with ID: " + vaccine.id);
    return ();
}

public function findVaccinesByChildId(string childId) returns Vaccine[] {
    map<string> filter = {
        "childId": childId
    };
    
    var result = mongoClient->find(
        mongodb_config::DATABASE_NAME,
        mongodb_config::VACCINES_COLLECTION,
        filter
    );
    
    if (result is map<string>[]) {
        Vaccine[] vaccines = [];
        foreach map<string> doc in result {
            Vaccine vaccine = doc.cloneWithType(Vaccine);
            vaccines.push(vaccine);
        }
        return vaccines;
    }
    
    return [];
}

public function updateVaccine(string vaccineId, map<string> updates) returns error? {
    map<string> filter = {
        "_id": vaccineId
    };
    
    map<string> updateDoc = {
        "$set": updates
    };
    
    mongodb:UpdateResult result = check mongoClient->updateOne(
        mongodb_config::DATABASE_NAME,
        mongodb_config::VACCINES_COLLECTION,
        filter,
        updateDoc
    );
    
    log:printInfo("Vaccine updated: " + result.modifiedCount + " documents modified");
    return ();
}

// Growth Records Database Operations
public function createGrowthRecord(GrowthRecord record) returns error? {
    mongodb:InsertOneResult result = check mongoClient->insertOne(
        mongodb_config::DATABASE_NAME,
        mongodb_config::GROWTH_RECORDS_COLLECTION,
        record
    );
    
    if (result.insertedId is string) {
        record.id = result.insertedId;
    }
    
    log:printInfo("Growth record created with ID: " + record.id);
    return ();
}

public function findGrowthRecordsByChildId(string childId) returns GrowthRecord[] {
    map<string> filter = {
        "childId": childId
    };
    
    var result = mongoClient->find(
        mongodb_config::DATABASE_NAME,
        mongodb_config::GROWTH_RECORDS_COLLECTION,
        filter
    );
    
    if (result is map<string>[]) {
        GrowthRecord[] records = [];
        foreach map<string> doc in result {
            GrowthRecord record = doc.cloneWithType(GrowthRecord);
            records.push(record);
        }
        return records;
    }
    
    return [];
}

// Medical Records Database Operations
public function createMedicalRecord(MedicalRecord record) returns error? {
    mongodb:InsertOneResult result = check mongoClient->insertOne(
        mongodb_config::DATABASE_NAME,
        mongodb_config::MEDICAL_RECORDS_COLLECTION,
        record
    );
    
    if (result.insertedId is string) {
        record.id = result.insertedId;
    }
    
    log:printInfo("Medical record created with ID: " + record.id);
    return ();
}

public function findMedicalRecordsByChildId(string childId) returns MedicalRecord[] {
    map<string> filter = {
        "childId": childId
    };
    
    var result = mongoClient->find(
        mongodb_config::DATABASE_NAME,
        mongodb_config::MEDICAL_RECORDS_COLLECTION,
        filter
    );
    
    if (result is map<string>[]) {
        MedicalRecord[] records = [];
        foreach map<string> doc in result {
            MedicalRecord record = doc.cloneWithType(MedicalRecord);
            records.push(record);
        }
        return records;
    }
    
    return [];
} 