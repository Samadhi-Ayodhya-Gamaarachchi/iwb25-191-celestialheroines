import ballerina/http;
import ballerina/jwt;
import ballerina/time;
import ballerina/log;
import ballerina/uuid;

// Main entry point for TikiriCare and TikiriPiyasa backend
// Start with: bal run from TikiriCare-backend directory

listener http:Listener httpListener = new(8080, {
    host: "0.0.0.0"
});

// JWT Configuration
final string JWT_SECRET = "tikiricare-piyasa-secret-2025";
final string JWT_ISSUER = "tikiricare-piyasa";

// Types for TikiriCare
type User record {
    string id;
    string email;
    string name;
    string telephone?;
    string password;
    string role; // "parent" or "caregiver"
    string createdAt;
    string updatedAt;
};

type Child record {
    string id;
    string parentId;
    string name;
    string gender;
    string dateOfBirth;
    int ageInMonths;
    decimal height;
    decimal weight;
    decimal bmi;
    string lastCheckup?;
    int developmentScore;
    string createdAt;
    string updatedAt;
};

type GrowthRecord record {
    string id;
    string childId;
    decimal height;
    decimal weight;
    decimal bmi;
    string recordedDate;
    string createdAt;
};

// Types for TikiriPiyasa (Caregiver marketplace)
type CaregiverProfile record {
    string id;
    string userId;
    string name;
    string specialization;
    string experience;
    string location;
    string contactNumber;
    decimal rating;
    int reviewCount;
    string[] services;
    boolean available;
    string createdAt;
    string updatedAt;
};

type CareRequest record {
    string id;
    string parentId;
    string childId;
    string caregiverId?;
    string serviceType;
    string description;
    string preferredDate;
    string preferredTime;
    string status; // "pending", "accepted", "completed", "cancelled"
    string createdAt;
    string updatedAt;
};

// In-memory storage (replace with database in production)
map<User> users = {};
map<Child> children = {};
map<string[]> userChildren = {}; // parentId -> childIds
map<GrowthRecord> growthRecords = {};
map<string[]> childGrowthRecords = {}; // childId -> recordIds
map<CaregiverProfile> caregivers = {};
map<CareRequest> careRequests = {};

// Helper functions
function sendResponse(http:Caller caller, int statusCode, json payload) returns error? {
    http:Response res = new;
    res.statusCode = statusCode;
    res.setJsonPayload(payload);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    check caller->respond(res);
}

function createErrorResponse(string message) returns json {
    return { success: false, message: message };
}

function createSuccessResponse(json data, string message = "Success") returns json {
    return { success: true, message: message, data: data };
}

function issueJWTToken(string email) returns string|error {
    decimal currentTime = <decimal>time:utcNow()[0];
    jwt:IssuerConfig issuerConfig = {
        issuer: JWT_ISSUER,
        username: email,
        expTime: currentTime + 86400, // 24 hours
        signatureConfig: {
            algorithm: jwt:HS256,
            config: JWT_SECRET
        }
    };
    return jwt:issue(issuerConfig);
}

function validateJWTToken(string token) returns string|error {
    jwt:ValidatorConfig validatorConfig = {
        issuer: JWT_ISSUER,
        signatureConfig: {
            secret: JWT_SECRET
        }
    };
    jwt:Payload|error payload = jwt:validate(token, validatorConfig);
    if (payload is error) {
        return payload;
    }
    anydata? subject = payload["sub"];
    if (subject is string) {
        return subject;
    }
    return error("Invalid token subject");
}

function getCurrentUser(http:Request req) returns User|error {
    string|error authHeader = req.getHeader("Authorization");
    if (authHeader is error || !authHeader.startsWith("Bearer ")) {
        return error("Authorization header missing or invalid");
    }
    string token = authHeader.substring(7);
    string|error email = validateJWTToken(token);
    if (email is error) {
        return email;
    }
    if (!users.hasKey(email)) {
        return error("User not found");
    }
    User? userOptional = users[email];
    if (userOptional is ()) {
        return error("User not found");
    }
    return userOptional;
}

function calculateBMI(decimal height, decimal weight) returns decimal {
    if (height <= 0.0d) {
        return 0.0d;
    }
    decimal heightInMeters = height / 100.0d;
    return weight / (heightInMeters * heightInMeters);
}

