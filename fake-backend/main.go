package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"sync"

	gcontext "github.com/gorilla/context"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

func JSON(w http.ResponseWriter, obj interface{}) {
	data, err := json.Marshal(obj)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(data)
}

func Execute() error {
	app := LoadApp("app.json")
	defer func() {
		err := app.Save("app.json")
		if err != nil {
			log.Printf("Could not save state: %s", err)
		}
	}()

	router := mux.NewRouter()
	router.HandleFunc("/api/dah/v0/clinician/current", func(w http.ResponseWriter, r *http.Request) {
		c := gcontext.Get(r, AuthKey)

		JSON(w, &c)
	}).Methods("GET")

	router.HandleFunc("/api/dah/v0/clinician/{cID}/untreatedpatients", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		actual := gcontext.Get(r, AuthKey)
		if actual.(*Clinician).ID != vars["cID"] {
			http.Error(w, "unauthorized access", http.StatusForbidden)
			return
		}
		patients, err := app.GetObservedPatientsForClinician(vars["cID"])
		if err != nil {
			http.Error(w, err.Error(), http.StatusNotFound)
		}
		JSON(w, patients)
	}).Methods("GET")

	router.HandleFunc("/api/dah/v0/clinician/{cID}/patients", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		actual := gcontext.Get(r, AuthKey)
		if actual.(*Clinician).ID != vars["cID"] {
			http.Error(w, "unauthorized access", http.StatusForbidden)
			return
		}
		patients, err := app.GetAllPatientsForClinician(vars["cID"])
		if err != nil {
			http.Error(w, err.Error(), http.StatusNotFound)
		}
		JSON(w, patients)
	}).Methods("GET")

	router.HandleFunc("/api/dah/v0/patients/{pID}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		actual := gcontext.Get(r, AuthKey).(*Clinician)
		for _, p := range actual.Patients {
			if p.ID == vars["pID"] {
				JSON(w, p)
				return
			}
		}
		_, err := app.GetPatientByID(vars["pID"])
		if err != nil {
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		}
		http.Error(w, "Unauthorized", http.StatusForbidden)
	}).Methods("GET")

	router.HandleFunc("/api/dah/v0/patients/{pID}/health-reports", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		actual := gcontext.Get(r, AuthKey).(*Clinician)
		authorized := false
		for _, p := range actual.Patients {
			if p.ID == vars["pID"] {
				authorized = true
				break
			}
		}
		if authorized == false {
			_, err := app.GetPatientByID(vars["pID"])
			if err != nil {
				http.Error(w, err.Error(), http.StatusNotFound)
				return
			}
			http.Error(w, "Unauthorized", http.StatusForbidden)
			return
		}

		reports, err := app.GetReportsForPatient(vars["pID"])
		if err != nil {
			http.Error(w, "Not Found: "+err.Error(), http.StatusNotFound)
			return
		}
		JSON(w, reports)
	}).Methods("GET")

	router.HandleFunc("/api/dah/v0/patient", func(w http.ResponseWriter, r *http.Request) {
		actual := gcontext.Get(r, AuthKey).(*Clinician)
		p := Patient{}
		dec := json.NewDecoder(r.Body)
		err := dec.Decode(&p)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if len(p.ID) == 0 {
			err = app.RegisterPatient(actual.ID, &p)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			w.Write([]byte("{}"))
			return
		} else {
			actual, err := app.GetPatientByID(p.ID)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			actual.Merge(p)
			w.Write([]byte("{}"))
			return
		}
	}).Methods("POST")

	router.HandleFunc("/api/dah/v0/healthreport", func(w http.ResponseWriter, r *http.Request) {
		report := &HealthReport{}
		data, err := ioutil.ReadAll(r.Body)
		if err != nil {
			panic(err.Error())
		}
		err = json.Unmarshal(data, report)
		if err != nil {
			panic(err.Error())
		}

		err = app.RegisterReport(report)
		if err != nil {
			panic(err)
			return
		}
		w.Write([]byte("{}"))
	}).Methods("POST")

	router.Use(RecoverWrap)
	router.Use(HTTPLogWrap)
	router.Use(HTTPAuthenticateWrap(app))
	headersOk := handlers.AllowedHeaders([]string{"X-Requested-With", "authorization", "content-type"})
	originsOk := handlers.AllowedOrigins([]string{"*"})
	methodsOk := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS"})

	httpServer := http.Server{
		Addr:    ":4202",
		Handler: handlers.CORS(originsOk, headersOk, methodsOk)(router),
	}

	wg := sync.WaitGroup{}
	wg.Add(1)
	go runServer(&httpServer, &wg, "backend")

	wg.Wait()

	return nil
}

func main() {
	if err := Execute(); err != nil {
		log.Fatalf("Unhandled error: %s", err)
		os.Exit(1)
	}
}
