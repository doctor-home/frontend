package main

import (
	"context"
	"encoding/base64"
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"sync"

	gcontext "github.com/gorilla/context"
	"github.com/gorilla/mux"
)

func RecoverWrap(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var err error
		defer func() {
			r := recover()
			if r != nil {
				switch t := r.(type) {
				case string:
					err = errors.New(t)
				case error:
					err = t
				default:
					err = errors.New("Unknown error")
				}
				http.Error(w, err.Error(), http.StatusInternalServerError)
			}
		}()
		h.ServeHTTP(w, r)
	})
}

func HTTPLogWrap(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("[http] %s %s from %s %s", r.Method, r.RequestURI, r.RemoteAddr, r.UserAgent())
		h.ServeHTTP(w, r)
	})
}

type key int

const AuthKey key = 0

func HTTPAuthenticateWrap(app *App) mux.MiddlewareFunc {
	return func(h http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if r.Method == "OPTIONS" || (r.Method == "POST" && r.URL.Path == "/api/dah/v0/healthreport") {
				h.ServeHTTP(w, r)
				return
			}

			auth := strings.SplitN(r.Header.Get("Authorization"), " ", 2)
			if len(auth) != 2 {
				http.Error(w, "authorization failed", http.StatusUnauthorized)
				return
			}
			payload, _ := base64.StdEncoding.DecodeString(auth[1])
			pair := strings.SplitN(string(payload), ":", 2)

			if len(pair) != 2 {
				http.Error(w, "authorization failed", http.StatusUnauthorized)
				return
			}
			c := app.Authenticate(pair[0], pair[1])
			if c == nil {
				http.Error(w, "authorization failed", http.StatusUnauthorized)
				return
			}
			gcontext.Set(r, AuthKey, c)
			h.ServeHTTP(w, r)
		})
	}
}

func runServer(srv *http.Server, wg *sync.WaitGroup, logPrefix string) {
	defer wg.Done()
	idleConnections := make(chan struct{})
	go func() {
		sigint := make(chan os.Signal, 1)
		signal.Notify(sigint, os.Interrupt)
		<-sigint
		if err := srv.Shutdown(context.Background()); err != nil {
			log.Printf("[%s] Could not shutdown: %v", logPrefix, err)
		}
		close(idleConnections)
	}()
	log.Printf("[%s] listening on %s", logPrefix, srv.Addr)
	if err := srv.ListenAndServe(); err != http.ErrServerClosed {
		log.Printf("[%s] Could not serve: %v", logPrefix, err)
	}
	<-idleConnections
}
