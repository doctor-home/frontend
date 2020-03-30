package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"sync"
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

func HTTPAuthenticateWrap(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		h.ServeHTTP(w, r)
	})
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
