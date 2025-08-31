import ballerina/http;
import ballerina/log;

listener http:Listener httpListener = new(8080);

service / on httpListener {
    resource function get health(http:Caller caller, http:Request req) returns error? {
        json response = {
            success: true,
            status: "Server is running",
            message: "TikiriCare & TikiriPiyasa Backend is working!"
        };
        check caller->respond(response);
    }
}

public function main() {
    log:printInfo("=== TikiriCare & TikiriPiyasa Backend Started ===");
    log:printInfo("Server URL: http://localhost:8080");
    log:printInfo("Test: http://localhost:8080/health");
    log:printInfo("Press Ctrl+C to stop the server");
}
