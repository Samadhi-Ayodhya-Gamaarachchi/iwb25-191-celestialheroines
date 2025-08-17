import ballerina/http;
import ballerina/jwt;
import ballerina/time;
import ballerina/log;
import ballerina/uuid;

// Import types
import types;
import utils;

// In-memory user store (in production, use a database)
map<User> userStore = {};

// JWT configuration
final string JWT_SECRET = "tikiricare-super-secret-key-2024";
final string JWT_ISSUER = "tikiricare-auth-service";

service class auth_service {
    // User Registration
    resource function post register(http:Request req) returns http:Response|error {
        json|error payload = req.getJsonPayload();
        if (payload is error) {
            return utils::createErrorResponse(400, "Invalid JSON payload");
        }

        RegisterRequest|error regReq = payload.cloneWithType(RegisterRequest);
        if (regReq is error) {
            return utils::createErrorResponse(400, "Invalid registration data format");
        }

        // Validate required fields
        if (regReq.name.trim() == "" || regReq.email.trim() == "" || 
            regReq.password.trim() == "" || regReq.telephone.trim() == "") {
            return utils::createErrorResponse(400, "All fields are required");
        }

        // Validate email format
        if (!regReq.email.contains("@")) {
            return utils::createErrorResponse(400, "Invalid email format");
        }

        // Validate password length
        if (regReq.password.length() < 6) {
            return utils::createErrorResponse(400, "Password must be at least 6 characters");
        }

        // Check if user already exists
        if (userStore.hasKey(regReq.email)) {
            return utils::createErrorResponse(409, "User with this email already exists");
        }

        // Create new user
        string userId = uuid:createType1AsString();
        string currentTime = time:utcNow().toString();
        
        User newUser = {
            id: userId,
            email: regReq.email,
            name: regReq.name,
            telephone: regReq.telephone,
            password: regReq.password, // In production, hash the password
            role: "parent",
            createdAt: currentTime,
            updatedAt: currentTime
        };

        userStore[regReq.email] = newUser;

        log:printInfo("New user registered: " + regReq.email);

        // Return success response
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

    // User Login
    resource function post login(http:Request req) returns http:Response|error {
        json|error payload = req.getJsonPayload();
        if (payload is error) {
            return utils::createErrorResponse(400, "Invalid JSON payload");
        }

        LoginRequest|error loginReq = payload.cloneWithType(LoginRequest);
        if (loginReq is error) {
            return utils::createErrorResponse(400, "Invalid login data format");
        }

        // Validate required fields
        if (loginReq.email.trim() == "" || loginReq.password.trim() == "") {
            return utils::createErrorResponse(400, "Email and password are required");
        }

        // Check if user exists
        if (!userStore.hasKey(loginReq.email)) {
            return utils::createErrorResponse(401, "Invalid email or password");
        }

        User user = userStore[loginReq.email];
        
        // Check password (in production, verify hashed password)
        if (user.password != loginReq.password) {
            return utils::createErrorResponse(401, "Invalid email or password");
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
            return utils::createErrorResponse(500, "Authentication failed");
        }

        // Create auth response
        AuthResponse authResponse = {
            token: tokenResult,
            user: user,
            message: "Login successful"
        };

        ApiResponse<AuthResponse> response = {
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

    // Get current user profile
    resource function get profile(http:Request req) returns http:Response|error {
        // Extract user from JWT token
        User? currentUser = utils::getCurrentUser(req, JWT_SECRET, JWT_ISSUER);
        if (currentUser is ()) {
            return utils::createErrorResponse(401, "Unauthorized");
        }

        ApiResponse<User> response = {
            success: true,
            message: "Profile retrieved successfully",
            data: currentUser
        };

        http:Response res = new;
        res.statusCode = 200;
        res.setJsonPayload(response);
        return res;
    }

    // Update user profile
    resource function put profile(http:Request req) returns http:Response|error {
        // Extract user from JWT token
        User? currentUser = utils::getCurrentUser(req, JWT_SECRET, JWT_ISSUER);
        if (currentUser is ()) {
            return utils::createErrorResponse(401, "Unauthorized");
        }

        json|error payload = req.getJsonPayload();
        if (payload is error) {
            return utils::createErrorResponse(400, "Invalid JSON payload");
        }

        // Update user fields (excluding sensitive ones)
        if (payload is map<json>) {
            if (payload.hasKey("name") && payload["name"] is string) {
                currentUser.name = <string>payload["name"];
            }
            if (payload.hasKey("telephone") && payload["telephone"] is string) {
                currentUser.telephone = <string>payload["telephone"];
            }
            
            currentUser.updatedAt = time:utcNow().toString();
            userStore[currentUser.email] = currentUser;
        }

        ApiResponse<User> response = {
            success: true,
            message: "Profile updated successfully",
            data: currentUser
        };

        http:Response res = new;
        res.statusCode = 200;
        res.setJsonPayload(response);
        return res;
    }
} 