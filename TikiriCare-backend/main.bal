import ballerinax/mongodb;

public function main() returns error? {
    // Create MongoDB client (Atlas URI)
   mongodb:Client mongoDb = check new ({
    connection: "mongodb+srv://user01:celestial4@ballerinaproject.fdijaa6.mongodb.net/?retryWrites=true&w=majority"
});

    // Get database
    mongodb:Database db = check mongoDb->getDatabase("TestDB");
    // Get collection
    mongodb:Collection caregiversCollection = check db->getCollection("Caregivers");



    // Close client
    check mongoDb->close();
}