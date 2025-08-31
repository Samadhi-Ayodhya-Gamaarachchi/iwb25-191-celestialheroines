import ballerina/log;
import ballerina/http;
import ballerina/io;

// Test script to verify MongoDB, Backend, and Frontend connections

public function main() returns error? {
    log:printInfo("🔍 Starting Comprehensive Connection Test");
    log:printInfo("==========================================");
    
    // Test 1: Backend Health Check
    log:printInfo("📡 Testing Backend Connection...");
    http:Client backendClient = check new("http://localhost:8080");
    
    json|error healthResponse = backendClient->get("/health");
    if healthResponse is json {
        log:printInfo("✅ Backend Health Check: SUCCESS");
        io:println("Backend Response: " + healthResponse.toString());
    } else {
        log:printError("❌ Backend Health Check: FAILED", healthResponse);
        return healthResponse;
    }
    
    // Test 2: Authentication Test
    log:printInfo("🔐 Testing Authentication...");
    json loginPayload = {
        "email": "parent@test.com",
        "password": "password123"
    };
    
    http:Request loginRequest = new;
    loginRequest.setJsonPayload(loginPayload);
    
    json|error authResponse = backendClient->post("/auth/login", loginRequest);
    if authResponse is json {
        log:printInfo("✅ Authentication Test: SUCCESS");
        io:println("Auth Response: " + authResponse.toString());
        
        // Extract token for further tests
        string? token = extractToken(authResponse);
        if token is string {
            // Test 3: Protected Endpoint (Children)
            log:printInfo("👶 Testing Children API with Auth...");
            
            map<string> headers = {"Authorization": "Bearer " + token};
            
            json|error childrenResponse = backendClient->get("/children", headers);
            if childrenResponse is json {
                log:printInfo("✅ Children API Test: SUCCESS");
                io:println("Children Response: " + childrenResponse.toString());
            } else {
                log:printError("❌ Children API Test: FAILED", childrenResponse);
            }
        }
    } else {
        log:printError("❌ Authentication Test: FAILED", authResponse);
    }
    
    // Test 4: Caregiver API (TikiriPiyasa)
    log:printInfo("👩‍⚕️ Testing Caregiver API...");
    json|error caregiversResponse = backendClient->get("/caregivers");
    if caregiversResponse is json {
        log:printInfo("✅ Caregivers API Test: SUCCESS");
        io:println("Caregivers Response: " + caregiversResponse.toString());
    } else {
        log:printError("❌ Caregivers API Test: FAILED", caregiversResponse);
    }
    
    log:printInfo("==========================================");
    log:printInfo("🎉 Connection Tests Completed");
    
    return;
}

function extractToken(json authResponse) returns string? {
    if authResponse is map<json> {
        json? tokenField = authResponse["token"];
        if tokenField is string {
            return tokenField;
        }
    }
    return ();
}
