var ipArduino = 'http://186.220.99.147:8099';
//var ipArduino = 'http://192.168.0.201';

var dadosRecebidos;
var tipoAgendamento = "";

var ReportTemp, reportPH;
var dataTemperatura = new Array();
var dataPH = new Array();

function BuscaDados() {

    var call = $.ajax({
        url: ipArduino,
        dataType: 'jsonp',
        jsonpCallback: 'dataCB'
    })
    .done(function (data) {
        console.log(data);
        BindData(data);
        GravaLog();
        console.log("Busca dados executado com sucesso!");
    });
}

function BindData(data) {

    dadosRecebidos = data;

    $('#S1').removeClass('btn');
    $('#S1').removeClass('btn btn-success');
    $('#S1').removeClass('btn btn-danger');
    $('#S2').removeClass('btn');
    $('#S2').removeClass('btn btn-success');
    $('#S2').removeClass('btn btn-danger');
    $('#S3').removeClass('btn');
    $('#S3').removeClass('btn btn-success');
    $('#S3').removeClass('btn btn-danger');
    $('#S4').removeClass('btn');
    $('#S4').removeClass('btn btn-success');
    $('#S4').removeClass('btn btn-danger');

    $('#WHI').removeClass('btn');
    $('#WHI').removeClass('btn btn-success');
    $('#WHI').removeClass('btn btn-danger');
    $('#BLU').removeClass('btn');
    $('#BLU').removeClass('btn btn-success');
    $('#BLU').removeClass('btn btn-danger');
    $('#RED').removeClass('btn');
    $('#RED').removeClass('btn btn-success');
    $('#RED').removeClass('btn btn-danger');
    $('#GRE').removeClass('btn');
    $('#GRE').removeClass('btn btn-success');
    $('#GRE').removeClass('btn btn-danger');


    if (data.Auto == 1) {
        $("#rdModoA").prop("checked", true)
    }
    else {
        $("#rdModoM").prop("checked", true)
    }

    $("#DataHW").text(RetornaData() + " " + RetornaHora());
    $("#Temperatura").text(data.Temp);
    $("#PH").text(data.PH);

    console.log(data.NivelBaixo);

    if (data.NivelBaixo == 0) {
        $("#NivelBaixo").text("OK");
    }
    else {
        $("#NivelBaixo").text("Fora de nível");
    }

    console.log(data.NivelAlto);
    if (data.NivelAlto == 0) {
        $("#NivelAlto").text("OK");
    }
    else {
        $("#NivelAlto").text("Fora de nível");
    }

    if (data.S1 == 1) {
        $("#S1").html('Ligada');
        $('#S1').addClass('btn btn-success');
    }
    else {
        $("#S1").html('Desligada');
        $('#S1').addClass('btn btn-danger');
    }

    if (data.S2 == 1) {
        $("#S2").html('Ligada');
        $('#S2').addClass('btn btn-success');
    }
    else {
        $("#S2").html('Desligada');
        $('#S2').addClass('btn btn-danger');
    }

    if (data.S3 == 1) {
        $("#S3").html('Ligada');
        $('#S3').addClass('btn btn-success');
    }
    else {
        $("#S3").html('Desligada');
        $('#S3').addClass('btn btn-danger');
    }
    $("#AgeS3").text(data.AgeS3HrI + ":00 ate " + data.AgeS3HrF + ":59");

    if (data.S4 == 1) {
        $("#S4").html('Ligada');
        $('#S4').addClass('btn btn-success');
    }
    else {
        $("#S4").html('Desligada');
        $('#S4').addClass('btn btn-danger');
    }
    $("#AgeS4").text(data.AgeS4HrI + ":00 ate " + data.AgeS4HrF + ":59");


    if (data.Red == 255 && data.Green == 255 && data.Blue == 255) {
        $("#WHI").text("Ligada");
        $('#WHI').addClass('btn btn-success');
    }
    else {
        $("#WHI").text("DesLigada");
        $('#WHI').addClass('btn btn-danger');
    }

    if (data.Red == 0 && data.Green == 0 && data.Blue > 0) {
        $("#BLU").text("Ligada");
        $('#BLU').addClass('btn btn-success');
    }
    else {
        $("#BLU").text("DesLigada");
        $('#BLU').addClass('btn btn-danger');
    }

    if (data.Red > 0 && data.Green == 0 && data.Blue == 0) {
        $("#RED").text("Ligada");
        $('#RED').addClass('btn btn-success');
    }
    else {
        $("#RED").text("DesLigada");
        $('#RED').addClass('btn btn-danger');
    }

    if (data.Red == 0 && data.Green > 0 && data.Blue == 0) {
        $("#GRE").text("Ligada");
        $('#GRE').addClass('btn btn-success');
    }
    else {
        $("#GRE").text("DesLigada");
        $('#GRE').addClass('btn btn-danger');
    }

    $("#AgeRGBWHITE").text(data.AgeRGBWHITEHrI + ":00 ate " + data.AgeRGBWHITEHrF + ":59");
    $("#AgeRGBBLUE").text(data.AgeRGBBLUEHrI + ":00 ate " + data.AgeRGBBLUEHrF + ":59");
    $("#AgeFeed1").text(data.AgeFeed1 + ":00");
    $("#AgeFeed2").text(data.AgeFeed2 + ":00");

    HabilitaModo(data.Auto)

    HideLoading();
}
function EnviarComandoSaida(saida) {

    $("#icoExec" + saida).show();
    var statusAtual = $("#" + saida).html();
    var cmd = "?" + saida;
    if (statusAtual == "Ligada") {
        cmd += "D";
    }
    else {
        cmd += "L";
    }
    Enviar(cmd);
}

