/*
Sergio Mokshin
Automação Live - Jan /2015
*/

#include <SPI.h>
#include <Ethernet.h>
#include <EEPROM.h>
#include <avr/wdt.h>
#include "Wire.h"
#include <OneWire.h> // Importar biblioteca
#include <Servo.h>

OneWire ds(2);  // on pin 10 (a 4.7K resistor is necessary)
#define DS1307_I2C_ADDRESS 0x68

Servo myservo;  // create servo object to cLigadotrol a servo
byte mac[] = {
  0x90, 0xA2, 0xDA, 0x0D, 0xA6, 0x09 }; //physical mac address
byte ip[] = {
  192, 168, 0, 201 }; // ip in lan
byte gateway[] = {
  192, 168, 0, 1 }; // internet access via router
byte subnet[] = {
  255, 255, 255, 0 }; //subnet mask
EthernetServer server(80); //server port

#define CHAVE_1 2
#define CHAVE_2 4
#define CHAVE_3 7

#define PIN_RED 3
#define PIN_GREEN 6
#define PIN_BLUE 5
#define PIN_FEEDER 9

int MemSaveSaida1 = 1;
int MemSaveSaida2 = 2;
int MemSaveSaida3 = 3;
int MemSaveSaida4 = 4;

int ValueSaveSaida1 = 0;
int ValueSaveSaida2 = 0;
int ValueSaveSaida3 = 0;
int ValueSaveSaida4 = 0;

String readString;

//Convert normal decimal numbers to binary coded decimal
byte decToBcd(byte val)
{
  return ( (val/10*16) + (val%10) );
}

//Convert binary coded decimal to normal decimal numbers
byte bcdToDec(byte val)
{
  return ( (val/16*10) + (val%16) );
}

// 1) Sets the date and time on the ds1307
// 2) Starts the clock
// 3) Sets hour mode to 24 hour clock
// Assumes you're passing in valid numbers
void setDateDs1307(byte second,        // 0-59
                   byte minute,        // 0-59
                   byte hour,          // 1-23
                   byte dayOfWeek,     // 1-7
                   byte dayOfMonth,    // 1-28/29/30/31
                   byte month,         // 1-12
                   byte year)          // 0-99
{
   Wire.beginTransmission(DS1307_I2C_ADDRESS);
   Wire.write(0);
   Wire.write(decToBcd(second));    // 0 to bit 7 starts the clock
   Wire.write(decToBcd(minute));
   Wire.write(decToBcd(hour));      // If you want 12 hour am/pm you need to set
                                   // bit 6 (also need to change readDateDs1307)
   Wire.write(decToBcd(dayOfWeek));
   Wire.write(decToBcd(dayOfMonth));
   Wire.write(decToBcd(month));
   Wire.write(decToBcd(year));
   Wire.endTransmission();
}

// Gets the date and time from the ds1307
void getDateDs1307(byte *second,
          byte *minute,
          byte *hour,
          byte *dayOfWeek,
          byte *dayOfMonth,
          byte *month,
          byte *year)
{
  // Reset the register pointer
  Wire.beginTransmission(DS1307_I2C_ADDRESS);
  Wire.write(0);
  Wire.endTransmission();
  
  Wire.requestFrom(DS1307_I2C_ADDRESS, 7);

  // A few of these need masks because certain bits are control bits
  *second     = bcdToDec(Wire.read() & 0x7f);
  *minute     = bcdToDec(Wire.read());
  *hour       = bcdToDec(Wire.read() & 0x3f);  // Need to change this if 12 hour am/pm
  *dayOfWeek  = bcdToDec(Wire.read());
  *dayOfMonth = bcdToDec(Wire.read());
  *month      = bcdToDec(Wire.read());
  *year       = bcdToDec(Wire.read());
}


