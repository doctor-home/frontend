package main

type Clinician struct {
	ID       string     `json:"clinicianID"`
	Name     string     `json:"name"`
	Patients []*Patient `json:"patients"`
	Username string     `json:"username"`
	Password string     `json:"password"`
}
