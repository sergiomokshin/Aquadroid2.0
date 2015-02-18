

Hoje vou apresentar a configuração básica de um novo projeto para automação de aquários de água doce, que podem ser montados com a placa Automação Livre Shield. O projeto permite automação de aquários marinhos, mas de forma limitada. Projetos com monitoramento e controle simultâneos de PH, ORP, Densidade, Temperatura, Nível e TPA automático devem usar um controlador com mais recursos, como um Arduino Mega e uma expansão PCF8575. Futuramente iremos publicar novos projetos, com uma nova placa controladora para atender essas características.
<br>

Funcionalidades do Projeto

Programação de acionamento de saídas -> Saida 3 e Saída 4
Programação de iluminação RGB -> Luz Branca e Luz Azul
Leitura de Temperatura
Leitura de PH
Alimentador automático
Alarme ?????
Sensor de nível de água
Aplicativo Android para acompanhamento dos parâmetros do aquário, alteração entre modos manual e automático, acionamento remoto de saídas e iluminação.

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
Montagem do Hardware
<br>

<br>

<br>
Programando e testando o Hardware
<br>
a primeira dica para inicio do projeto é testar de forma isolada as configurações do shield de Ethernet. Um bom teste é o post http://www.automacaolivre.com.br/2015/02/automation-shield-webserver-com-ws5100.html, apenas após configurações e testes com o projeto iniciem as demais conexões.

<br>
A integração entre 





Leiam o post XXX, ele explica 2 aspectos básicos para o projeto, Persistencia de ações em EEPROM e WachDog
<br>

<br>
Interface de Acesso ao sistema
<br>
A proposta de implementar a aplicação com Html5 é a portabilidade em qualquer dispositivo. Inicialmente foi pensando em implementar em Android nativo, mas com o Html5 ela pode ser executada em sistemas operacionais como Windows, Linux, Mac OS e celulares com Android, Windows Mobile, iOS.
<br>
Para executar, basta apenas copiar o arquivo html e abrir no browser. Temos dois arquivos  HTML, a interface grafica, que monitora e apresenta os dados do aquário em tempo real e o aqruivo de setup, que permite visualizar e alterar as saidas e agendamentos. Para simplifica a distribuição, ambosarquivos dependem de arquivos de script, css e imagens hospedadas, dessa forma, a conexão com internet é obrigatória, mesmo que acessando o Hardware em uma rede local. 
<br>
As configurações de Agendamento, Horários, Ultimas ações realizadas pelo usuário ficam salvam na memória EEPROM do arduino nano, dessa forma, se o arduino travar, reiniciar, ocorrer alguma interrupção de energia, ele sempre manterá os estados das saídas de acordo com a última definição do usuário.
<br>
Configurando o roteador para acesso externo
<br>
Meu roteador é fornecido pela net é um CISCO DPC3925, o roteiro será seguido com ele, mas basaicamente todos os roteadores tem a mesma função.
