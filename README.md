
Hoje vou apresentar um novo projeto para automação de aquários de água doce. Já fizemos um projeto de automação no post http://www.automacaolivre.com.br/2013/06/aquadroid-monitorando-um-aquario-com.html com LCD para apresentação dos dados e teclado para acesso as funcionalidades. A vantagem do novo projeto é a troca do LCD e teclado numérico por uma interface gráfica que realiza o acesso, monitoramento e agendamento de forma remota.


Equipamento



Painel de comando



Exemplos de algumas funcionalidades
Acionamento de saida



Agendamento de acionamento de saída




Agendamento de Iluminação



Acionamento de alimentação



Adendamento Iluminação Noturna  -> 4hs


Calibração de PH


Acionamento Luz Azul


Ajuste de data



Alarme

<br>


<br>
Funcionalidades do Projeto
-4 Saídas com Relés para acionamento de Bomba, Termostato, Luz Fluorecente e outro dispositivo opcional.
-Iluminação RGB para criação de efeito noturno.
-Leitura de Temperatura.
-Leitura de PH.
-Sensor de nível baixo de água.
-Sensor de nível alto de água.
-Alimentador automático.
-Alarme de Temperatura, PH e Níveis de água fora da faixa estabelecida.
-Modo de operação Automático e Manual
-Programação de horários de acionamento de saídas.
-Programação de horários de acionamento de iluminação.
-Programação de horários de alimentação.
-Ajuste de horário via ferramenta de setup.
-Interface HTML5 para acompanhamento dos parâmetros do aquário, alteração entre modos manual e automático, acionamento remoto de saídas e iluminação.

<br>

Conexões do Projeto

Digital
0TX        PH
1RX        PH
2          Temp
3P         RGB Red
4          Sensor de nível Baixo
5P         RGB Green
P6         RGB Blue
7          Sensor de nível Alto
8          Buzzer (Alarme)
9P         Alimentador PWM
10P        ETHERNET
11P        ETHERNET
12         ETHERNET
13         ETHERNET                         
<br>
Analog
0          S1 Saída Relé
1          S2 Saída Relé
2          S3 Saída Relé
3          S4 Saída Relé
4          RTC
5          RTC
6          Status do equipamento (LED)
7             

<br>

Leitura PH
Não consegui 100% de sucesso na aferição em todas as leituras com a sonda pH, foram realizados testes seguindo toda a especificação do fabricante e do projeto https://github.com/sparkfun/H2O_pH_Probe desenvolvido pela SparkFun. Como o conjunto Sonda + Interface tem um custo alto, acompanhe a evolução do projeto e divulgação de novos testes antes de efetuar a compra.


Alimentador
Estou desenvolvendo com a impressora 3D um Alimentador automático para integração com o Aquadroid. Seu estágio atual está com uma boa perfomance com alimentos granulares, mas será desenvolvida uma nova estrutura para alimentos em flocos ou em grãos maiores.


<br>
Lista de componentes 
1 - Arduino NANO V3.0.
1 - Placa Automation Shield, a venda em nossa loja virtual.
1 - Fonte industrial 12V x 3A (5A dependendo do consumo da faixa RGB utilizada).
1 - RTC DS1307.
1 - Shield Ethernet W5100, Atenção NÃO É compátivel com o projeto o shield enc28j60.
1 - Buzzer 5V.
1 - Fita de Leds RGB com base de acrílico para sustentação, o ideal é usar 2 ou 3 faixas RGB com o comprimento do aquário. 
1 - pH Sensor Kit, no projeto foi utilizado https://www.sparkfun.com/products/10972. -> Em ajustes finos.
1 - Sensor De Temperatura Ds18b20 com cabo.
1 - Resistor 4K7.
3 - *Dissipadores  - Opcional, depende da carga utilizada na saída de Potência. Não foi necessário com carga de faixas RGB com até 2mts.

Montagem da caixa
1 - Caixa modelo HSXYZ ou equivalente. A caixa deve possuir um volume mínimo interno de 25(largura) x 20(comprimento) x 10(altura) para montagem do projeto.
1 - Cabos com conectores MODU para conexão entre os Shields.
1 - Fios para conexão entre os relés, chaves e demais componentes dentro da caixa.
3 - Cabo manga para o rabicho da iluminação RGB, Nivel de Agua e Alimentador
4 - Tomada fêmea AC para painel.
1 - Tomada macho 3 pinos AC para rabicho de alimentação.
4 - Conjunto conectores macho e femea DIM para Iluminação RGB, Temperatura, leitura de níveis de água e alimentador.
1 - Chave Liga desliga.
1 - Porta fusível com fusível 20A para painel.
1 - Led 5mm com suporte para painel.
1 - Resitor 1K 1/8w.
1 - Conector BNC macho para sonda pH. 

<br>
Alimentador
1- Kit de alimentador
1- Servo 5Kg adaptado para rotação contínua
1- LM7805 
<br>

