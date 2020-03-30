package main

import "log"

func Execute() error {
	return nil
}

func main() {
	if err := Execute(); err != nil {
		log.Fatalf("Unhandled error: %s", err)
	}
}
