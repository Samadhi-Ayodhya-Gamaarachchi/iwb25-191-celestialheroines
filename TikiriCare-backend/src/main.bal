import ballerina/http;
import ballerina/jwt;
import ballerina/time;
import ballerina/log;
import ballerina/uuid;
import ballerina/runtime;

// Import types and MongoDB service
import types;
import mongodb_service;

// JWT configuration
final string JWT_SECRET = "tikiricare-super-secret-key-2024";
final string JWT_ISSUER = "tikiricare-auth-service";

// Main function to keep the service running
public function main() {
    log:printInfo("Starting TikiriCare Backend...");
    log:printInfo("Server will be available at http://localhost:8080");
    log:printInfo("Press Ctrl+C to stop the server");
    
    // Keep the main thread alive
    while (true) {
        runtime:sleep(1000);
    }
}

// Main service
service / on new http:Listener(8080) {
    
    // Health check endpoint
    resource function get health() returns http:Response {
        http:Response res = new;
        res.statusCode = 200;
        res.setJsonPayload({
            "status": "healthy",
            "message": "TikiriCare Backend is running with MongoDB",
            "timestamp": time:utcNow().toString()
        });
        return res;
    }

    // User registration
    resource function post auth/register(http:Request req) returns http:Response|error {
        json|error payload = req.getJsonPayload();
        if (payload is error) {
            return createErrorResponse(400, "Invalid JSON payload");
        }

        RegisterRequest|error regReq = payload.cloneWithType(RegisterRequest);
        if (regReq is error) {
            return createErrorResponse(400, "Invalid registration data format");
        }

        // Validate required fields
        if (regReq.name.trim() == "" || regReq.email.trim() == "" || 
            regReq.password.trim() == "" || regReq.telephone.trim() == "") {
            return createErrorResponse(400, "All fields are required");
        }

        // Check if user already exists
        User? existingUser = mongodb_service::findUserByEmail(regReq.email);
        if (existingUser != ()) {
            return createErrorResponse(409, "User with this email already exists");
        }

        // Create new user
        string userId = uuid:createType1AsString();
        string currentTime = time:utcNow().toString();
        
        User newUser = {
            id: userId,
            email: regReq.email,
            name: regReq.name,
            telephone: regReq.telephone,
            password: regReq.password,
            role: "parent",
            createdAt: currentTime,
            updatedAt: currentTime
        };

        // Save to MongoDB
        error? saveResult = mongodb_service::createUser(newUser);
        if (saveResult is error) {
            log:printError("Failed to save user: " + saveResult.message());
            return createErrorResponse(500, "Failed to create user");
        }

        log:printInfo("New user registered: " + regReq.email);

        ApiResponse<User> response = {
            success: true,
            message: "User registered successfully",
            data: newUser
        };

        http:Response res = new;
        res.statusCode = 201;
        res.setJsonPayload(response);
        return res;
    }

    // User login
    resource function post auth/login(http:Request req) returns http:Response|error {
        json|error payload = req.getJsonPayload();
        if (payload is error) {
            return createErrorResponse(400, "Invalid JSON payload");
        }

        LoginRequest|error loginReq = payload.cloneWithType(LoginRequest);
        if (loginReq is error) {
            return createErrorResponse(400, "Invalid login data format");
        }

        // Find user in MongoDB
        User? user = mongodb_service::findUserByEmail(loginReq.email);
        if (user is ()) {
            return createErrorResponse(401, "Invalid email or password");
        }
        
        // Check password
        if (user.password != loginReq.password) {
            return createErrorResponse(401, "Invalid email or password");
        }

        // Generate JWT token
        decimal currentTime = <decimal>time:utcNow()[0];
        
        jwt:IssuerConfig issuerConfig = {
            issuer: JWT_ISSUER,
            username: user.email,
            expTime: currentTime + 86400, // 24 hours
            signatureConfig: {
                algorithm: jwt:HS256,
                config: JWT_SECRET
            }
        };

        var tokenResult = jwt:issue(issuerConfig);
        if (tokenResult is error) {
            log:printError("Token generation failed: " + tokenResult.message());
            return createErrorResponse(500, "Authentication failed");
        }

        // Create auth response
        map<string> authResponse = {
            "token": tokenResult,
            "user": user,
            "message": "Login successful"
        };

        ApiResponse<map<string>> response = {
            success: true,
            message: "Login successful",
            data: authResponse
        };

        log:printInfo("User logged in: " + loginReq.email);

        http:Response res = new;
        res.statusCode = 200;
        res.setJsonPayload(response);
        return res;
    }

    // Get user profile
    resource function get auth/profile(http:Request req) returns http:Response|error {
        string? currentUserId = getCurrentUserId(req);
        if (currentUserId is ()) {
            return createErrorResponse(401, "Unauthorized");
        }

        // Find user in MongoDB
        User? user = mongodb_service::findUserByEmail(currentUserId);
        if (user is ()) {
            return createErrorResponse(404, "User not found");
        }

        ApiResponse<User> response = {
            success: true,
            message: "Profile retrieved successfully",
            data: user
        };

        http:Response res = new;
        res.statusCode = 200;
        res.setJsonPayload(response);
        return res;
    }

    // Update user profile
    resource function put auth/profile(http:Request req) returns http:Response|error {
        string? currentUserId = getCurrentUserId(req);
        if (currentUserId is ()) {
            return createErrorResponse(401, "Unauthorized");
        }

        json|error payload = req.getJsonPayload();
        if (payload is error) {
            return createErrorResponse(400, "Invalid JSON payload");
        }

        // Find user in MongoDB
        User? user = mongodb_service::findUserByEmail(currentUserId);
        if (user is ()) {
            return createErrorResponse(404, "User not found");
        }

        // Prepare updates
        map<string> updates = {};
        if (payload is map<json>) {
            if (payload.hasKey("name") && payload["name"] is string) {
                updates["name"] = <string>payload["name"];
            }
            if (payload.hasKey("telephone") && payload["telephone"] is string) {
                updates["telephone"] = <string>payload["telephone"];
            }
            updates["updatedAt"] = time:utcNow().toString();
        }

        // Update in MongoDB
        error? updateResult = mongodb_service::updateUser(user.id, updates);
        if (updateResult is error) {
            log:printError("Failed to update user: " + updateResult.message());
            return createErrorResponse(500, "Failed to update profile");
        }

        // Get updated user
        User? updatedUser = mongodb_service::findUserByEmail(currentUserId);
        if (updatedUser is ()) {
            return createErrorResponse(404, "User not found after update");
        }

        ApiResponse<User> response = {
            success: true,
            message: "Profile updated successfully",
            data: updatedUser
        };

        http:Response res = new;
        res.statusCode = 200;
        res.setJsonPayload(response);
        return res;
    }

    // Create a new child
    resource function post api/children(http:Request req) returns http:Response|error {
        string? currentUserId = getCurrentUserId(req);
        if (currentUserId is ()) {
            return createErrorResponse(401, "Unauthorized");
        }

        json|error payload = req.getJsonPayload();
        if (payload is error) {
            return createErrorResponse(400, "Invalid JSON payload");
        }

        CreateChildRequest|error createReq = payload.cloneWithType(CreateChildRequest);
        if (createReq is error) {
            return createErrorResponse(400, "Invalid child data format");
        }

        // Validate required fields
        if (createReq.name.trim() == "" || createReq.gender.trim() == "" || 
            createReq.dateOfBirth.trim() == "") {
            return createErrorResponse(400, "Name, gender, and date of birth are required");
        }

        // Validate gender
        if (createReq.gender != "male" && createReq.gender != "female") {
            return createErrorResponse(400, "Gender must be 'male' or 'female'");
        }

        // Create new child
        string childId = uuid:createType1AsString();
        string currentTime = time:utcNow().toString();
        
        Child newChild = {
            id: childId,
            parentId: currentUserId,
            name: createReq.name,
            gender: createReq.gender,
            dateOfBirth: createReq.dateOfBirth,
            ageInMonths: 0, // Will be calculated
            height: createReq.height ?: 0.0,
            weight: createReq.weight ?: 0.0,
            bmi: 0.0,
            lastCheckup: "",
            developmentScore: 0,
            createdAt: currentTime,
            updatedAt: currentTime
        };

        // Calculate BMI if height and weight are provided
        if (createReq.height != () && createReq.weight != ()) {
            newChild.bmi = calculateBMI(createReq.height, createReq.weight);
        }

        // Save to MongoDB
        error? saveResult = mongodb_service::createChild(newChild);
        if (saveResult is error) {
            log:printError("Failed to save child: " + saveResult.message());
            return createErrorResponse(500, "Failed to create child");
        }

        log:printInfo("New child created: " + newChild.name);

        ApiResponse<Child> response = {
            success: true,
            message: "Child created successfully",
            data: newChild
        };

        http:Response res = new;
        res.statusCode = 201;
        res.setJsonPayload(response);
        return res;
    }

    // Get all children for current user
    resource function get api/children(http:Request req) returns http:Response|error {
        string? currentUserId = getCurrentUserId(req);
        if (currentUserId is ()) {
            return createErrorResponse(401, "Unauthorized");
        }

        // Get children from MongoDB
        Child[] children = mongodb_service::findChildrenByParentId(currentUserId);

        ApiResponse<Child[]> response = {
            success: true,
            message: "Children retrieved successfully",
            data: children
        };

        http:Response res = new;
        res.statusCode = 200;
        res.setJsonPayload(response);
        return res;
    }

    // Get a specific child by ID
    resource function get api/children/[string childId](http:Request req) returns http:Response|error {
        string? currentUserId = getCurrentUserId(req);
        if (currentUserId is ()) {
            return createErrorResponse(401, "Unauthorized");
        }

        // Get child from MongoDB
        Child? child = mongodb_service::findChildById(childId);
        if (child is ()) {
            return createErrorResponse(404, "Child not found");
        }

        // Check if child belongs to current user
        if (child.parentId != currentUserId) {
            return createErrorResponse(403, "Access denied");
        }

        ApiResponse<Child> response = {
            success: true,
            message: "Child retrieved successfully",
            data: child
        };

        http:Response res = new;
        res.statusCode = 200;
        res.setJsonPayload(response);
        return res;
    }

    // Update a child
    resource function put api/children/[string childId](http:Request req) returns http:Response|error {
        string? currentUserId = getCurrentUserId(req);
        if (currentUserId is ()) {
            return createErrorResponse(401, "Unauthorized");
        }

        // Check if child exists and belongs to current user
        Child? child = mongodb_service::findChildById(childId);
        if (child is ()) {
            return createErrorResponse(404, "Child not found");
        }

        if (child.parentId != currentUserId) {
            return createErrorResponse(403, "Access denied");
        }

        json|error payload = req.getJsonPayload();
        if (payload is error) {
            return createErrorResponse(400, "Invalid JSON payload");
        }

        UpdateChildRequest|error updateReq = payload.cloneWithType(UpdateChildRequest);
        if (updateReq is error) {
            return createErrorResponse(400, "Invalid update data format");
        }

        // Prepare updates
        map<string> updates = {};
        if (updateReq.name != ()) {
            updates["name"] = updateReq.name;
        }
        if (updateReq.gender != ()) {
            updates["gender"] = updateReq.gender;
        }
        if (updateReq.height != ()) {
            updates["height"] = updateReq.height;
        }
        if (updateReq.weight != ()) {
            updates["weight"] = updateReq.weight;
        }
        if (updateReq.lastCheckup != ()) {
            updates["lastCheckup"] = updateReq.lastCheckup;
        }
        if (updateReq.developmentScore != ()) {
            updates["developmentScore"] = updateReq.developmentScore;
        }

        // Recalculate BMI if height or weight changed
        if (updateReq.height != () || updateReq.weight != ()) {
            decimal newHeight = updateReq.height ?: child.height;
            decimal newWeight = updateReq.weight ?: child.weight;
            updates["bmi"] = calculateBMI(newHeight, newWeight);
        }

        updates["updatedAt"] = time:utcNow().toString();

        // Update in MongoDB
        error? updateResult = mongodb_service::updateChild(childId, updates);
        if (updateResult is error) {
            log:printError("Failed to update child: " + updateResult.message());
            return createErrorResponse(500, "Failed to update child");
        }

        // Get updated child
        Child? updatedChild = mongodb_service::findChildById(childId);
        if (updatedChild is ()) {
            return createErrorResponse(404, "Child not found after update");
        }

        ApiResponse<Child> response = {
            success: true,
            message: "Child updated successfully",
            data: updatedChild
        };

        http:Response res = new;
        res.statusCode = 200;
        res.setJsonPayload(response);
        return res;
    }

    // Delete a child
    resource function delete api/children/[string childId](http:Request req) returns http:Response|error {
        string? currentUserId = getCurrentUserId(req);
        if (currentUserId is ()) {
            return createErrorResponse(401, "Unauthorized");
        }

        // Check if child exists and belongs to current user
        Child? child = mongodb_service::findChildById(childId);
        if (child is ()) {
            return createErrorResponse(404, "Child not found");
        }

        if (child.parentId != currentUserId) {
            return createErrorResponse(403, "Access denied");
        }

        // Delete from MongoDB
        error? deleteResult = mongodb_service::deleteChild(childId);
        if (deleteResult is error) {
            log:printError("Failed to delete child: " + deleteResult.message());
            return createErrorResponse(500, "Failed to delete child");
        }

        ApiResponse<()> response = {
            success: true,
            message: "Child deleted successfully"
        };

        http:Response res = new;
        res.statusCode = 200;
        res.setJsonPayload(response);
        return res;
    }

    // ===== VACCINE ENDPOINTS =====

    // Get vaccine schedule for a child
    resource function get api/vaccines/schedule/[string childId](http:Request req) returns http:Response|error {
        string? currentUserId = getCurrentUserId(req);
        if (currentUserId is ()) {
            return createErrorResponse(401, "Unauthorized");
        }

        // Check if child exists and belongs to current user
        Child? child = mongodb_service::findChildById(childId);
        if (child is ()) {
            return createErrorResponse(404, "Child not found");
        }

        if (child.parentId != currentUserId) {
            return createErrorResponse(403, "Access denied");
        }

        // Get vaccine schedule from constants
        VaccineSchedule[] schedule = getVaccineScheduleForChild(child.dateOfBirth);
        
        // Get existing vaccines for this child
        Vaccine[] existingVaccines = mongodb_service::findVaccinesByChildId(childId);

        // Create response with schedule and existing vaccines
        map<string> responseData = {
            "schedule": schedule,
            "existingVaccines": existingVaccines,
            "childAge": child.ageInMonths
        };

        ApiResponse<map<string>> response = {
            success: true,
            message: "Vaccine schedule retrieved successfully",
            data: responseData
        };

        http:Response res = new;
        res.statusCode = 200;
        res.setJsonPayload(response);
        return res;
    }

    // Initialize vaccine schedule for a new child
    resource function post api/vaccines/initialize/[string childId](http:Request req) returns http:Response|error {
        string? currentUserId = getCurrentUserId(req);
        if (currentUserId is ()) {
            return createErrorResponse(401, "Unauthorized");
        }

        // Check if child exists and belongs to current user
        Child? child = mongodb_service::findChildById(childId);
        if (child is ()) {
            return createErrorResponse(404, "Child not found");
        }

        if (child.parentId != currentUserId) {
            return createErrorResponse(403, "Access denied");
        }

        // Get vaccine schedule for this child
        VaccineSchedule[] schedule = getVaccineScheduleForChild(child.dateOfBirth);
        
        // Create vaccine records
        Vaccine[] createdVaccines = [];

        foreach VaccineSchedule vaccineSchedule in schedule {
            string vaccineId = uuid:createType1AsString();
            string dueDate = getVaccineDueDate(child.dateOfBirth, vaccineSchedule.age);
            
            Vaccine vaccine = {
                id: vaccineId,
                childId: childId,
                name: vaccineSchedule.vaccine,
                age: vaccineSchedule.age,
                dueDate: dueDate,
                status: "upcoming",
                createdAt: time:utcNow().toString(),
                updatedAt: time:utcNow().toString()
            };

            // Save to MongoDB
            error? saveResult = mongodb_service::createVaccine(vaccine);
            if (saveResult is error) {
                log:printError("Failed to save vaccine: " + saveResult.message());
                continue;
            }

            createdVaccines.push(vaccine);
        }

        log:printInfo("Vaccine schedule initialized for child: " + child.name);

        ApiResponse<Vaccine[]> response = {
            success: true,
            message: "Vaccine schedule initialized successfully",
            data: createdVaccines
        };

        http:Response res = new;
        res.statusCode = 201;
        res.setJsonPayload(response);
        return res;
    }

    // Mark a vaccine as completed
    resource function put api/vaccines/[string vaccineId]/complete(http:Request req) returns http:Response|error {
        string? currentUserId = getCurrentUserId(req);
        if (currentUserId is ()) {
            return createErrorResponse(401, "Unauthorized");
        }

        // Find vaccine
        Vaccine[] vaccines = mongodb_service::findVaccinesByChildId("");
        Vaccine? vaccine = ();
        foreach Vaccine v in vaccines {
            if (v.id == vaccineId) {
                vaccine = v;
                break;
            }
        }

        if (vaccine is ()) {
            return createErrorResponse(404, "Vaccine not found");
        }
        
        // Check if child belongs to current user
        Child? child = mongodb_service::findChildById(vaccine.childId);
        if (child is ()) {
            return createErrorResponse(404, "Child not found");
        }

        if (child.parentId != currentUserId) {
            return createErrorResponse(403, "Access denied");
        }

        json|error payload = req.getJsonPayload();
        if (payload is error) {
            return createErrorResponse(400, "Invalid JSON payload");
        }

        UpdateVaccineStatusRequest|error updateReq = payload.cloneWithType(UpdateVaccineStatusRequest);
        if (updateReq is error) {
            return createErrorResponse(400, "Invalid update data format");
        }

        // Prepare updates
        map<string> updates = {};
        updates["status"] = updateReq.status;
        updates["completedDate"] = updateReq.completedDate ?: time:utcNow().toString();
        if (updateReq.remarks != ()) {
            updates["remarks"] = updateReq.remarks;
        }
        updates["updatedAt"] = time:utcNow().toString();

        // Update in MongoDB
        error? updateResult = mongodb_service::updateVaccine(vaccineId, updates);
        if (updateResult is error) {
            log:printError("Failed to update vaccine: " + updateResult.message());
            return createErrorResponse(500, "Failed to update vaccine");
        }

        log:printInfo("Vaccine marked as completed: " + vaccine.name + " for child: " + child.name);

        ApiResponse<()> response = {
            success: true,
            message: "Vaccine status updated successfully"
        };

        http:Response res = new;
        res.statusCode = 200;
        res.setJsonPayload(response);
        return res;
    }

    // ===== HEALTH ENDPOINTS =====

    // Add growth record
    resource function post api/health/growth(http:Request req) returns http:Response|error {
        string? currentUserId = getCurrentUserId(req);
        if (currentUserId is ()) {
            return createErrorResponse(401, "Unauthorized");
        }

        json|error payload = req.getJsonPayload();
        if (payload is error) {
            return createErrorResponse(400, "Invalid JSON payload");
        }

        CreateGrowthRecordRequest|error createReq = payload.cloneWithType(CreateGrowthRecordRequest);
        if (createReq is error) {
            return createErrorResponse(400, "Invalid growth data format");
        }

        // Validate required fields
        if (createReq.height <= 0 || createReq.weight <= 0) {
            return createErrorResponse(400, "Height and weight must be positive values");
        }

        // Check if child exists and belongs to current user
        Child? child = mongodb_service::findChildById(createReq.childId);
        if (child is ()) {
            return createErrorResponse(404, "Child not found");
        }

        if (child.parentId != currentUserId) {
            return createErrorResponse(403, "Access denied");
        }

        // Calculate BMI
        decimal bmi = calculateBMI(createReq.height, createReq.weight);

        // Create growth record
        string recordId = uuid:createType1AsString();
        string currentTime = time:utcNow().toString();
        
        GrowthRecord growthRecord = {
            id: recordId,
            childId: createReq.childId,
            height: createReq.height,
            weight: createReq.weight,
            bmi: bmi,
            recordedDate: createReq.recordedDate,
            createdAt: currentTime
        };

        // Save to MongoDB
        error? saveResult = mongodb_service::createGrowthRecord(growthRecord);
        if (saveResult is error) {
            log:printError("Failed to save growth record: " + saveResult.message());
            return createErrorResponse(500, "Failed to add growth record");
        }

        // Update child's latest measurements
        map<string> childUpdates = {
            "height": createReq.height,
            "weight": createReq.weight,
            "bmi": bmi,
            "updatedAt": currentTime
        };

        error? updateResult = mongodb_service::updateChild(createReq.childId, childUpdates);
        if (updateResult is error) {
            log:printError("Failed to update child measurements: " + updateResult.message());
        }

        log:printInfo("Growth record added for child: " + child.name);

        ApiResponse<GrowthRecord> response = {
            success: true,
            message: "Growth record added successfully",
            data: growthRecord
        };

        http:Response res = new;
        res.statusCode = 201;
        res.setJsonPayload(response);
        return res;
    }

    // Get growth history for a child
    resource function get api/health/growth/[string childId](http:Request req) returns http:Response|error {
        string? currentUserId = getCurrentUserId(req);
        if (currentUserId is ()) {
            return createErrorResponse(401, "Unauthorized");
        }

        // Check if child exists and belongs to current user
        Child? child = mongodb_service::findChildById(childId);
        if (child is ()) {
            return createErrorResponse(404, "Child not found");
        }

        if (child.parentId != currentUserId) {
            return createErrorResponse(403, "Access denied");
        }

        // Get growth records from MongoDB
        GrowthRecord[] growthRecords = mongodb_service::findGrowthRecordsByChildId(childId);

        // Sort by recorded date (newest first)
        growthRecords.sort((a, b) => time:parse(b.recordedDate, "yyyy-MM-dd").compare(time:parse(a.recordedDate, "yyyy-MM-dd")));

        ApiResponse<GrowthRecord[]> response = {
            success: true,
            message: "Growth records retrieved successfully",
            data: growthRecords
        };

        http:Response res = new;
        res.statusCode = 200;
        res.setJsonPayload(response);
        return res;
    }

    // Add medical record
    resource function post api/health/medical(http:Request req) returns http:Response|error {
        string? currentUserId = getCurrentUserId(req);
        if (currentUserId is ()) {
            return createErrorResponse(401, "Unauthorized");
        }

        json|error payload = req.getJsonPayload();
        if (payload is error) {
            return createErrorResponse(400, "Invalid JSON payload");
        }

        CreateMedicalRecordRequest|error createReq = payload.cloneWithType(CreateMedicalRecordRequest);
        if (createReq is error) {
            return createErrorResponse(400, "Invalid medical record data format");
        }

        // Validate required fields
        if (createReq.type.trim() == "" || createReq.description.trim() == "" || 
            createReq.date.trim() == "") {
            return createErrorResponse(400, "Type, description, and date are required");
        }

        // Check if child exists and belongs to current user
        Child? child = mongodb_service::findChildById(createReq.childId);
        if (child is ()) {
            return createErrorResponse(404, "Child not found");
        }

        if (child.parentId != currentUserId) {
            return createErrorResponse(403, "Access denied");
        }

        // Create medical record
        string recordId = uuid:createType1AsString();
        string currentTime = time:utcNow().toString();
        
        MedicalRecord medicalRecord = {
            id: recordId,
            childId: createReq.childId,
            type: createReq.type,
            description: createReq.description,
            date: createReq.date,
            doctor: createReq.doctor,
            hospital: createReq.hospital,
            createdAt: currentTime
        };

        // Save to MongoDB
        error? saveResult = mongodb_service::createMedicalRecord(medicalRecord);
        if (saveResult is error) {
            log:printError("Failed to save medical record: " + saveResult.message());
            return createErrorResponse(500, "Failed to add medical record");
        }

        log:printInfo("Medical record added for child: " + child.name);

        ApiResponse<MedicalRecord> response = {
            success: true,
            message: "Medical record added successfully",
            data: medicalRecord
        };

        http:Response res = new;
        res.statusCode = 201;
        res.setJsonPayload(response);
        return res;
    }

    // Get medical records for a child
    resource function get api/health/medical/[string childId](http:Request req) returns http:Response|error {
        string? currentUserId = getCurrentUserId(req);
        if (currentUserId is ()) {
            return createErrorResponse(401, "Unauthorized");
        }

        // Check if child exists and belongs to current user
        Child? child = mongodb_service::findChildById(childId);
        if (child is ()) {
            return createErrorResponse(404, "Child not found");
        }

        if (child.parentId != currentUserId) {
            return createErrorResponse(403, "Access denied");
        }

        // Get medical records from MongoDB
        MedicalRecord[] medicalRecords = mongodb_service::findMedicalRecordsByChildId(childId);

        // Sort by date (newest first)
        medicalRecords.sort((a, b) => time:parse(b.date, "yyyy-MM-dd").compare(time:parse(a.date, "yyyy-MM-dd")));

        ApiResponse<MedicalRecord[]> response = {
            success: true,
            message: "Medical records retrieved successfully",
            data: medicalRecords
        };

        http:Response res = new;
        res.statusCode = 200;
        res.setJsonPayload(response);
        return res;
    }
}

