package main

type PatientSummary struct {
	ID         string       `json:"patientID"`
	Name       string       `json:"name"`
	LastReport HealthReport `json:"lastReport"`
}

type Patient struct {
	ID                  string         `json:"patientID"`
	Name                string         `json:"name"`
	Phone               string         `json:"phone"`
	Age                 int32          `json:"age"`
	City                string         `json:"city"`
	Language            string         `json:"language"`
	Summary             PatientSummary `json:"summary"`
	Preconditions       string         `json:"preconditions"`
	DaysUnderInspection int            `json:"daysUnderInspection"`
	Fitness             int            `json:"fitness"`
	Smoker              bool           `json:"smoker"`
	ClinicianID         string         `json:"clinicianID"`
	UnderObservation    bool           `json:"under_observation"`
}