function EnviarComandoRGB(saida) {

    $("#icoExec" + saida).show();
    var statusAtual = $("#" + saida).html();
    var cmd = "?";
    if (statusAtual == "Ligada") {
        cmd += "RGBOFF";
    }
    else {
        cmd += saida;
    }
    Enviar(cmd);
}

function EnviarComando(saida) {
    $("#icoExec" + saida).show();
    Enviar("?" + saida);
}

function Enviar(comando) {

    var urlComando = ipArduino + comando;
    console.log(urlComando);

    var call = $.ajax({
        url: urlComando,
        dataType: 'jsonp',
        jsonpCallback: 'dataCB'
    })

        .done(function (data) {
            console.log(data);
            BindData(data);
            console.log("Comando enviado com sucesso!");

            if (comando == "?AUTOL" || comando == "?AUTOD") {
                //Rebind para busca de dados após ativação de modo
                console.log("Buscando novamente dados do modo Automatico")
                $('#icoExeAUTOL').show();
                BuscaDados();
            }
        });
}

function HabilitaModo(Modo) {
    if (Modo == 1) // automatico, desabilitar funcoes de agendamento com faixa de horário
    {
        $('#S1').prop('disabled', true);
        $('#S2').prop('disabled', true);
        $('#S3').prop('disabled', true);
        $('#S4').prop('disabled', true);
        $('#WHI').prop('disabled', true);
        $('#BLU').prop('disabled', true);
        $('#RED').prop('disabled', true);
        $('#GRE').prop('disabled', true);
    }
    else {
        $('#S1').prop('disabled', false);
        $('#S2').prop('disabled', false);
        $('#S3').prop('disabled', false);
        $('#S4').prop('disabled', false);
        $('#WHI').prop('disabled', false);
        $('#BLU').prop('disabled', false);
        $('#RED').prop('disabled', false);
        $('#GRE').prop('disabled', false);
    }
}


function MostraPopUpHorarioArduino(acao) {
    $('#modalHorarioArduino').modal('show')

    $("#modalHorarioArduinoTitle").text("Alterar Horario Equipamento");

    $("#DataArduino").val(RetornaData());
    $("#HoraArduino").val(RetornaHora());
}


function AlterarHorarioArduino() {

    var DataArduino = $("#DataArduino").val();
    var HoraArduino = $("#HoraArduino").val();
    var cmdIni = "?DataHora" + "y" + DataArduino + "yz" + HoraArduino + "z";
    Enviar(cmdIni);

    //BuscaDados();
    $('#modalHorarioArduino').modal('hide')

}