<br>

Separando os componentes





Iniciando a montagem



Furando a caixa



Colocando a identidade visual



Montagem finalizada



<br>
Código Fonte Arduino
<br>
Uma dica para início dos testes do projeto é testar de forma isolada as configurações do shield de Ethernet. Um bom teste inicial é o post http://www.automacaolivre.com.br/2015/02/automation-shield-webserver-com-ws5100.html, prossiga apenas após o  sucesso nos testes de envio de comandos.


<br>
A integração entre o equipamento e a interface gráfica de monitoramento será feita através de uma API REST, com ela será possível visualizar os estados de todas as funções do equipamento, acionar as saídas e alterar as rotinas de agendamento remotamente. A proposta de uso da API REST permite a criação de outros aplicativos nativos, de acordo com o sistema operacional escolhido pelo usuário.

http://IP/

API REST - Retorno de Dados
dataCB({
"Auto":"1"   			-> Indica se está executando no modo automático (1) ou Manual (0)
,"Temp":"27.3125000000" -> Temperatura
,"PH":"7" 				-> PH
,"Day":22				-> Dia
,"Mounth":2				-> Mes
,"Year":15				-> Ano
,"Hour":20				-> Hora
,"Minute":27			-> Minuto
,"Second":17			-> Segundo
,"S1":1					-> Estado da Saida 1  Ligado (1) ou Desligado (0)
,"S2":0					-> Estado da Saida 2  Ligado (1) ou Desligado (0)
,"S3":0					-> Estado da Saida 3  Ligado (1) ou Desligado (0)
,"S4":0					-> Estado da Saida 4  Ligado (1) ou Desligado (0)
,"NivelBaixo":0 		-> Estado da Nivel Baixo Alarme (1) ou OK (0)
,"NivelAlto":0 			-> Estado da Nivel Baixo Alarme (1) ou OK (0)
,"AgeS3HrI":9 			-> Horario inicio agendamento acionamento Saída 3
,"AgeS3HrF":16 			-> Horario fim agendamento acionamento Saída 3
,"AgeS4HrI":0 			-> Horario fim agendamento acionamento Saída 4
,"AgeS4HrF":0 			-> Horario inicio agendamento acionamento Saída 4
,"AgeRGBWHITEHrI":17 	-> Horario inicio agendamento faixa RGB na cor Branca
,"AgeRGBWHITEHrF":18 	-> Horario fim agendamento faixa RGB na cor Branca
,"AgeRGBBLUEHrI":19 	-> Horario inicio agendamento faixa RGB na cor Azul
,"AgeRGBBLUEHrF":22 	-> Horario fim agendamento faixa RGB na cor Azul
,"AgeFeed1":10 			-> Horario primeira Alimentacao
,"AgeFeed2":19 			-> Horario segunda Alimentacao
,"Red":0 				-> Luminosidade Fixa RGB RED (0- Desligado 255- Máximo)
,"Green":0 				-> Luminosidade Fixa RGB Green (0- Desligado 255- Máximo)
,"Blue":255 			-> Luminosidade Fixa RGB Blue (0- Desligado 255- Máximo)
})

Pendente
Alarme por faixas
Preconfigurar Faixas
Corrigir ajuste de segundo

O programa é dividido em 6 métodos principais:
getDateDs1307: Atualiza as varíaveis globais de data e hora com o horário atual fornecido pelo RTC.
GetTemp: Atualiza a varíavel de temperatura fornecido pelo Ds18b20.
GetPH:  Atualiza a varíavel de pH fornecido pela sonda de pH.
WebServer: Recebe as requisições HTTP da interface gráfica para acionamento das saídas, agendamento e retorna o JSON com os dados atualizados do sistema.
ModoAuto: Executa as ações de acionamento de saídas de acordo com os horários pré-programados.
Alarme: Dispara o alarme sonoro de acordo com as faixas pré-configuradas de ph, temperatura e nível de água.


Sempre desconecte qualquer Shield que esteja conectado com a porta serial do Arduino antes de realizar o Upload. As porta serial é compartilhada entre o USB para a gravação do Arduino Nano e comunicação serial do Arduino com outros shields. No projeto usamos a conexão serial para interface de integração com a sonda pH, se a mesma estiver conectada ocorrerá um conflito e erro durante o processo de Upload.



WatchDog e EEPROM
No projeto foi habilitado o WatchDog. Sua função é reiniciar o Arduino se o programa que estiver em execução travar. No setup habilitamos com o método wdt_enable(WDTO_8S) um timeout de 8s, e a cada loop reiniciamos seu contador interno com o método wdt_reset(). Se o contador não for reiniciado em 8 segundos, ele automaticamente reiniciará o Arduino. Mas como ficam as últimas ações enviadas pelo usuário? Todas as ações e configurações realizadas pelo usuário são gravadas na EEPROM (Memória não vólatil, que não perde os dados por falta de energia ou reinicialização), dessa forma, se o arduino travar, reinicar ou ocorrer uma interrupção de energia, ele reestabelecerá os estados de todas as saídas e agedamentos de acordo com a última solicitação do usuário. 
 