void setup(){
  
  wdt_enable(WDTO_8S); //Watchdog 8 Segundos
  
  byte second, minute, hour, dayOfWeek, dayOfMonth, month, year;
  Wire.begin();    

  Ethernet.begin(mac, ip, gateway, subnet);
  server.begin();
  Serial.begin(9600);

  //Setup Inicial / descomentar build / comentar
  //EEPROM.write(MemSaveSaida1, 0); 
  //EEPROM.write(MemSaveSaida2, 0);
  //EEPROM.write(MemSaveSaida3, 0);         
  //EEPROM.write(MemSaveSaida4, 0); 
 

  pinMode(A0, OUTPUT);
  pinMode(A1, OUTPUT);
  pinMode(A2, OUTPUT);
  pinMode(A3, OUTPUT);
  
  ValueSaveSaida1 = EEPROM.read(MemSaveSaida1);
  ValueSaveSaida2 = EEPROM.read(MemSaveSaida2);
  ValueSaveSaida3 = EEPROM.read(MemSaveSaida3);
  ValueSaveSaida4 = EEPROM.read(MemSaveSaida4);
 
  digitalWrite(A0, ValueSaveSaida1);
  digitalWrite(A1, ValueSaveSaida2);
  digitalWrite(A2, ValueSaveSaida3);
  digitalWrite(A3, ValueSaveSaida4);
 
  // Change these values to what you want to set your clock to.
  // You probably only want to set your clock once and then remove
  // the setDateDs1307 call.
  second = 00;
  minute = 8;
  hour = 22;
  dayOfWeek = 1;
  dayOfMonth = 1;
  month = 2;
  year = 15;
 // setDateDs1307(second, minute, hour, dayOfWeek, dayOfMonth, month, year);
 

}

void loop(){
  MostraData();  
  MostraTemp();
  WebServer();
}

void WebServer(){
 
  EthernetClient client = server.available();
  if (client) {
    while (client.connected()) {
      if (client.available()) {
        char c = client.read();

        //read char by char HTTP request
        if (readString.length() < 100) {

          //store characters to string
          readString += c;
          //Serial.print(c);
        }

        //if HTTP request has ended
        if (c == '\n') {

          Serial.println(readString);
        
          if(readString.indexOf("?S1Ligado") >0) {
            digitalWrite(A0, HIGH);
            EEPROM.write(MemSaveSaida1, 1);
          }
          if(readString.indexOf("?S1Desligado") >0) {
            digitalWrite(A0, LOW);
            EEPROM.write(MemSaveSaida1, 0);
          }

          if(readString.indexOf("?S2Ligado") >0) {
            digitalWrite(A1, HIGH);
            EEPROM.write(MemSaveSaida2, 1);
          }
          if(readString.indexOf("?S2Desligado") >0) {
            digitalWrite(A1, LOW);
            EEPROM.write(MemSaveSaida2, 0);
          }

          if(readString.indexOf("?S3Ligado") >0) {
            digitalWrite(A2, HIGH);
            EEPROM.write(MemSaveSaida3, 1);
          }
          if(readString.indexOf("?S3Desligado") >0) {
            digitalWrite(A2, LOW);
            EEPROM.write(MemSaveSaida3, 0);
          }

          if(readString.indexOf("?S4Ligado") >0) {
            digitalWrite(A3, HIGH);
            EEPROM.write(MemSaveSaida4, 1);
          }
          if(readString.indexOf("?S4Desligado") >0) {
            digitalWrite(A3, LOW);
            EEPROM.write(MemSaveSaida4, 0);
          }

          if(readString.indexOf("?red") >0) {
            analogWrite(PIN_RED, 255);
            analogWrite(PIN_GREEN, 0);             
            analogWrite(PIN_BLUE, 0);
          }

          if(readString.indexOf("?green") >0) {
            analogWrite(PIN_RED, 0);
            analogWrite(PIN_GREEN, 255);             
            analogWrite(PIN_BLUE, 0);
          }

          if(readString.indexOf("?blue") >0) {
            analogWrite(PIN_RED, 0);
            analogWrite(PIN_GREEN, 0);             
            analogWrite(PIN_BLUE, 255);
          }

          if(readString.indexOf("?white") >0) {
            analogWrite(PIN_RED, 255);
            analogWrite(PIN_GREEN, 255);             
            analogWrite(PIN_BLUE, 255);
          }


          if(readString.indexOf("?rgboff") >0) {
            analogWrite(PIN_RED, 0);
            analogWrite(PIN_GREEN, 0);             
            analogWrite(PIN_BLUE, 0);
          }
          
          if(readString.indexOf("?feed") >0) {
            Alimenta();
          }

         
         
          SendResponse(client);
          
          delay(1);
          //stopping client
          client.stop();

          //clearing string for next read
          readString="";

        }
      }
    }
  }
  wdt_reset(); //diReset WatchDog
}


