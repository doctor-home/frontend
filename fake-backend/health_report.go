package main

import "time"

type HealthReport struct {
	Timestamp     time.Time `json:"timestamp"`
	ID            string    `json:"healthReportID"`
	PatientID     string    `json:"patientID"`
	HearthBeat    int       `json:"hearthBeat"`
	Oxygenation   float64   `json:"oxygenation"`
	Temperature   float64   `json:"temperature"`
	BreathingRate int       `json:"breathingRate"`
	Triage        int       `json:"ML_Triage"`
}
