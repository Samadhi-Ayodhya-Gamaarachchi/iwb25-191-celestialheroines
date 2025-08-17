import ballerina/http;
import ballerina/time;
import ballerina/log;
import ballerina/uuid;

// Import types and constants
import types;
import utils;

// In-memory health stores (in production, use a database)
map<GrowthRecord> growthStore = {};
map<MedicalRecord> medicalStore = {};
map<string[]> childGrowthMap = {}; // Maps child ID to growth record IDs
map<string[]> childMedicalMap = {}; // Maps child ID to medical record IDs

// Import child store from child service
import child_service;

service class health_service {
    // Add growth record
    resource function post growth(http:Request req) returns http:Response|error {
        // Extract user from JWT token
        string? currentUserId = utils::getCurrentUserId(req, utils::JWT_SECRET, utils::JWT_ISSUER);
        if (currentUserId is ()) {
            return utils::createErrorResponse(401, "Unauthorized");
        }

        json|error payload = req.getJsonPayload();
        if (payload is error) {
            return utils::createErrorResponse(400, "Invalid JSON payload");
        }

        CreateGrowthRecordRequest|error createReq = payload.cloneWithType(CreateGrowthRecordRequest);
        if (createReq is error) {
            return utils::createErrorResponse(400, "Invalid growth data format");
        }

        // Validate required fields
        if (createReq.height <= 0 || createReq.weight <= 0) {
            return utils::createErrorResponse(400, "Height and weight must be positive values");
        }

        // Check if child exists and belongs to current user
        if (!child_service::childStore.hasKey(createReq.childId)) {
            return utils::createErrorResponse(404, "Child not found");
        }

        Child child = child_service::childStore[createReq.childId];
        if (child.parentId != currentUserId) {
            return utils::createErrorResponse(403, "Access denied");
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

        // Store growth record
        growthStore[recordId] = growthRecord;

        // Update child-growth mapping
        if (!childGrowthMap.hasKey(createReq.childId)) {
            childGrowthMap[createReq.childId] = [];
        }
        childGrowthMap[createReq.childId].push(recordId);

        // Update child's latest measurements
        child.height = createReq.height;
        child.weight = createReq.weight;
        child.bmi = bmi;
        child.updatedAt = currentTime;
        child_service::childStore[createReq.childId] = child;

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
    resource function get growth/[string childId](http:Request req) returns http:Response|error {
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

        // Get growth records
        GrowthRecord[] growthRecords = [];
        string[] recordIds = childGrowthMap[childId] ?: [];
        
        foreach string recordId in recordIds {
            if (growthStore.hasKey(recordId)) {
                growthRecords.push(growthStore[recordId]);
            }
        }

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
    resource function post medical(http:Request req) returns http:Response|error {
        // Extract user from JWT token
        string? currentUserId = utils::getCurrentUserId(req, utils::JWT_SECRET, utils::JWT_ISSUER);
        if (currentUserId is ()) {
            return utils::createErrorResponse(401, "Unauthorized");
        }

        json|error payload = req.getJsonPayload();
        if (payload is error) {
            return utils::createErrorResponse(400, "Invalid JSON payload");
        }

        CreateMedicalRecordRequest|error createReq = payload.cloneWithType(CreateMedicalRecordRequest);
        if (createReq is error) {
            return utils::createErrorResponse(400, "Invalid medical record data format");
        }

        // Validate required fields
        if (createReq.type.trim() == "" || createReq.description.trim() == "" || 
            createReq.date.trim() == "") {
            return utils::createErrorResponse(400, "Type, description, and date are required");
        }

        // Check if child exists and belongs to current user
        if (!child_service::childStore.hasKey(createReq.childId)) {
            return utils::createErrorResponse(404, "Child not found");
        }

        Child child = child_service::childStore[createReq.childId];
        if (child.parentId != currentUserId) {
            return utils::createErrorResponse(403, "Access denied");
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

        // Store medical record
        medicalStore[recordId] = medicalRecord;

        // Update child-medical mapping
        if (!childMedicalMap.hasKey(createReq.childId)) {
            childMedicalMap[createReq.childId] = [];
        }
        childMedicalMap[createReq.childId].push(recordId);

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
    resource function get medical/[string childId](http:Request req) returns http:Response|error {
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

        // Get medical records
        MedicalRecord[] medicalRecords = [];
        string[] recordIds = childMedicalMap[childId] ?: [];
        
        foreach string recordId in recordIds {
            if (medicalStore.hasKey(recordId)) {
                medicalRecords.push(medicalStore[recordId]);
            }
        }

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

    // Get health summary for a child
    resource function get summary/[string childId](http:Request req) returns http:Response|error {
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

        // Get latest growth record
        GrowthRecord? latestGrowth = ();
        string[] growthIds = childGrowthMap[childId] ?: [];
        if (growthIds.length() > 0) {
            // Sort by creation date and get the latest
            growthIds.sort((a, b) => growthStore[b].createdAt.compare(growthStore[a].createdAt));
            latestGrowth = growthStore[growthIds[0]];
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

        // Create health summary
        map<string> healthSummary = {
            "child": child,
            "latestGrowth": latestGrowth,
            "upcomingVaccines": upcomingVaccines,
            "totalGrowthRecords": growthIds.length(),
            "totalMedicalRecords": (childMedicalMap[childId] ?: []).length()
        };

        ApiResponse<map<string>> response = {
            success: true,
            message: "Health summary retrieved successfully",
            data: healthSummary
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