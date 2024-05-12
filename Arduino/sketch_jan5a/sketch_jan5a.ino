#include <Arduino.h>
#include <iostream>
#include <string>
 
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
 
#include <ESP8266HTTPClient.h>
#include <ESP8266httpUpdate.h>
 
#ifndef APSSID
#define APSSID "WiFi 404"
#define APPSK  "9rr233zy"
#endif
 
ESP8266WiFiMulti WiFiMulti;
 
float firmware_version = 0.21;
#define VERSION_CHECK_URL "http://10.0.0.100:39000/tallyLight/firmware/version"
#define FIRMWARE_URL "10.0.0.100", 39000, "/tallyLight/firmware/firmware.bin"
 
void update_started() {
  Serial.println("CALLBACK:  HTTP update process started");
}
 
void update_finished() {
  Serial.println("CALLBACK:  HTTP update process finished");
}
 
void update_progress(int cur, int total) {
  Serial.printf("CALLBACK:  HTTP update process at %d of %d bytes...\n", cur, total);
}
 
void update_error(int err) {
  Serial.printf("CALLBACK:  HTTP update fatal error code %d\n", err);
}

float getRemoteFirmwareVersion() {
  WiFiClient client;
  HTTPClient http;

  if (http.begin(client, VERSION_CHECK_URL)) {
    int httpCode = http.GET();
    if (httpCode == HTTP_CODE_OK) {
      String version = http.getString();
      return version.toFloat();
    } else{
      return 0; //server online
    }
  }
  

  return 0; // Return empty string if unable to fetch version
}

void update_software(){
  Serial.println("Waiting for connection");
  if ((WiFiMulti.run() == WL_CONNECTED)) {
    Serial.println("Connected to network");
 
    WiFiClient client;

    float remoteVersion = getRemoteFirmwareVersion();

    if (remoteVersion != 0 && remoteVersion > firmware_version) {
      Serial.print("New firmware available: ");
      Serial.print(firmware_version);
      Serial.print(" -> ");
      Serial.print(remoteVersion);
      Serial.println(". Starting update...");

      // Add optional callback notifiers
      ESPhttpUpdate.onStart(update_started);
      ESPhttpUpdate.onEnd(update_finished);
      ESPhttpUpdate.onProgress(update_progress);
      ESPhttpUpdate.onError(update_error);

      ESPhttpUpdate.rebootOnUpdate(false); // remove automatic update

      // Specify the server IP, port, and firmware path for update
      t_httpUpdate_return ret = ESPhttpUpdate.update(client, FIRMWARE_URL);

      switch (ret) {
        case HTTP_UPDATE_FAILED:
          Serial.printf("HTTP_UPDATE_FAILED Error (%d): %s\n", ESPhttpUpdate.getLastError(), ESPhttpUpdate.getLastErrorString().c_str());
          Serial.println(F("Retry in 10secs!"));
          delay(10000); // Wait 10secs before retrying
          break;

        case HTTP_UPDATE_NO_UPDATES:
          Serial.println("HTTP_UPDATE_NO_UPDATES");
          break;

        case HTTP_UPDATE_OK:
          Serial.println("HTTP_UPDATE_OK");
          delay(1000); // Wait a second and restart
          ESP.restart();
          break;
      }
    }else if(remoteVersion == 0){
      Serial.println("Server offline");
      delay(10000); 
    }else {
      Serial.println("Firmware is up to date. No update needed.");
      delay(10000); // Wait for 1 minute before checking again
    }
  }
}
void setup() {
 
  Serial.begin(115200);
  pinMode(LED_BUILTIN, OUTPUT);
 
  Serial.println();
  Serial.println();
  Serial.println();
 
  for (uint8_t t = 4; t > 0; t--) {
    Serial.printf("[SETUP] WAIT %d...\n", t);
    Serial.flush();
    delay(1000);
  }
 
  WiFi.mode(WIFI_STA);
  WiFiMulti.addAP(APSSID, APPSK);
  Serial.print(F("Current firmware version: "));
  Serial.println(firmware_version);
  update_software();
}
 

void loop() {
    digitalWrite(LED_BUILTIN, HIGH);
    delay(1000);
    digitalWrite(LED_BUILTIN, LOW);
    delay(1000);
}