void SendResponse(EthernetClient client){
  
   int S1 = digitalRead(A0);
          int S2 = digitalRead(A1);
          int S3 = digitalRead(A2);
          int S4 = digitalRead(A3); 

          int Chave1 = digitalRead(CHAVE_1); 
          int Chave2 = digitalRead(CHAVE_2); 
          int Chave3 = digitalRead(CHAVE_3); 

          int LedR = analogRead(6); 
          int LedG = analogRead(5); 
          int LedB = analogRead(3); 
          
  client.println(F("HTTP/1.1 200 OK")); //send new page
          client.println(F("Content-Type: text/html"));
          client.println();

          client.println(F("<HTML>"));
          client.println(F("<HEAD>"));
          client.println(F("<link href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css' rel='stylesheet'></link>"));
          client.println(F("</head>"));
          client.println(F("<body>"));
          client.println(F("<div class='jumbotron'>"));
          client.println(F("<h2>Interface de comando</h2>"));
          client.println(F("<div class='row'>"));
          client.println(F("<div class='col-md-10'>"));
          client.println(F("<table class='table table-bordered'>"));
          client.println(F("<tbody>"));
          //S 1
          client.println(F("<tr><td width=130px>S 1 - "));
          if(S1 == HIGH)
          {
            client.println(F("Ligado"));
            client.println(F("</td><td>"));
            client.println(F("<a class='btn btn-danger btn-lg' href='?S1Desligado'>Desligar</buttLigado>"));
          }
          else
          {
            client.println(F("Desligado"));
            client.println(F("</td><td>"));
            client.println(F("<a class='btn btn-success btn-lg' href='?S1Ligado'>Ligar</buttLigado>"));       
          }       
          client.println(F("</td></tr>"));


          //S 2
          client.println(F("<tr><td width=130px>S 2 - "));
          if(S2 == HIGH)
          {
            client.println(F("Ligado"));
            client.println(F("</td><td>"));
            client.println(F("<a class='btn btn-danger btn-lg' href='?S2Desligado'>Desligar</buttLigado>"));
          }
          else
          {
            client.println(F("Desligado"));
            client.println(F("</td><td>"));
            client.println(F("<a class='btn btn-success btn-lg' href='?S2Ligado'>Ligar</buttLigado>"));       
          }       
          client.println(F("</td></tr>"));


          //S 3
          client.println(F("<tr><td width=130px>S 3 - "));
          if(S3 == HIGH)
          {
            client.println(F("Ligado"));
            client.println(F("</td><td>"));
            client.println(F("<a class='btn btn-danger btn-lg' href='?S3Desligado'>Desligar</buttLigado>"));
          }
          else
          {
            client.println(F("Desligado"));
            client.println(F("</b></td><td>"));
            client.println(F("<a class='btn btn-success btn-lg' href='?S3Ligado'>Ligar</buttLigado>"));       
          }       
          client.println(F("</td></tr>"));


          //S 4
          client.println(F("<tr><td width=130px>S 4 - "));
          if(S4 == HIGH)
          {
            client.println(F("Ligado"));
            client.println(F("</td><td>"));
            client.println(F("<a class='btn btn-danger btn-lg' href='?S4Desligado'>Desligar</buttLigado>"));
          }
          else
          {
            client.println(F("Desligado"));
            client.println(F("</td><td>"));
            client.println(F("<a class='btn btn-success btn-lg' href='?S4Ligado'>Ligar</buttLigado>"));       
          }       
          client.println(F("</td></tr>"));


          //RGB
          client.println(F("<tr><td>RGB</td><td>"));
          client.println(F("<a class='btn btn-primary btn-lg' href='?blue' >Azul</a>&nbsp;"));
          client.println(F("<a class='btn btn-danger btn-lg' href='?red' >Vermelho</a>&nbsp;"));       
          client.println(F("<a class='btn btn-success btn-lg' href='?green' >Verde</a>&nbsp;"));       
          client.println(F("<a class='btn btn-default btn-lg' href='?white' >Branco</a>&nbsp;"));                   
          client.println(F("<a class='btn btn-link' href='?rgboff' >Desligar</a>&nbsp;"));                                                           
          client.println(F("</td></tr>"));


          //Alime
          client.println(F("<tr><td>Alimentador</td><td>"));
          client.println(F("<a class='btn btn-link' href='?feed'>Alimentar</a>&nbsp;"));                                                           
          client.println(F("</td></tr>"));



          client.println(F("<br>"));     
          client.println(F("<a class='btn btn-link' href='/'>Atualizar dados</a>"));                                                           
        
        
          client.println(F("</td></tr>")); 
        
   
          client.println(F("</tbody>"));
          client.println(F("</table>"));
          client.println(F("</div>"));

          client.println(F("</body>"));
          client.println(F("</html>")); 
  
}

