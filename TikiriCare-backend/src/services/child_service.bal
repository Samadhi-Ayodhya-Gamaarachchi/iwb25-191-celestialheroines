import ballerina/http;
import ballerina/time;
import ballerina/log;
import ballerina/uuid;

// Import types and constants
import types;
import utils;
import vaccine_schedule;

// In-memory child store (in production, use a database)
map<Child> childStore = {};
map<string[]> userChildrenMap = {}; // Maps user ID to child IDs

service class child_service {
    // Create a new child
    resource function post .(http:Request req) returns http:Response|error {
        // Extract user from JWT token
        string? currentUserId = utils::getCurrentUserId(req, utils::JWT_SECRET, utils::JWT_ISSUER);
        if (currentUserId is ()) {
            return utils::createErrorResponse(401, "Unauthorized");
        }

        json|error payload = req.getJsonPayload();
        if (payload is error) {
            return utils::createErrorResponse(400, "Invalid JSON payload");
        }

        CreateChildRequest|error createReq = payload.cloneWithType(CreateChildRequest);
        if (createReq is error) {
            return utils::createErrorResponse(400, "Invalid child data format");
        }

        // Validate required fields
        if (createReq.name.trim() == "" || createReq.gender.trim() == "" || 
            createReq.dateOfBirth.trim() == "") {
            return utils::createErrorResponse(400, "Name, gender, and date of birth are required");
        }

        // Validate gender
        if (createReq.gender != "male" && createReq.gender != "female") {
            return utils::createErrorResponse(400, "Gender must be 'male' or 'female'");
        }

        // Validate date format and calculate age
        time:Time|error birthDate = time:parse(createReq.dateOfBirth, "yyyy-MM-dd");
        if (birthDate is error) {
            return utils::createErrorResponse(400, "Invalid date format. Use yyyy-MM-dd");
        }

        // Calculate age in months
        int ageInMonths = vaccine_schedule::calculateAgeInMonths(birthDate, time:utcNow());

        // Create new child
        string childId = uuid:createType1AsString();
        string currentTime = time:utcNow().toString();
        
        Child newChild = {
            id: childId,
            parentId: currentUserId,
            name: createReq.name,
            gender: createReq.gender,
            dateOfBirth: createReq.dateOfBirth,
            ageInMonths: ageInMonths,
            height: createReq.height ?: 0.0,
            weight: createReq.weight ?: 0.0,
            bmi: 0.0, // Will be calculated
            lastCheckup: "",
            developmentScore: 0,
            createdAt: currentTime,
            updatedAt: currentTime
        };

        // Calculate BMI if height and weight are provided
        if (createReq.height != () && createReq.weight != ()) {
            newChild.bmi = calculateBMI(createReq.height, createReq.weight);
        }

        // Store child
        childStore[childId] = newChild;

        // Update user-children mapping
        if (!userChildrenMap.hasKey(currentUserId)) {
            userChildrenMap[currentUserId] = [];
        }
        userChildrenMap[currentUserId].push(childId);

        log:printInfo("New child created: " + newChild.name + " for user: " + currentUserId);

        // Return success response
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
    resource function get .(http:Request req) returns http:Response|error {
        // Extract user from JWT token
        string? currentUserId = utils::getCurrentUserId(req, utils::JWT_SECRET, utils::JWT_ISSUER);
        if (currentUserId is ()) {
            return utils::createErrorResponse(401, "Unauthorized");
        }

        // Get children IDs for current user
        string[] childIds = userChildrenMap[currentUserId] ?: [];
        Child[] children = [];

        // Get child details
        foreach string childId in childIds {
            if (childStore.hasKey(childId)) {
                children.push(childStore[childId]);
            }
        }

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
    resource function get [string childId](http:Request req) returns http:Response|error {
        // Extract user from JWT token
        string? currentUserId = utils::getCurrentUserId(req, utils::JWT_SECRET, utils::JWT_ISSUER);
        if (currentUserId is ()) {
            return utils::createErrorResponse(401, "Unauthorized");
        }

        // Check if child exists and belongs to current user
        if (!childStore.hasKey(childId)) {
            return utils::createErrorResponse(404, "Child not found");
        }

        Child child = childStore[childId];
        if (child.parentId != currentUserId) {
            return utils::createErrorResponse(403, "Access denied");
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
    resource function put [string childId](http:Request req) returns http:Response|error {
        // Extract user from JWT token
        string? currentUserId = utils::getCurrentUserId(req, utils::JWT_SECRET, utils::JWT_ISSUER);
        if (currentUserId is ()) {
            return utils::createErrorResponse(401, "Unauthorized");
        }

        // Check if child exists and belongs to current user
        if (!childStore.hasKey(childId)) {
            return utils::createErrorResponse(404, "Child not found");
        }

        Child child = childStore[childId];
        if (child.parentId != currentUserId) {
            return utils::createErrorResponse(403, "Access denied");
        }

        json|error payload = req.getJsonPayload();
        if (payload is error) {
            return utils::createErrorResponse(400, "Invalid JSON payload");
        }

        UpdateChildRequest|error updateReq = payload.cloneWithType(UpdateChildRequest);
        if (updateReq is error) {
            return utils::createErrorResponse(400, "Invalid update data format");
        }

        // Update fields
        if (updateReq.name != ()) {
            child.name = updateReq.name;
        }
        if (updateReq.gender != ()) {
            child.gender = updateReq.gender;
        }
        if (updateReq.height != ()) {
            child.height = updateReq.height;
        }
        if (updateReq.weight != ()) {
            child.weight = updateReq.weight;
        }
        if (updateReq.lastCheckup != ()) {
            child.lastCheckup = updateReq.lastCheckup;
        }
        if (updateReq.developmentScore != ()) {
            child.developmentScore = updateReq.developmentScore;
        }

        // Recalculate BMI if height or weight changed
        if (updateReq.height != () || updateReq.weight != ()) {
            child.bmi = calculateBMI(child.height, child.weight);
        }

        // Recalculate age
        time:Time birthDate = time:parse(child.dateOfBirth, "yyyy-MM-dd");
        child.ageInMonths = vaccine_schedule::calculateAgeInMonths(birthDate, time:utcNow());

        child.updatedAt = time:utcNow().toString();

        // Update store
        childStore[childId] = child;

        ApiResponse<Child> response = {
            success: true,
            message: "Child updated successfully",
            data: child
        };

        http:Response res = new;
        res.statusCode = 200;
        res.setJsonPayload(response);
        return res;
    }

    // Delete a child
    resource function delete [string childId](http:Request req) returns http:Response|error {
        // Extract user from JWT token
        string? currentUserId = utils::getCurrentUserId(req, utils::JWT_SECRET, utils::JWT_ISSUER);
        if (currentUserId is ()) {
            return utils::createErrorResponse(401, "Unauthorized");
        }

        // Check if child exists and belongs to current user
        if (!childStore.hasKey(childId)) {
            return utils::createErrorResponse(404, "Child not found");
        }

        Child child = childStore[childId];
        if (child.parentId != currentUserId) {
            return utils::createErrorResponse(403, "Access denied");
        }

        // Remove child from store
        _ = childStore.remove(childId);

        // Remove from user-children mapping
        if (userChildrenMap.hasKey(currentUserId)) {
            string[] childIds = userChildrenMap[currentUserId];
            int index = -1;
            foreach int i in 0..<childIds.length() {
                if (childIds[i] == childId) {
                    index = i;
                    break;
                }
            }
            if (index != -1) {
                childIds.splice(index, 1);
                userChildrenMap[currentUserId] = childIds;
            }
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
}

// Helper function to calculate BMI
function calculateBMI(decimal height, decimal weight) returns decimal {
    if (height <= 0) {
        return 0.0;
    }
    
    // Height in meters, weight in kg
    decimal heightInMeters = height / 100; // Assuming height is in cm
    return weight / (heightInMeters * heightInMeters);
} 