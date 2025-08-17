import ballerina/http;
import ballerina/jwt;
import ballerina/log;

// Import types
import types;

// JWT configuration
public final string JWT_SECRET = "tikiricare-super-secret-key-2024";
public final string JWT_ISSUER = "tikiricare-auth-service";

// Function to create error responses
public function createErrorResponse(int statusCode, string message) returns http:Response {
    ApiResponse<()> errorResponse = {
        success: false,
        message: message
    };

    http:Response res = new;
    res.statusCode = statusCode;
    res.setJsonPayload(errorResponse);
    return res;
}

// Function to create success responses
public function createSuccessResponse<T>(T data, string message) returns http:Response {
    ApiResponse<T> successResponse = {
        success: true,
        message: message,
        data: data
    };

    http:Response res = new;
    res.statusCode = 200;
    res.setJsonPayload(successResponse);
    return res;
}

// Function to validate JWT token and get current user
public function getCurrentUser(http:Request req, string secret, string issuer) returns User? {
    string|error authHeader = req.getHeader("Authorization");
    if (authHeader is error || !authHeader.startsWith("Bearer ")) {
        return ();
    }

    string jwtToken = authHeader.substring(7);
    
    jwt:ValidatorConfig validatorConfig = {
        issuer: issuer,
        clockSkew: 60,
        signatureConfig: {
            secret: secret
        }
    };

    jwt:Payload|error verified = jwt:validate(jwtToken, validatorConfig);
    if (verified is error) {
        log:printError("JWT validation failed: " + verified.message());
        return ();
    }

    // Extract user information from JWT payload
    anydata? usernameValue = verified["sub"];
    if (usernameValue is string) {
        // In a real application, you would fetch user details from database
        // For now, return a basic user object
        return {
            id: usernameValue,
            email: usernameValue,
            name: "User",
            telephone: "",
            password: "",
            role: "parent",
            createdAt: "",
            updatedAt: ""
        };
    }

    return ();
}

// Function to get current user ID from JWT token
public function getCurrentUserId(http:Request req, string secret, string issuer) returns string? {
    User? currentUser = getCurrentUser(req, secret, issuer);
    if (currentUser is ()) {
        return ();
    }
    return currentUser.id;
}

// Function to validate email format
public function isValidEmail(string email) returns boolean {
    return email.contains("@") && email.contains(".");
}

// Function to validate phone number format
public function isValidPhone(string phone) returns boolean {
    // Basic validation - at least 10 digits
    return phone.length() >= 10;
}

// Function to sanitize string input
public function sanitizeString(string input) returns string {
    return input.trim();
}

// Function to validate date format
public function isValidDateFormat(string date) returns boolean {
    // Check if date matches yyyy-MM-dd format
    if (date.length() != 10) {
        return false;
    }
    
    if (date[4] != '-' || date[7] != '-') {
        return false;
    }
    
    // Basic validation - could be enhanced
    return true;
}

// Function to calculate age from birth date
public function calculateAge(string birthDate) returns int {
    // This is a simplified calculation
    // In production, use proper date libraries
    return 0; // Placeholder
} 