// Helper functions
function createErrorResponse(int statusCode, string message) returns http:Response {
    ApiResponse<()> errorResponse = {
        success: false,
        message: message
    };

    http:Response res = new;
    res.statusCode = statusCode;
    res.setJsonPayload(errorResponse);
    return res;
}

function getCurrentUserId(http:Request req) returns string? {
    string|error authHeader = req.getHeader("Authorization");
    if (authHeader is error || !authHeader.startsWith("Bearer ")) {
        return ();
    }

    string jwtToken = authHeader.substring(7);
    
    jwt:ValidatorConfig validatorConfig = {
        issuer: JWT_ISSUER,
        clockSkew: 60,
        signatureConfig: {
            secret: JWT_SECRET
        }
    };

    jwt:Payload|error verified = jwt:validate(jwtToken, validatorConfig);
    if (verified is error) {
        return ();
    }

    anydata? usernameValue = verified["sub"];
    if (usernameValue is string) {
        return usernameValue;
    }

    return ();
}

function calculateBMI(decimal height, decimal weight) returns decimal {
    if (height <= 0) {
        return 0.0;
    }
    
    // Height in meters, weight in kg
    decimal heightInMeters = height / 100; // Assuming height is in cm
    return weight / (heightInMeters * heightInMeters);
}