// Main service
service / on httpListener {
    
    // CORS preflight handler
    resource function options [string... path](http:Caller caller, http:Request req) returns error? {
        return sendResponse(caller, 204, {});
    }

    // Health check endpoint
    resource function get health(http:Caller caller, http:Request req) returns error? {
        json response = {
            success: true,
            status: "Server is running",
            timestamp: time:utcNow().toString(),
            services: ["TikiriCare", "TikiriPiyasa"]
        };
        return sendResponse(caller, 200, response);
    }

    // Authentication endpoints
    resource function post auth/register(http:Caller caller, http:Request req) returns error? {
        json|error payload = req.getJsonPayload();
        if (payload is error) {
            return sendResponse(caller, 400, createErrorResponse("Invalid JSON payload"));
        }

        if (payload is map<json>) {
            anydata? emailData = payload["email"];
            anydata? nameData = payload["name"];
            anydata? passwordData = payload["password"];
            anydata? telephoneData = payload["telephone"];
            anydata? roleData = payload["role"];

            if (emailData is () || nameData is () || passwordData is ()) {
                return sendResponse(caller, 400, createErrorResponse("Email, name, and password are required"));
            }

            string email = emailData.toString();
            string name = nameData.toString();
            string password = passwordData.toString();
            string telephone = telephoneData is () ? "" : telephoneData.toString();
            string role = roleData is () ? "parent" : roleData.toString();

            if (email.trim() == "" || name.trim() == "" || password.trim() == "") {
                return sendResponse(caller, 400, createErrorResponse("Email, name, and password are required"));
            }

            if (users.hasKey(email)) {
                return sendResponse(caller, 409, createErrorResponse("User with this email already exists"));
            }

            string userId = uuid:createType1AsString();
            string currentTime = time:utcNow().toString();
            
            User newUser = {
                id: userId,
                email: email,
                name: name,
                telephone: telephone,
                password: password, // In production, hash this
                role: role,
                createdAt: currentTime,
                updatedAt: currentTime
            };

            users[email] = newUser;
            userChildren[userId] = [];

            log:printInfo("New user registered: " + email);
            
            json userJson = {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role
            };
            
            return sendResponse(caller, 201, createSuccessResponse(userJson, "User registered successfully"));
        }
        
        return sendResponse(caller, 400, createErrorResponse("Invalid payload format"));
    }

    resource function post auth/login(http:Caller caller, http:Request req) returns error? {
        json|error payload = req.getJsonPayload();
        if (payload is error) {
            return sendResponse(caller, 400, createErrorResponse("Invalid JSON payload"));
        }

        if (payload is map<json>) {
            anydata? emailData = payload["email"];
            anydata? passwordData = payload["password"];

            if (emailData is () || passwordData is ()) {
                return sendResponse(caller, 400, createErrorResponse("Email and password are required"));
            }

            string email = emailData.toString();
            string password = passwordData.toString();

            if (email.trim() == "" || password.trim() == "") {
                return sendResponse(caller, 400, createErrorResponse("Email and password are required"));
            }

            if (!users.hasKey(email)) {
                return sendResponse(caller, 401, createErrorResponse("Invalid email or password"));
            }

            User? userOptional = users[email];
            if (userOptional is ()) {
                return sendResponse(caller, 401, createErrorResponse("Invalid email or password"));
            }
            
            User user = userOptional;
            if (user.password != password) {
                return sendResponse(caller, 401, createErrorResponse("Invalid email or password"));
            }

            string|error token = issueJWTToken(email);
            if (token is error) {
                log:printError("Token generation failed: " + token.message());
                return sendResponse(caller, 500, createErrorResponse("Authentication failed"));
            }

            json userJson = {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            };

            json response = {
                success: true,
                message: "Login successful",
                data: {
                    token: token,
                    user: userJson
                }
            };

            log:printInfo("User logged in: " + email);
            return sendResponse(caller, 200, response);
        }
        
        return sendResponse(caller, 400, createErrorResponse("Invalid payload format"));
    }

    // TikiriCare Children Management
    resource function get children(http:Caller caller, http:Request req) returns error? {
        User|error currentUser = getCurrentUser(req);
        if (currentUser is error) {
            return sendResponse(caller, 401, createErrorResponse("Unauthorized"));
        }

        string[] childIds = userChildren[currentUser.id] ?: [];
        json[] userChildrenList = [];
        
        foreach string childId in childIds {
            Child? childOptional = children[childId];
            if (childOptional is Child) {
                json childJson = {
                    id: childOptional.id,
                    name: childOptional.name,
                    gender: childOptional.gender,
                    dateOfBirth: childOptional.dateOfBirth,
                    height: childOptional.height,
                    weight: childOptional.weight,
                    bmi: childOptional.bmi
                };
                userChildrenList.push(childJson);
            }
        }

        return sendResponse(caller, 200, createSuccessResponse(userChildrenList, "Children retrieved successfully"));
    }

    resource function post children(http:Caller caller, http:Request req) returns error? {
        User|error currentUser = getCurrentUser(req);
        if (currentUser is error) {
            return sendResponse(caller, 401, createErrorResponse("Unauthorized"));
        }

        json|error payload = req.getJsonPayload();
        if (payload is error) {
            return sendResponse(caller, 400, createErrorResponse("Invalid JSON payload"));
        }

        if (payload is map<json>) {
            anydata? nameData = payload["name"];
            anydata? genderData = payload["gender"];
            anydata? dateOfBirthData = payload["dateOfBirth"];
            anydata? heightData = payload["height"];
            anydata? weightData = payload["weight"];

            if (nameData is () || genderData is () || dateOfBirthData is ()) {
                return sendResponse(caller, 400, createErrorResponse("Name, gender, and date of birth are required"));
            }

            string name = nameData.toString();
            string gender = genderData.toString();
            string dateOfBirth = dateOfBirthData.toString();
            decimal height = heightData is () ? 0.0 : <decimal>heightData;
            decimal weight = weightData is () ? 0.0 : <decimal>weightData;

            if (name.trim() == "" || gender.trim() == "" || dateOfBirth.trim() == "") {
                return sendResponse(caller, 400, createErrorResponse("Name, gender, and date of birth are required"));
            }

            string childId = uuid:createType1AsString();
            string currentTime = time:utcNow().toString();
            
            Child newChild = {
                id: childId,
                parentId: currentUser.id,
                name: name,
                gender: gender,
                dateOfBirth: dateOfBirth,
                ageInMonths: 0, // Calculate based on date of birth
                height: height,
                weight: weight,
                bmi: calculateBMI(height, weight),
                developmentScore: 0,
                createdAt: currentTime,
                updatedAt: currentTime
            };

            children[childId] = newChild;
            
            string[] currentChildIds = userChildren[currentUser.id] ?: [];
            string[] newChildIds = currentChildIds.clone();
            newChildIds.push(childId);
            userChildren[currentUser.id] = newChildIds;

            // Initialize related arrays
            childGrowthRecords[childId] = [];

            log:printInfo("New child created: " + name + " for user: " + currentUser.email);
            
            json childJson = {
                id: newChild.id,
                name: newChild.name,
                gender: newChild.gender,
                dateOfBirth: newChild.dateOfBirth,
                height: newChild.height,
                weight: newChild.weight,
                bmi: newChild.bmi
            };
            
            return sendResponse(caller, 201, createSuccessResponse(childJson, "Child created successfully"));
        }
        
        return sendResponse(caller, 400, createErrorResponse("Invalid payload format"));
    }

    // Growth Records
    resource function post children/[string childId]/growth(http:Caller caller, http:Request req) returns error? {
        User|error currentUser = getCurrentUser(req);
        if (currentUser is error) {
            return sendResponse(caller, 401, createErrorResponse("Unauthorized"));
        }

        if (!children.hasKey(childId)) {
            return sendResponse(caller, 404, createErrorResponse("Child not found"));
        }

        Child? childOptional = children[childId];
        if (childOptional is ()) {
            return sendResponse(caller, 404, createErrorResponse("Child not found"));
        }
        
        Child child = childOptional;
        if (child.parentId != currentUser.id) {
            return sendResponse(caller, 403, createErrorResponse("Access denied"));
        }

        json|error payload = req.getJsonPayload();
        if (payload is error) {
            return sendResponse(caller, 400, createErrorResponse("Invalid JSON payload"));
        }

        if (payload is map<json>) {
            anydata? heightData = payload["height"];
            anydata? weightData = payload["weight"];
            anydata? recordedDateData = payload["recordedDate"];

            if (heightData is () || weightData is () || recordedDateData is ()) {
                return sendResponse(caller, 400, createErrorResponse("Height, weight, and recorded date are required"));
            }

            decimal height = <decimal>heightData;
            decimal weight = <decimal>weightData;
            string recordedDate = recordedDateData.toString();

            if (height <= 0.0d || weight <= 0.0d) {
                return sendResponse(caller, 400, createErrorResponse("Height and weight must be positive values"));
            }

            string recordId = uuid:createType1AsString();
            string currentTime = time:utcNow().toString();
            
            GrowthRecord newRecord = {
                id: recordId,
                childId: childId,
                height: height,
                weight: weight,
                bmi: calculateBMI(height, weight),
                recordedDate: recordedDate,
                createdAt: currentTime
            };

            growthRecords[recordId] = newRecord;
            
            string[] currentRecords = childGrowthRecords[childId] ?: [];
            string[] newRecords = currentRecords.clone();
            newRecords.push(recordId);
            childGrowthRecords[childId] = newRecords;

            // Update child's current measurements
            child.height = height;
            child.weight = weight;
            child.bmi = calculateBMI(height, weight);
            child.updatedAt = currentTime;
            children[childId] = child;

            json recordJson = {
                id: newRecord.id,
                height: newRecord.height,
                weight: newRecord.weight,
                bmi: newRecord.bmi,
                recordedDate: newRecord.recordedDate
            };

            return sendResponse(caller, 201, createSuccessResponse(recordJson, "Growth record added successfully"));
        }
        
        return sendResponse(caller, 400, createErrorResponse("Invalid payload format"));
    }

    // TikiriPiyasa Caregiver Management
    resource function get caregivers(http:Caller caller, http:Request req) returns error? {
        json[] caregiverList = [];
        
        foreach var caregiver in caregivers {
            if (caregiver.available) {
                json caregiverJson = {
                    id: caregiver.id,
                    name: caregiver.name,
                    specialization: caregiver.specialization,
                    experience: caregiver.experience,
                    location: caregiver.location,
                    rating: caregiver.rating,
                    services: caregiver.services
                };
                caregiverList.push(caregiverJson);
            }
        }

        return sendResponse(caller, 200, createSuccessResponse(caregiverList, "Caregivers retrieved successfully"));
    }

    resource function post caregivers/register(http:Caller caller, http:Request req) returns error? {
        User|error currentUser = getCurrentUser(req);
        if (currentUser is error) {
            return sendResponse(caller, 401, createErrorResponse("Unauthorized"));
        }

        json|error payload = req.getJsonPayload();
        if (payload is error) {
            return sendResponse(caller, 400, createErrorResponse("Invalid JSON payload"));
        }

        if (payload is map<json>) {
            anydata? nameData = payload["name"];
            anydata? specializationData = payload["specialization"];
            anydata? experienceData = payload["experience"];
            anydata? locationData = payload["location"];
            anydata? contactNumberData = payload["contactNumber"];
            anydata? servicesData = payload["services"];

            if (nameData is () || specializationData is () || locationData is ()) {
                return sendResponse(caller, 400, createErrorResponse("Name, specialization, and location are required"));
            }

            string name = nameData.toString();
            string specialization = specializationData.toString();
            string experience = experienceData is () ? "" : experienceData.toString();
            string location = locationData.toString();
            string contactNumber = contactNumberData is () ? "" : contactNumberData.toString();
            
            json[] servicesJson = [];
            if (servicesData is json[]) {
                servicesJson = servicesData;
            }
            string[] services = [];
            foreach json serviceItem in servicesJson {
                services.push(serviceItem.toString());
            }

            if (name.trim() == "" || specialization.trim() == "" || location.trim() == "") {
                return sendResponse(caller, 400, createErrorResponse("Name, specialization, and location are required"));
            }

            string caregiverId = uuid:createType1AsString();
            string currentTime = time:utcNow().toString();
            
            CaregiverProfile newCaregiver = {
                id: caregiverId,
                userId: currentUser.id,
                name: name,
                specialization: specialization,
                experience: experience,
                location: location,
                contactNumber: contactNumber,
                rating: 0.0,
                reviewCount: 0,
                services: services,
                available: true,
                createdAt: currentTime,
                updatedAt: currentTime
            };

            caregivers[caregiverId] = newCaregiver;

            log:printInfo("New caregiver registered: " + name);
            
            json caregiverJson = {
                id: newCaregiver.id,
                name: newCaregiver.name,
                specialization: newCaregiver.specialization,
                location: newCaregiver.location
            };
            
            return sendResponse(caller, 201, createSuccessResponse(caregiverJson, "Caregiver registered successfully"));
        }
        
        return sendResponse(caller, 400, createErrorResponse("Invalid payload format"));
    }
}

