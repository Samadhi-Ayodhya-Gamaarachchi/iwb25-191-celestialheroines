import ballerina/http;
import ballerina/time;
import ballerina/log;
import ballerina/uuid;

// Import types
import types;

// In-memory vaccine store (in production, use a database)
map<Vaccine> vaccineStore = {};
map<string[]> childVaccinesMap = {}; // Maps child ID to vaccine IDs

// Import child store from child service
import child_service;

service class vaccine_service {
    // Get vaccine schedule for a child
    resource function get schedule/[string childId](http:Request req) returns http:Response|error {
        // Extract user from JWT token
        string? currentUserId = utils::getCurrentUserId(req, utils::JWT_SECRET, utils::JWT_ISSUER);
        if (currentUserId is ()) {
            return utils::createErrorResponse(401, "Unauthorized");
        }

        // Check if child exists and belongs to current user
        if (!child_service::childStore.hasKey(childId)) {
            return utils::createErrorResponse(404, "Child not found");
        }

        Child child = child_service::childStore[childId];
        if (child.parentId != currentUserId) {
            return utils::createErrorResponse(403, "Access denied");
        }

        // Get vaccine schedule based on child's age
        VaccineSchedule[] schedule = vaccine_schedule::getVaccineScheduleForChild(child.dateOfBirth);
        
        // Get existing vaccines for this child
        string[] vaccineIds = childVaccinesMap[childId] ?: [];
        Vaccine[] existingVaccines = [];
        
        foreach string vaccineId in vaccineIds {
            if (vaccineStore.hasKey(vaccineId)) {
                existingVaccines.push(vaccineStore[vaccineId]);
            }
        }

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

    // Mark a vaccine as completed
    resource function put [string vaccineId]/complete(http:Request req) returns http:Response|error {
        // Extract user from JWT token
        string? currentUserId = utils::getCurrentUserId(req, utils::JWT_SECRET, utils::JWT_ISSUER);
        if (currentUserId is ()) {
            return utils::createErrorResponse(401, "Unauthorized");
        }

        // Check if vaccine exists
        if (!vaccineStore.hasKey(vaccineId)) {
            return utils::createErrorResponse(404, "Vaccine not found");
        }

        Vaccine vaccine = vaccineStore[vaccineId];
        
        // Check if child belongs to current user
        if (!child_service::childStore.hasKey(vaccine.childId)) {
            return utils::createErrorResponse(404, "Child not found");
        }

        Child child = child_service::childStore[vaccine.childId];
        if (child.parentId != currentUserId) {
            return utils::createErrorResponse(403, "Access denied");
        }

        json|error payload = req.getJsonPayload();
        if (payload is error) {
            return utils::createErrorResponse(400, "Invalid JSON payload");
        }

        UpdateVaccineStatusRequest|error updateReq = payload.cloneWithType(UpdateVaccineStatusRequest);
        if (updateReq is error) {
            return utils::createErrorResponse(400, "Invalid update data format");
        }

        // Update vaccine status
        vaccine.status = updateReq.status;
        vaccine.completedDate = updateReq.completedDate ?: time:utcNow().toString();
        vaccine.remarks = updateReq.remarks;
        vaccine.updatedAt = time:utcNow().toString();

        // Update store
        vaccineStore[vaccineId] = vaccine;

        log:printInfo("Vaccine marked as completed: " + vaccine.name + " for child: " + child.name);

        ApiResponse<Vaccine> response = {
            success: true,
            message: "Vaccine status updated successfully",
            data: vaccine
        };

        http:Response res = new;
        res.statusCode = 200;
        res.setJsonPayload(response);
        return res;
    }

    // Get upcoming vaccines for a child
    resource function get upcoming/[string childId](http:Request req) returns http:Response|error {
        // Extract user from JWT token
        string? currentUserId = utils::getCurrentUserId(req, utils::JWT_SECRET, utils::JWT_ISSUER);
        if (currentUserId is ()) {
            return utils::createErrorResponse(401, "Unauthorized");
        }

        // Check if child exists and belongs to current user
        if (!child_service::childStore.hasKey(childId)) {
            return utils::createErrorResponse(404, "Child not found");
        }

        Child child = child_service::childStore[childId];
        if (child.parentId != currentUserId) {
            return utils::createErrorResponse(403, "Access denied");
        }

        // Get upcoming vaccines
        Vaccine[] upcomingVaccines = [];
        string[] vaccineIds = childVaccinesMap[childId] ?: [];
        
        foreach string vaccineId in vaccineIds {
            if (vaccineStore.hasKey(vaccineId)) {
                Vaccine vaccine = vaccineStore[vaccineId];
                if (vaccine.status == "upcoming" || vaccine.status == "due") {
                    upcomingVaccines.push(vaccine);
                }
            }
        }

        ApiResponse<Vaccine[]> response = {
            success: true,
            message: "Upcoming vaccines retrieved successfully",
            data: upcomingVaccines
        };

        http:Response res = new;
        res.statusCode = 200;
        res.setJsonPayload(response);
        return res;
    }

    // Get completed vaccines for a child
    resource function get completed/[string childId](http:Request req) returns http:Response|error {
        // Extract user from JWT token
        string? currentUserId = utils::getCurrentUserId(req, utils::JWT_SECRET, utils::JWT_ISSUER);
        if (currentUserId is ()) {
            return utils::createErrorResponse(401, "Unauthorized");
        }

        // Check if child exists and belongs to current user
        if (!child_service::childStore.hasKey(childId)) {
            return utils::createErrorResponse(404, "Unauthorized");
        }

        Child child = child_service::childStore[childId];
        if (child.parentId != currentUserId) {
            return utils::createErrorResponse(403, "Access denied");
        }

        // Get completed vaccines
        Vaccine[] completedVaccines = [];
        string[] vaccineIds = childVaccinesMap[childId] ?: [];
        
        foreach string vaccineId in vaccineIds {
            if (vaccineStore.hasKey(vaccineId)) {
                Vaccine vaccine = vaccineStore[vaccineId];
                if (vaccine.status == "completed") {
                    completedVaccines.push(vaccine);
                }
            }
        }

        ApiResponse<Vaccine[]> response = {
            success: true,
            message: "Completed vaccines retrieved successfully",
            data: completedVaccines
        };

        http:Response res = new;
        res.statusCode = 200;
        res.setJsonPayload(response);
        return res;
    }

    // Initialize vaccine schedule for a new child
    resource function post initialize/[string childId](http:Request req) returns http:Response|error {
        // Extract user from JWT token
        string? currentUserId = utils::getCurrentUserId(req, utils::JWT_SECRET, utils::JWT_ISSUER);
        if (currentUserId is ()) {
            return utils::createErrorResponse(401, "Unauthorized");
        }

        // Check if child exists and belongs to current user
        if (!child_service::childStore.hasKey(childId)) {
            return utils::createErrorResponse(404, "Child not found");
        }

        Child child = child_service::childStore[childId];
        if (child.parentId != currentUserId) {
            return utils::createErrorResponse(403, "Access denied");
        }

        // Get vaccine schedule for this child
        VaccineSchedule[] schedule = vaccine_schedule::getVaccineScheduleForChild(child.dateOfBirth);
        
        // Create vaccine records
        Vaccine[] createdVaccines = [];
        string[] vaccineIds = [];

        foreach VaccineSchedule vaccineSchedule in schedule {
            string vaccineId = uuid:createType1AsString();
            string dueDate = vaccine_schedule::getVaccineDueDate(child.dateOfBirth, vaccineSchedule.age);
            
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

            vaccineStore[vaccineId] = vaccine;
            vaccineIds.push(vaccineId);
            createdVaccines.push(vaccine);
        }

        // Update child-vaccines mapping
        childVaccinesMap[childId] = vaccineIds;

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
} 