void MostraData(){
    
  byte second, minute, hour, dayOfWeek, dayOfMonth, month, year;
  getDateDs1307(&second, &minute, &hour, &dayOfWeek, &dayOfMonth, &month, &year);      

  Serial.print(hour, DEC);
  Serial.print(":");
  Serial.print(minute, DEC);
  Serial.print(":");
  Serial.print(second, DEC);
  Serial.print("  ");
  Serial.print(dayOfMonth, DEC);
  Serial.print("/");
  Serial.print(month, DEC);
  Serial.print("/");
  Serial.println(year, DEC);
}


void MostraTemp() {
  byte i;
  byte present = 0;
  byte type_s;
  byte data[12];
  byte addr[8];
  float celsius;

  if ( !ds.search(addr)) {
    ds.reset_search();
    delay(250);
    return;
  }
  switch (addr[0]) {
    case 0x10:
      //Serial.println("  Chip = DS18S20");
      type_s = 1;
      break;
    case 0x28:
      //Serial.println("  Chip = DS18B20");
      type_s = 0;
      break;
    case 0x22:
      //Serial.println("  Chip = DS1822");
      type_s = 0;
      break;
    default:
      Serial.println("Device is not a DS18x20 family device.");
      return;
  } 

  ds.reset();
  ds.select(addr);
  ds.write(0x44);        // start conversion, use ds.write(0x44,1) with parasite power on at the end

  delay(1000);     // maybe 750ms is enough, maybe not
  // we might do a ds.depower() here, but the reset will take care of it.

  present = ds.reset();
  ds.select(addr);    
  ds.write(0xBE);    

  for ( i = 0; i < 9; i++) {
    data[i] = ds.read();
  }
  // Convert the data to actual temperature
  // because the result is a 16 bit signed integer, it should
  // be stored to an "int16_t" type, which is always 16 bits
  // even when compiled on a 32 bit processor.
  int16_t raw = (data[1] << 8) | data[0];
  if (type_s) {
    raw = raw << 3; // 9 bit resolution default
    if (data[7] == 0x10) {
      // "count remain" gives full 12 bit resolution
      raw = (raw & 0xFFF0) + 12 - data[6];
    }
  } else {
    byte cfg = (data[4] & 0x60);
    // at lower res, the low bits are undefined, so let's zero them
    if (cfg == 0x00) raw = raw & ~7;  // 9 bit resolution, 93.75 ms
    else if (cfg == 0x20) raw = raw & ~3; // 10 bit res, 187.5 ms
    else if (cfg == 0x40) raw = raw & ~1; // 11 bit res, 375 ms
    //// default is 12 bit resolution, 750 ms conversion time
  }
  celsius = (float)raw / 16.0;
  Serial.print("Temp= ");
  Serial.println(celsius);
}


void Alimenta()
{  
  
  myservo.attach(PIN_FEEDER);
  int angle = 0;
//  for(angle = 90; angle < 110; angle += 1)
  for(angle = 90; angle < 150; angle += 1)
  {                       
    myservo.write(angle); 
    delay(20);  
  }
  myservo.detach();   
  delay(300);  
//  BuzzerConfirma();
  Serial.print("Alimentacao OK");            

}