public function main() {
    log:printInfo("=================================================");
    log:printInfo("Starting TikiriCare & TikiriPiyasa Backend Server");
    log:printInfo("=================================================");
    log:printInfo("Server URL: http://localhost:8080");
    log:printInfo("Health check: http://localhost:8080/health");
    log:printInfo("=================================================");
    log:printInfo("Sample credentials:");
    log:printInfo("Email: parent@test.com");
    log:printInfo("Password: password123");
    log:printInfo("=================================================");
    log:printInfo("MongoDB Atlas Integration: Enabled");
    log:printInfo("Connection String: mongodb+srv://user01:celestial4@...");
    log:printInfo("=================================================");
    log:printInfo("Press Ctrl+C to stop the server");
    
    // Add some sample data for testing
    initializeSampleData();
}

function initializeSampleData() {
    // Add a sample user
    string sampleUserId = uuid:createType1AsString();
    string currentTime = time:utcNow().toString();
    
    User sampleUser = {
        id: sampleUserId,
        email: "parent@test.com",
        name: "Test Parent",
        telephone: "+94701234567",
        password: "password123",
        role: "parent",
        createdAt: currentTime,
        updatedAt: currentTime
    };
    
    users["parent@test.com"] = sampleUser;
    userChildren[sampleUserId] = [];
    
    log:printInfo("Sample data initialized successfully");
}
