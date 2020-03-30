package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"sync"
)

type App struct {
	clinicianPatient     map[string]string
	Clinicians           map[string]*Clinician      `json:"clinicians"`
	ReportsByPatientID   map[string][]*HealthReport `json:"reports"`
	cliniciansByUsername map[string]*Clinician
	reportsByID          map[string]*HealthReport
	mutex                sync.RWMutex
}

func NewApp() *App {
	res := &App{
		clinicianPatient:     make(map[string]string),
		Clinicians:           make(map[string]*Clinician),
		ReportsByPatientID:   make(map[string][]*HealthReport),
		cliniciansByUsername: make(map[string]*Clinician),
		reportsByID:          make(map[string]*HealthReport),
	}
	res.RegisterClinician(&Clinician{
		Name:     "Administrator",
		Username: "default",
		Password: "doctor_at_home",
		admin:    true,
	})
	return res
}

func LoadApp(filepath string) *App {
	res := NewApp()
	f, err := os.Open(filepath)
	if err != nil {
		log.Printf("Could not open '%s': %s", filepath, err)
	}
	defer f.Close()
	dec := json.NewDecoder(f)
	err = dec.Decode(res)
	if err != nil {
		log.Printf("Could not parse JSON in '%s': %s", filepath, err)
		return NewApp()
	}
	res.rebuild()
	return res
}

func (a *App) Save(filename string) error {
	a.mutex.RLock()
	defer a.mutex.RUnlock()
	f, err := os.Create(filename)
	if err != nil {
		return err
	}
	defer f.Close()
	enc := json.NewEncoder(f)
	err = enc.Encode(a)
	if err != nil {
		return err
	}
	return nil
}

func (a *App) rebuild() {

	a.clinicianPatient = make(map[string]string)
	a.cliniciansByUsername = make(map[string]*Clinician)
	a.reportsByID = make(map[string]*HealthReport)

	for _, c := range a.Clinicians {
		a.cliniciansByUsername[c.Username] = c
		for _, p := range c.Patients {
			a.clinicianPatient[p.ID] = c.ID
		}
	}

	for _, reports := range a.ReportsByPatientID {
		for _, r := range reports {
			a.reportsByID[r.ID] = r
		}
	}

}

func (a *App) GetReportsForPatient(ID string) ([]*HealthReport, error) {
	a.mutex.RLock()
	defer a.mutex.RUnlock()
	res, ok := a.ReportsByPatientID[ID]
	if ok == false {
		return nil, fmt.Errorf("Could not find Patient '%s'", ID)
	}
	return res, nil
}

func (a *App) GetPatientByID(ID string) (*Patient, error) {
	a.mutex.RLock()
	defer a.mutex.RUnlock()
	clinicianID, ok := a.clinicianPatient[ID]
	if ok == false {
		return nil, fmt.Errorf("Patient %s not found", ID)
	}

	c, ok := a.Clinicians[clinicianID]
	if ok == false {
		return nil, fmt.Errorf("Clinician %s for Patient %s not found", clinicianID, ID)
	}

	for _, p := range c.Patients {
		if p.ID == ID {
			return p, nil
		}
	}
	return nil, fmt.Errorf("Patient %s in Clininician %s not found", ID, clinicianID)
}

func (a *App) GetAllPatientsForClinician(ID string) ([]*Patient, error) {
	a.mutex.RLock()
	defer a.mutex.RUnlock()

	c, ok := a.Clinicians[ID]
	if ok == false {
		return nil, fmt.Errorf("Clinician %s not found", ID)
	}

	return c.Patients, nil
}

func (a *App) GetObservedPatientsForClinician(ID string) ([]*Patient, error) {
	a.mutex.RLock()
	defer a.mutex.RUnlock()

	c, ok := a.Clinicians[ID]
	if ok == false {
		return nil, fmt.Errorf("Clinician %s not found", ID)
	}
	res := make([]*Patient, 0, len(c.Patients))
	for _, p := range c.Patients {
		if p.UnderObservation == false {
			continue
		}
		res = append(res, p)
	}

	return res, nil
}

func (a *App) GetClinician(ID string) (*Clinician, error) {
	a.mutex.RLock()
	defer a.mutex.RUnlock()

	c, ok := a.Clinicians[ID]
	if ok == false {
		return nil, fmt.Errorf("Could not found clinician '%s'", ID)
	}
	return c, nil
}

func (a *App) newClinicianID() string {
	ID := len(a.Clinicians) + 1
	for {
		IDstr := fmt.Sprintf("%d", ID)
		if _, ok := a.Clinicians[IDstr]; ok == false {
			return IDstr
		}
	}
}

func (a *App) newPatientID() string {
	ID := len(a.clinicianPatient) + 1
	for {
		IDstr := fmt.Sprintf("%d", ID)
		if _, ok := a.clinicianPatient[IDstr]; ok == false {
			return IDstr
		}
	}
}

func (a *App) newReportID() string {
	ID := len(a.reportsByID) + 1
	for {
		IDstr := fmt.Sprintf("%d", ID)
		if _, ok := a.reportsByID[IDstr]; ok == false {
			return IDstr
		}
	}
}

func (a *App) RegisterClinician(c *Clinician) error {
	a.mutex.Lock()
	defer a.mutex.Unlock()

	if len(c.Username) == 0 {
		return fmt.Errorf("Empty username")
	}

	if _, ok := a.cliniciansByUsername[c.Username]; ok == true {
		return fmt.Errorf("Username '%s' already exists", c.Username)
	}

	if len(c.Patients) != 0 {
		return fmt.Errorf("New clinician cannot have patients")
	}

	c.ID = a.newClinicianID()
	c.admin = false
	a.Clinicians[c.ID] = c
	a.cliniciansByUsername[c.Username] = c

	return nil
}

func (a *App) RegisterPatient(cID string, p *Patient) error {
	a.mutex.Lock()
	defer a.mutex.Unlock()

	c, err := a.GetClinician(cID)
	if err != nil {
		return err
	}
	if p.Summary.LastReport != nil {
		return fmt.Errorf("New patient cannot have reports")
	}

	ID := a.newPatientID()
	p.ID = ID
	c.Patients = append(c.Patients, p)
	a.clinicianPatient[p.ID] = c.ID
	a.ReportsByPatientID[p.ID] = nil
	return nil
}

func (a *App) Authenticate(username, password string) *Clinician {
	a.mutex.RLock()
	defer a.mutex.RUnlock()

	c, ok := a.cliniciansByUsername[username]
	if ok == false {
		return nil
	}
	if c.Password == password {
		return c
	}
	return nil
}

func (a *App) RegisterReport(r *HealthReport) error {
	a.mutex.Lock()
	defer a.mutex.Unlock()

	p, err := a.GetPatientByID(r.PatientID)
	if err != nil {
		return err
	}

	ID := a.newReportID()
	r.ID = ID
	p.Summary.LastReport = r
	a.ReportsByPatientID[p.ID] = append(a.ReportsByPatientID[p.ID], r)
	a.reportsByID[ID] = r

	return nil
}
