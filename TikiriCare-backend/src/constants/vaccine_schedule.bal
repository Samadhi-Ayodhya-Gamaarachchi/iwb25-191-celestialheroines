import ballerina/time;

// Vaccine Schedule Type Definition
public type VaccineSchedule record {
    string age;
    string vaccine;
    string remarks;
};

// Sri Lanka National Immunization Schedule Constants
public final VaccineSchedule[] SRI_LANKA_VACCINE_SCHEDULE = [
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
    // Calculate age in months from date of birth
    int ageInMonths = calculateAgeInMonthsFromString(dateOfBirth);
    
    // Filter vaccines that are due or upcoming
    VaccineSchedule[] relevantVaccines = [];
    
    foreach VaccineSchedule vaccine in SRI_LANKA_VACCINE_SCHEDULE {
        string? ageStr = AGE_IN_MONTHS[vaccine.age];
        if (ageStr is string) {
            int|error vaccineAge = int:fromString(ageStr);
            if (vaccineAge is int && vaccineAge >= ageInMonths) {
                relevantVaccines.push(vaccine);
            }
        }
    }
    
    return relevantVaccines;
}

// Function to calculate age in months from date string (simplified)
public function calculateAgeInMonthsFromString(string dateOfBirth) returns int {
    // Simple calculation - extract year from birth date and current date
    string currentTime = time:utcToString(time:utcNow());
    string currentYearStr = currentTime.substring(0, 4);
    string birthYearStr = dateOfBirth.substring(0, 4);
    
    int|error currentYear = int:fromString(currentYearStr);
    int|error birthYear = int:fromString(birthYearStr);
    
    if (currentYear is int && birthYear is int) {
        return (currentYear - birthYear) * 12; // Simplified age calculation
    }
    
    return 0;
}

// Function to get due date for a vaccine (simplified)
public function getVaccineDueDate(string dateOfBirth, string age) returns string {
    // Return a simple format for vaccine due date
    return "Due as per schedule for " + age;
} 