function MostraPopUpPeriodo(acao) {
    $('#modalPeriodo').modal('show')

    if (acao == "S3") {
        tipoAgendamento = "?AgeS3Hr";
        $("#modalPeriodoTitle").text("Agendamento Saida 3");
        $("#hrInicio").val(dadosRecebidos.AgeS3HrI);
        $("#hrFim").val(dadosRecebidos.AgeS3HrF);
    }
    else if (acao == "S4") {
        tipoAgendamento = "?AgeS4Hr";
        $("#modalPeriodoTitle").text("Agendamento Saida 4");
        $("#hrInicio").val(dadosRecebidos.AgeS4HrI);
        $("#hrFim").val(dadosRecebidos.AgeS4HrF);
    }
    else if (acao == "WHI") {
        tipoAgendamento = "?AgeRGBWHITEHr";
        $("#modalPeriodoTitle").text("Agendamento Saida RGB - White");
        $("#hrInicio").val(dadosRecebidos.AgeRGBWHITEHrI);
        $("#hrFim").val(dadosRecebidos.AgeRGBWHITEHrF);
    }
    else if (acao == "BLU") {
        tipoAgendamento = "?AgeRGBBLUEHr";
        $("#modalPeriodoTitle").text("Agendamento Saida RGB - Blue");
        $("#hrInicio").val(dadosRecebidos.AgeRGBBLUEHrI);
        $("#hrFim").val(dadosRecebidos.AgeRGBBLUEHrF);
    }
}

function AlterarPeriodo() {

    var horaInicio = $("#hrInicio").val();
    var horaFim = $("#hrFim").val();
    var cmdIni = tipoAgendamento + "I" + "y" + horaInicio + "y" + tipoAgendamento + "F" + "z" + horaFim + "z";
    Enviar(cmdIni);

    BuscaDados();

    $('#modalPeriodo').modal('hide')
}


function MostraPopUpHorario(acao) {

    $('#modalHorario').modal('show')
    if (acao == "FEE1") {
        tipoAgendamento = "?AgeFeed1";
        $("#modalHorarioTitle").text("Agendamento Alimentacao 1");
        $("#hrHorario").val(dadosRecebidos.AgeFeed1);
    }
    else if (acao == "FEE2") {
        tipoAgendamento = "?AgeFeed2";
        $("#modalHorarioTitle").text("Agendamento Alimentacao 2");
        $("#hrHorario").val(dadosRecebidos.AgeFeed2);
    }
}

function AlterarHorario() {
    var hora = $("#hrHorario").val();
    var cmdHr = tipoAgendamento + "y" + hora + "y";
    Enviar(cmdHr);
    $('#modalHorario').modal('hide');
}

function HideLoading() {

    $('#icoExeAUTOL').hide();
    $('#icoExeAUTOD').hide();

    $('#icoExecS1').hide();
    $('#icoExecS2').hide();
    $('#icoExecS3').hide();
    $('#icoExecS4').hide();

    $('#icoExecWHI').hide();
    $('#icoExecBLU').hide();
    $('#icoExecRED').hide();
    $('#icoExecGRE').hide();
    $('#icoExecFEE1').hide();
    $('#icoExecFEE2').hide();
    $('#icoExecPHC').hide();
}


function CriaBancoRelatorio() {

    if (window.openDatabase) {

        var db = openDatabase('AquadroidReport', '1.0', 'Banco Aquadroid', 2 * 1024 * 1024);
        if (!db) {
            alert('Seu browser não suporta WebSql Database !');
        }
        else {
            db.transaction(function (tx) {
                tx.executeSql('CREATE TABLE IF NOT EXISTS DataLog (id INTEGER PRIMARY KEY ASC, Data TEXT, Temperatura TEXT, PH TEXT)');
                //  tx.executeSql('DROP TABLE DataLog');
            });
        }
    }
    else {
        alert('Seu browser não suporta WebSql Database !');
    }

}

function GravaLog() {

    if (window.openDatabase) {

        var db = openDatabase('AquadroidReport', '1.0', 'Banco Aquadroid', 2 * 1024 * 1024);
        if (db) {
            //dadosRecebidos.Temp, dadosRecebidos.PH
            db.transaction(function (tx) {
                tx.executeSql("INSERT INTO DataLog (Data, Temperatura, PH) values (?, ?, ?)", [new Date(), '1', '2'])
            });
        }
    }

}




function RetornaData() {

    var data = "";

    if (dadosRecebidos.Day < 10) {
        data = "0" + dadosRecebidos.Day + "/";
    }
    else {
        data = dadosRecebidos.Day + "/";
    }

    if (dadosRecebidos.Mounth < 10) {
        data += "0" + dadosRecebidos.Mounth + "/";
    }
    else {
        data += dadosRecebidos.Mounth + "/";
    }
    data += "20" + dadosRecebidos.Year;

    return data;
}

