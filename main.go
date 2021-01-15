package main

import (
	"bytes"
	"encoding/hex"
	"log"
	"syscall/js"

	"golang.org/x/crypto/openpgp"
	"golang.org/x/crypto/openpgp/armor"
	"golang.org/x/crypto/openpgp/packet"
)

func main() {
	c := make(chan struct{}, 0)
	js.Global().Set("enc", js.FuncOf(encrypt))
	js.Global().Set("dec", js.FuncOf(decode))
	log.Println("pgp wasm initialized")
	<-c
}

func decode(this js.Value, args []js.Value) interface{} {
	// Parse the public key
	e, err := getEntity(this)
	if err != nil {
		log.Println(err)
		return err
	}

	var name string
	for _, i := range e.Identities {
		name = i.Name
		break
	}

	return map[string]interface{}{
		"name":        name,
		"fingerprint": hex.EncodeToString(e.PrimaryKey.Fingerprint[:]),
	}
}

// Encrypt encrypts a message
func encrypt(this js.Value, args []js.Value) interface{} {
	// Parse the public key
	e, err := getEntity(this)
	if err != nil {
		log.Println(err)
		return err.Error()
	}

	// Encrypt the raw message
	enc := bytes.NewBuffer(nil)
	wc, err := openpgp.Encrypt(enc, []*openpgp.Entity{e}, nil, nil, nil)
	if err != nil {
		log.Println(err)
		return err.Error()
	}
	raw := make([]byte, args[0].Length())
	js.CopyBytesToGo(raw, args[0])
	wc.Write(raw)
	wc.Close()

	// Encode with ASCII Armor
	armored := bytes.NewBuffer(nil)
	wc, err = armor.Encode(armored, "PGP MESSAGE", map[string]string{
		"Version": "pgpBin 1.0ish",
		"Comment": "https://pgpbin.enge.me",
	})
	if err != nil {
		log.Println(err)
		return err.Error()
	}
	wc.Write(enc.Bytes())
	wc.Close()

	// et viola
	return armored.String()
}

func getEntity(pubkey js.Value) (*openpgp.Entity, error) {
	f := bytes.NewReader([]byte(pubkey.String()))
	block, err := armor.Decode(f)
	if err != nil {
		return nil, err
	}
	return openpgp.ReadEntity(packet.NewReader(block.Body))
}