// Sri Lanka National Immunization Schedule Constants
public const VaccineSchedule[] SRI_LANKA_VACCINE_SCHEDULE = [
    // FIRST YEAR OF LIFE
    {
        age: "0-4 weeks",
        vaccine: "BCG",
        remarks: "Before leaving hospital, preferably within 24 hours of birth. If a scar is not present 2nd dose could be offered after 6 months, up to 5 years."
    },
    {
        age: "2 months",
        vaccine: "Penta (D,T,P,HepB & Hib) + OPV (1st dose)",
        remarks: "For a defaulter or for an un-immunized child minimum 6-8 weeks gap between doses is adequate."
    },
    {
        age: "4 months",
        vaccine: "Penta (D,T,P,HepB & Hib) + OPV (2nd dose)",
        remarks: "For a defaulter or for an un-immunized child minimum 6-8 weeks gap between doses is adequate."
    },
    {
        age: "6 months",
        vaccine: "Penta (D,T,P,HepB & Hib) + OPV (3rd dose)",
        remarks: "For a defaulter or for an un-immunized child minimum 6-8 weeks gap between doses is adequate."
    },
    {
        age: "9 months",
        vaccine: "Live JE Vaccine",
        remarks: "On completion of 9 months."
    },
    
    // SECOND YEAR OF LIFE
    {
        age: "12 months",
        vaccine: "MMR (1st Dose)",
        remarks: "On completion of 1 year."
    },
    {
        age: "18 months",
        vaccine: "DTP + OPV (4th dose)",
        remarks: "On completion of 18 Months."
    },
    
    // PRE SCHOOL AGE
    {
        age: "3 years",
        vaccine: "MMR (2nd Dose)",
        remarks: "On completion of 3 years."
    },
    
    // SCHOOL GOING AGE
    {
        age: "5 years",
        vaccine: "DT + OPV (5th Dose)",
        remarks: "On completion of 5 years."
    }
];