function RetornaHora() {

    var hora = "";

    if (dadosRecebidos.Hour < 10) {
        hora = "0" + dadosRecebidos.Hour + ":";
    }
    else {
        hora = dadosRecebidos.Hour + ":";
    }

    if (dadosRecebidos.Minute < 10) {
        hora += "0" + dadosRecebidos.Minute + ":";
    }
    else {
        hora += dadosRecebidos.Minute + ":";
    }

    if (dadosRecebidos.Second < 10) {
        hora += "0" + dadosRecebidos.Second;
    }
    else {
        hora += dadosRecebidos.Second;
    }

    return hora;

}



function MostraRelatorios() {
    var db = openDatabase('AquadroidReport', '1.0', 'Banco Aquadroid', 2 * 1024 * 1024);
    if (!db) {
        alert('Seu browser não suporta WebSql Database !');
    }
    else {
        db.transaction(function (transaction) {
            transaction.executeSql(
                "SELECT * FROM DataLog order by id DESC",
                null,
                function (transaction, result) {
                    for (var i = 0; i < result.rows.length; i++) {
                        // console.log(result.rows.item(i)[['Data']]);
                        // console.log(result.rows.item(i)[['Temperatura']]);
                        // console.log(result.rows.item(i)[['PH']]);

                        var date = new Date(result.rows.item(i)[['Data']]);
                        dataTemperatura.push([date, result.rows.item(i)[['Temperatura']]]);
                        dataPH.push([date, result.rows.item(i)[['PH']]]);

                    }


                    console.log(dataTemperatura);
                    console.log(dataPH);
                    MostraRelatorioTemperatura();
                    MostraRelatorioPH();


                },
                function (transaction, error) {
                    console.log('Erro durante busca de dados para o relatorio!');
                    console.log(error);
                }
            );
        });
    }
}


function MostraRelatorioTemperatura() {

    ReportTemp = $.jqplot('divTemperatura', [dataTemperatura], {
        title: 'Temperatura',
        axes: {
            xaxis: {
                renderer: $.jqplot.DateAxisRenderer,
                tickOptions: {
                    formatString: '%H:%M:%S'
                },
                tickInterval: 30
            },
            yaxis: {
                min: 0,
                max: 30,
                tickInterval: 5
            }
        }
    });

}
function MostraRelatorioPH() {
    reportPH = $.jqplot('divPH', [dataPH], {
        title: 'PH',
        axes: {
            xaxis: {
                renderer: $.jqplot.DateAxisRenderer,
                tickOptions: {
                    formatString: '%H:%M:%S'
                },
                tickInterval: 30
            },
            yaxis: {
                min: 0,
                max: 12,
                tickInterval: 10
            }
        }
    });
}

function BuscaDadosatualizados() {

    var leituraTemperatura;
    var leituraPH;
    var gotData = false;

    var jqxhr = $.ajax({
        url: ipArduino,
        dataType: 'jsonp',
        jsonpCallback: 'dataCB'
    })

        .done(function (data) {
            leituraTemperatura = data.Temperatura;
            leituraPH = data.PH;
        })

        .fail(function () {
            console.log("Erro durante busca de dados");
        });
}

function AtualizaTemperatura() {

    var x = (new Date()).getTime();

    if (dataTemperatura.length == 10) dataTemperatura.shift();

    dataTemperatura.push([x, leituraTemperatura]);
    ReportTemp.series[0].data = dataTemperatura;

    ReportTemp.resetAxesScale();

    ReportTemp.axes.xaxis.tickInterval = 30;
    ReportTemp.axes.yaxis.min = 0;
    ReportTemp.axes.yaxis.max = 30;

    ReportTemp.replot();
}

function AtualizaPH() {

    var x = (new Date()).getTime();

    if (dataPH.length == 10) dataPH.shift();

    dataPH.push([x, leituraPH]);

    reportPH.series[0].data = dataPH;

    reportPH.resetAxesScale();

    reportPH.axes.xaxis.tickInterval = 30;
    reportPH.axes.yaxis.min = 0;
    reportPH.axes.yaxis.max = 100;

    reportPH.replot();
}