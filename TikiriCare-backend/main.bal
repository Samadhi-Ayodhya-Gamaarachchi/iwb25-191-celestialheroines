import ballerinax/mongodb;
import ballerina/io;

public function main() returns error? {
    mongodb:Client mongoDb = check new ({
        connection: "mongodb+srv://user01:celestial4@ballerinaproject.fdijaa6.mongodb.net/?retryWrites=true&w=majority&appName=BallerinaProject"
    });

    mongodb:Database db = check mongoDb->getDatabase("TikiriCareDB");
    mongodb:Collection collection = check db->getCollection("TestCollection");

    // Insert a sample document

    check collection->insertOne({
        "name": "Test User",
        "role": "Developer",
        "createdAt": "2025-08-13"
    });

    io:println("Inserted document into MongoDB");

    // Close client
    check mongoDb->close();
}