Imagem setup arduino


Imagem loop



Imagem WebServer



Imagem Modulo automatico



Imagem Alarme


Código Fonte


Primeiros testes
O primeiro teste é consumir a API REST que retorna os dados atualizados do sistema. Conecte o cabo de rede no shield de Ethernet e abra em um navegador o IP da placa.

Imagem IP do codigo do arduino Nano

Se as configurações e conexões estiverem corretas, serão apresentados os dados do sistema em um formato Json.

Imagem navegador JSON



O próximo passo é testar o acionamento da saida S1, executando a API com o comando "http:\\192.168.0.201\?S1L" conforme exemplo abaixo:



Imagem api acionamento



<br>

<br>
Interface gráfica e testes finais de acesso ao sistema
<br>
A Interface gráfica de acesso ao sistema é uma interface Html5. O principal objetivo dessa abordagem é a facilidade inicial de portabilidade e execução em multiplos dispositivos, como Windows, Linux, e celulares com Android, desde que rode em um navegador com suporte para HTML5. O equipamento deve ter uma resolução mínima de 640x480. 


Devido a restrições de acesso do iOS ao sistema de arquivos do dispositivo, o projeto abaixo não é compátivel com iPhone/iPad, sendo necessária a criação de uma aplicativo nativo que integre com as APIs do projeto. Uma alternativa é hospedar os arquivos html em um servidor com WebServer Apache, IIS, entre outros e realizar o acesso pelo iPhone/iPad.


Configurações:
Abra o arquivo aquadroid.js e configure a variável IP com o IP que foi configurado no arduino ou IP e Porta configurada no roteador. Eu configurei meu roteador para acesso externo ao IP do equipamento, dessa forma, eu acesso o painel do meu trabalho, na rua, durante viagens, etc. Para aumento de segurança de acesso, pode ser criada uma VPN em sua rede doméstica, de forma que o acesso ao IP do equipamento seja apenas permitido em conexões realizadas dentro de sua rede local. Roteadores como o XXXX, permitem a criação de uma VPN.


Imagem roteador


Imagem Configuração variavel


<br>
Executando o painel no Desktop:
Abra no browser o arquivo painel.html, você deverá visualizar o painel com os dados atualizados do equipamento.

Imagem Painel Computador



Imagem Relatorios



Imagem Setup Computador


Executando o painel em dispositivos Android:
Copie a pasta do projeto descompactada na área de arquivos do Android, nesse momento será necessário anotar o caminho completo até o arquivo Painel.html, se tiver dificuldade, use o aplicativo "ES File Explorer" para copiar o caminho completo. 

Caminho

Imagem ferramenta Path


Abra o arquivo com o caminho completo em um navegador. Eu utilizo navegador UCBrowser, a vantagem dele é abrir o painel no modo fullscreen. 


Painel de Monitoramento




Página de setup




Vídeo do sistema.





O código fonte é open source e está publicado no meu GitHub XYX. O projeto está em constante evolução, aceitando sugestões e críticas. 


O projeto nessa versão permite automação de aquários marinhos, mas de forma limitada. Projetos com monitoramento e controle simultâneos de PH, ORP, Densidade, Temperatura, Nível, TPA automático e outras funcionalidades exigem mais recursos de hardware e software, devendo usar como base um Arduino com mais recursos, como um Arduino Mega e uma expansão PCF8575.  A placa Automation Shield é compatível com o Arduino Mega, mas ela não possui conectores para conexão direta, sendo necessária a remoção do Arduino Nano e a conexão com o Arduino Mega por Jumpers (D3-P1, D5-P2, D6-P3, A0-S1, A1-S2, A2-S3,A3-S4 Power IN - 9V e GND-GND).


Conexões do projeto para Arduino Mega






Vídeo do projeto em funcionamento na bancada







Abs

----------------
A placa Automation Shield permite a conexão com outras versões do Arduino.


Conexões do Projeto






Serão usados 9 jumpers para conexão  “Arduino Mega – Automation Shield”. 
D3-P1
D5-P2
D6-P3
A0-S1
A1-S2
A2-S3 
A3-S4
GND-GND
Vin– 9V


Fotos da conexão





Os jumpers que conectam no Arduino Mega e o Jumper de PowerInput  usam um pino Macho de uma barra de terminais.
Foto Jumper com terminal





Código Fonte






Vídeo de testes






A substituição do Arduino Nano pelo Arduino Mega permite a criação de projetos que necessitam de mais recursos de Software e Hardware. A placa Automation Shield incorpora funcionalidades úteis como alimentação regulada 9V para o Arduino, barra de terminais para alimentação 5V de outros Shields, saídas com relés, potência DC entre outros.


 
         
