import ballerina/http;
import ballerina/jwt;
import ballerina/time;
import ballerina/io; 


final string SECRET = "supersecretkey";

map<string> userStore = {
    "admin@example.com": "admin123",
    "user@example.com": "user123"
};

type LoginRequest record {
    string email;
    string password;
};

service /auth on new http:Listener(8080) {
      resource function post register(http:Request req) returns http:Response|error {
    json|error payload = req.getJsonPayload();
    if (payload is error) {
        return createErrorResponse(400, "Invalid JSON");
    }

    LoginRequest|error regReq = payload.cloneWithType(LoginRequest);
    if (regReq is error) {
        return createErrorResponse(400, "Invalid data format");
    }

    if (userStore.hasKey(regReq.email)) {
        return createErrorResponse(409, "User already exists");
    }

    userStore[regReq.email] = regReq.password;

    http:Response res = new;
    res.statusCode = 201;
    res.setJsonPayload({ "message": "User registered successfully" });
    return res;
}

    resource function post login(http:Request req) returns http:Response|error {
    json|error payload = req.getJsonPayload();
    if (payload is error) {
        return createErrorResponse(400, "Invalid JSON");
    }

    LoginRequest|error loginReq = payload.cloneWithType(LoginRequest);
    if (loginReq is error) {
        return createErrorResponse(400, "Invalid data format");
    }

    if (userStore.hasKey(loginReq.email) && userStore[loginReq.email] == loginReq.password) {

        decimal currentTime = <decimal>time:utcNow()[0];

       jwt:IssuerConfig issuerConfig = {
    issuer: "auth-service",
    username: loginReq.email,
    expTime: currentTime + 3600,
    signatureConfig: {
        algorithm: jwt:HS256,
        config: SECRET
    }
};

         io:println("IssuerConfig: ", issuerConfig); 

      var tokenResult = jwt:issue(issuerConfig);
    if (tokenResult is string) {
        http:Response res = new;
        res.statusCode = 200;
        res.setJsonPayload({ "token": tokenResult });
        return res;
    } else {
        io:println("Token issue error: ", tokenResult);
        return createErrorResponse(500, "Token generation failed");
    }
} else {
    return createErrorResponse(401, "Invalid credentials");
}
}

    resource function get secure(http:Request req) returns http:Response|error {
        string|error authHeader = req.getHeader("Authorization");
        if (authHeader is string && authHeader.startsWith("Bearer ")) {
            string jwtToken = authHeader.substring(7);
jwt:ValidatorConfig validatorConfig = {
    issuer: "auth-service",
    clockSkew: 60,
    signatureConfig: {
        secret: SECRET
    }
};

jwt:Payload|error verified = jwt:validate(jwtToken, validatorConfig);
if (verified is jwt:Payload) {
    anydata? usernameValue = verified["sub"];
    string username = usernameValue is string ? usernameValue : "unknown";
    http:Response res = new;
    res.statusCode = 200;
    res.setJsonPayload({ "message": "Authorized!", "user": username });
    return res;
}

        }
        return createErrorResponse(401, "Unauthorized");
    }
}

function createErrorResponse(int status, string message) returns http:Response {
    http:Response res = new;
    res.statusCode = status;
    res.setJsonPayload({ "error": message });
    return res;
}