// Age in months mapping for easier calculations
public const map<string> AGE_IN_MONTHS = {
    "0-4 weeks": "0",
    "2 months": "2",
    "4 months": "4",
    "6 months": "6",
    "9 months": "9",
    "12 months": "12",
    "18 months": "18",
    "3 years": "36",
    "5 years": "60"
};

// Function to get vaccine schedule for a child based on birth date
public function getVaccineScheduleForChild(string dateOfBirth) returns VaccineSchedule[] {
    time:Time birthDate = time:parse(dateOfBirth, "yyyy-MM-dd");
    time:Time currentDate = time:utcNow();
    
    // Calculate age in months
    int ageInMonths = calculateAgeInMonths(birthDate, currentDate);
    
    // Filter vaccines that are due or upcoming
    VaccineSchedule[] relevantVaccines = [];
    
    foreach VaccineSchedule vaccine in SRI_LANKA_VACCINE_SCHEDULE {
        int vaccineAge = <int>AGE_IN_MONTHS[vaccine.age];
        if (vaccineAge > ageInMonths) {
            relevantVaccines.push(vaccine);
        }
    }
    
    return relevantVaccines;
}

// Function to calculate age in months
public function calculateAgeInMonths(time:Time birthDate, time:Time currentDate) returns int {
    int birthYear = birthDate.year;
    int birthMonth = birthDate.month;
    int currentYear = currentDate.year;
    int currentMonth = currentDate.month;
    
    int ageInMonths = (currentYear - birthYear) * 12 + (currentMonth - birthMonth);
    
    // Adjust for day of month
    if (currentDate.day < birthDate.day) {
        ageInMonths = ageInMonths - 1;
    }
    
    return ageInMonths < 0 ? 0 : ageInMonths;
}

// Function to get due date for a vaccine
public function getVaccineDueDate(string dateOfBirth, string age) returns string {
    time:Time birthDate = time:parse(dateOfBirth, "yyyy-MM-dd");
    int monthsToAdd = <int>AGE_IN_MONTHS[age];
    
    time:Time dueDate = time:addDuration(birthDate, monthsToAdd, "MONTH");
    return time:format(dueDate, "yyyy-MM-dd");
} 