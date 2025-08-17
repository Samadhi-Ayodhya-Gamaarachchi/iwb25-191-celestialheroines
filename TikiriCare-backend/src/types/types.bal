// User and Authentication Types
public type User record {
    string id;
    string email;
    string name;
    string telephone;
    string password;
    string role;
    string createdAt;
    string updatedAt;
};

public type LoginRequest record {
    string email;
    string password;
};

public type RegisterRequest record {
    string email;
    string password;
    string name;
    string telephone;
};

public type AuthResponse record {
    string token;
    User user;
    string message;
};

// Child Types
public type Child record {
    string id;
    string parentId;
    string name;
    string gender;
    string dateOfBirth;
    int ageInMonths;
    decimal height;
    decimal weight;
    decimal bmi;
    string lastCheckup;
    int developmentScore;
    string createdAt;
    string updatedAt;
};

public type CreateChildRequest record {
    string name;
    string gender;
    string dateOfBirth;
    decimal? height;
    decimal? weight;
};

public type UpdateChildRequest record {
    string? name;
    string? gender;
    decimal? height;
    decimal? weight;
    string? lastCheckup;
    int? developmentScore;
};

// Vaccine Types
public type Vaccine record {
    string id;
    string childId;
    string name;
    string age;
    string dueDate;
    string status; // "upcoming", "due", "completed", "overdue"
    string? completedDate;
    string? remarks;
    string createdAt;
    string updatedAt;
};

public type VaccineSchedule record {
    string age;
    string vaccine;
    string remarks;
};

public type CreateVaccineRequest record {
    string childId;
    string name;
    string age;
    string dueDate;
    string? remarks;
};

public type UpdateVaccineStatusRequest record {
    string status;
    string? completedDate;
    string? remarks;
};

// Health Types
public type GrowthRecord record {
    string id;
    string childId;
    decimal height;
    decimal weight;
    decimal bmi;
    string recordedDate;
    string createdAt;
};

public type MedicalRecord record {
    string id;
    string childId;
    string type;
    string description;
    string date;
    string? doctor;
    string? hospital;
    string createdAt;
};

public type CreateGrowthRecordRequest record {
    string childId;
    decimal height;
    decimal weight;
    string recordedDate;
};

public type CreateMedicalRecordRequest record {
    string childId;
    string type;
    string description;
    string date;
    string? doctor;
    string? hospital;
};

// Response Types
public type ApiResponse<T> record {
    boolean success;
    string message;
    T? data;
    string[]? errors;
};

public type PaginatedResponse<T> record {
    T[] data;
    int total;
    int page;
    int limit;
    boolean hasNext;
    boolean hasPrev;
};

// Error Types
public type AppError record {
    string code;
    string message;
    string? details;
}; 