

Hoje vou apresentar um novo projeto para automação de aquários de água doce com a placa Automation Shield. Já fizemos um projeto de automação no post http://www.automacaolivre.com.br/2013/06/aquadroid-monitorando-um-aquario-com.html com LCD para apresentação dos dados e teclado para acesso as funcionalidades. A vantagem do novo projeto é a troca do LCD e teclado por uma interface gráfica que realiza o acesso, monitoramento e agendamento remoto.

<br>
O projeto permite automação de aquários marinhos, mas de forma limitada. Projetos com monitoramento e controle simultâneos de PH, ORP, Densidade, Temperatura, Nível e TPA automático exigem mais recursos de hardware e software, devendo usar como base um Arduino com mais recursos, como um Arduino Mega e uma expansão PCF8575. 

<br>
Funcionalidades do Projeto
4 Saídas com Relés para acionamento de Bomba, Termostato, Luz Fluorecente e outro dispositivo opcional.
Iluminação RGB para criação de efeito noturno.
Leitura de Temperatura.
Leitura de PH.
Sensor de nível baixo de água .
Sensor de nível alto de água .
Alimentador automático.
Alarme de Temperatura, PH e Níveis de água fora da faixa estabelecida.
Programação de horários de acionamento de saídas.
Programação de horários de acionamento de iluminação.
Programação de horários de alimentação.
Interface HTML5 para acompanhamento dos parâmetros do aquário, alteração entre modos manual e automático, acionamento remoto de saídas e iluminação.
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
O projeto utiliza todos os recursos de Hardware e Software do "AutomationShield / Arduino Nano V3". Não é obrigátoria a construção do projeto com todas as funcionalidades propostas acima, a implementação pode ser feita de forma parcial e progressiva, mas um ponto de atenção é a integração com novos componentes ou shields. O projeto utiliza todas as IOs do Arduino Nano, restando apenas o pino A7. Adição de novas funcinalidades exigirá substituição de algum componente e análise de compatibilidade de recursos de IO e memória diponível.

<br>
Lista de componentes 
1 - Arduino NANO V3.0.
1 - Placa Automation Shield, a venda em nossa loja virtual.
1 - Fonte industrial 12V x 3A (5A dependendo do consumo da faixa RGB utilizada).
1 - RTC DS1307.
1 - Shield Ethernet W5100, Atenção NÃO É compátivel o shield enc28j60.
1 - Buzzer 5V.
1 - Fita de Leds RGB com base de acrílico para sustentação, o ideal é usar 2 ou 3 faixas RGB com o comprimento do aquário. 
1 - pH Sensor Kit, no projeto foi utilizado https://www.sparkfun.com/products/10972.
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






<br>
Programando e testando o Hardware
<br>
a primeira dica para inicio dos testes do projeto é testar de forma isolada as configurações do shield de Ethernet. Um bom teste é o post http://www.automacaolivre.com.br/2015/02/automation-shield-webserver-com-ws5100.html, prossiga apenas após realizar os testes com sucesso.


<br>
A integração entre o equipamento e a interface gráfica de monitoramento será feita através de uma API REST, com ela será possível visualizar os estados de todas as funções do equipamento, acionar as saídas e alterar as rotinas de agendamento remotamente. A proposta de uso da API REST permite a criação de outros aplicativos nativos de acordo com o sistema operacional escolhido pelo usuário, conforme definição abaixo:

http://IP/

API REST - Retorno de Dados
dataCB({
"Auto":"1"   			-> Indica se está executando no modo automático (1) ou Manual (0)
,"Temp":"27.3125000000" -> Temperatura
,"PH":"7" 				-> PH
,"Data":"17/2/15"		-> Data
,"Hora":"17:27:25"		-> Data
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
})

Pendente
Alterar agendamento de Feed
Retornar PH
Mostrar PH
Alarme por faixas
Preconfigurar Faixas


API REST - Acionamento de funções




API REST - Alteração de agendamentos pré-programados



O programa é dividido em 6 métodos principais:
BuscaData: Atualiza as varíaveis globais de data e hora com o horário atual fornecido pelo RTC.
BuscaTemp: Atualiza a varíavel de temperatura fornecido pelo Ds18b20.
BuscaPH:  Atualiza a varíavel de pH fornecido pela sonda de pH.
WebServer: Recebe as requisições HTTP da interface gráfica para acionamento das saídas, agendamento e retorna o JSON com os dados atualizados do sistema.
ModoAutomatico: Executa as ações de acionamento de saídas de acordo com os horários pré-programados.
Alarme: Dispara o alarme sonoro de acordo com as faixas pré-configuradas de ph, temperatura e nível de agua.


Sempte desconecte qualquer Shield que esteja conectado as portas seriais do Arduino antes do Upload. As mesma porta serial é compartilhada entre o USB para a gravação do Arduino e da comunicação serial do Arduino, que no projeto está sendo usado para interface da sonda pH.

WatchDog e EEPROM
No projeto foi habilitado o WatchDog, a função dele é reiniciar o arduino se o programa que estiver em execução travar. No setup habilitamos ele com o método XXXX e a cada loop reiniciamos seu contador interno com o método XYZ, se o contador não for reiniciado, ele automaticamente reinicia o Arduino. Em conjunto com o WatchDog, todas as ações e configurações realizadas pelo usuário são gravadas na EEPROM, dessa forma, se o arduino travar, reinicar ou ocorrer uma interrupção de energia, ele reestabelecerá os estados de todas as saídas de acordo com a última solicitação do usuário. 
 
Imagem setup


Imagem loop


Imagem WebServer

Imagem Modulo automatico

Imagem Alarme



Testando o hardware
O primeiro teste é consumir a API REST que retorna os dados atualizados do sistema. Conecte o cabo de rede no shield de Ethernet e abra em um navegador o IP da placa.

Imagem IP

Se as configurações e conexões estiverem corretas, será apresentada a entrutura JSONP dos dados do sistema.

Imagem navegador JSON



O próximo passo é testar o acionamento das saidas conforme exemplo abaixo:
Imagem api acionamento


Pronto, temos nosso hardware montando, configurado e testado. NO último post da série vamos montar a interface gráfica de acesso ao sistema



<br>



<br>
Interface gráfica e testes finais de acesso ao sistema
<br>
A Interface gráfica de acesso ao sistema é uma página Html5. O principal objetivo dessa abordagem é a facilidade de portabilidade e execução em multiplos dispositivos, como Windows, Linux, Mac OS e celulares com Android, Windows Mobile, iOS, desde que rode em um navegador com suporte para HTML5.

<br>
Para executar, copie os dois arquivos html e abra o arquivo aquadroid.html no browser. Os arquivos HTML dividem as funcionalidades em uma interface grafica, que monitora e apresenta os dados do aquário em tempo real e a ferramenta de setup, que permite visualizar e alterar as saidas e agendamentos. Para simplificar a distribuição, ambos arquivos dependem de arquivos de script, css e imagens hospedadas em servidores CDN, dessa forma, a conexão com internet é obrigatória, mesmo que o acesso ao Hardware seja feito em uma rede local. Os arquivos podem ser baixados localmente para não depender de acesso externo.
<br>

Página de monitoramento





Página de setup



<br>
Configurando o roteador para acesso externo
<br>
Meu roteador é fornecido pela net é um CISCO DPC3925, o roteiro será seguido com ele, mas basaicamente todos os roteadores tem a mesma função.


Testes dos sistema
