var pos,i, marker, map, infowindow, clickLatitude, clickLongitude, codigoEscola;
var cidade, primeiraEscola, segundaEscola, JSONEscola1, JSONEscola2;
var escola = 0;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: {lat: -34.397, lng: 150.644},
    mapTypeId: google.maps.MapTypeId.SATELLITE 
  });
  infoWindow = new google.maps.InfoWindow({map: map});

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      infoWindow.setContent('Localizaçao atual');
      map.setCenter(pos);
      escolasMarker(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ? 'Erro: The Geolocation service failed.' : 'Error: Your browser doesn\'t support geolocation.');
}

function escolasMarker(pos){
  var req = new XMLHttpRequest();
  req.onloadend = function(){
    resp = req.responseText;
    
    if(resp == 0) {
      document.getElementById('erroAPI').click();
    }
    else{
        resp_obj = JSON.parse(resp);
        infowindow = new google.maps.InfoWindow({});

        for(i = 0; i < resp_obj.length; i++){
            marker = new google.maps.Marker({
            position: new google.maps.LatLng(resp_obj[i].latitude, resp_obj[i].longitude),
            title: resp_obj[i].nome,
            map: map
            });

            google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
              infowindow.setContent(resp_obj[i].nome + 
                '</br><a href="#modal1" id="clickCidade" onclick="createModal()">Ver Dados</a>' +
                '&nbsp;&nbsp;<a href="#" onclick="selectCompare()">Comparar</a>'
               );
              infowindow.open(map, marker);
              clickLatitude = resp_obj[i].latitude;
              clickLongitude = resp_obj[i].longitude;
              codigoEscola =  resp_obj[i].codEscola;
            }
          })(marker, i));
      } 
    }
  }
  req.open('GET', 'http://mobile-aceite.tcu.gov.br:80/nossaEscolaRS/rest/escolas/latitude/'+pos.lat+'/longitude/'+pos.lng+'/raio/100?quantidadeDeItens=100');
  req.send(null);
}


function createModal(){
  var req = new XMLHttpRequest();
  req.onloadend = function(){
    resp = req.responseText;

    if(resp == 0) {
      document.getElementById('erroAPI').click();
    }
    else{
      resp_obj = JSON.parse(resp); 

      var nome =  document.getElementById("nomeEscola");
      nome.innerHTML = resp_obj.nome;

      var rede =  document.getElementById("rede");
      rede.innerHTML = resp_obj.rede;

      var salas =  document.getElementById("salas");
      salas.innerHTML = resp_obj.qtdSalasExistentes;

      var situacao =  document.getElementById("situacao");
      situacao.innerHTML = resp_obj.situacaoFuncionamento;

      var computadores =  document.getElementById("computadores");
      computadores.innerHTML = resp_obj.qtdComputadoresPorAluno;

      var alunos =  document.getElementById("alunos");
      alunos.innerHTML = resp_obj.qtdAlunos;
   }
  }
  req.open('GET', 'http://mobile-aceite.tcu.gov.br:80/nossaEscolaRS/rest/escolas/'+codigoEscola);
  req.send(null);
}

function finalizar(){
  escolasMarker(pos);
}

function selectCompare(){
  escola++;
  if(escola == 1){
        document.getElementById('outraEscola').click();
        primeiraEscola = codigoEscola;
  }else{
    segundaEscola = codigoEscola; 
    reqComparacao();
    
  }
}

function reqComparacao(){
  dadosPrimeiraEscola(primeiraEscola);
  dadosSegundaEscola(segundaEscola);
  mediaIdebPrimeira(primeiraEscola);
  mediaIdebSegunda(segundaEscola);
  createModalComparacao();
  
}

function dadosPrimeiraEscola(primeira){
  var req = new XMLHttpRequest();
  req.onloadend = function(){
    resp = req.responseText;

    if(resp == 0) {
      document.getElementById('erroAPI').click();
    }
    else{
      resp_obj = JSON.parse(resp);

      var escola1 =  document.getElementById("escola1");
      escola1.innerHTML = resp_obj.nome;

      var rede =  document.getElementById("rede1");
      rede.innerHTML = resp_obj.rede;

      var salas =  document.getElementById("salas1");
      salas.innerHTML = resp_obj.qtdSalasExistentes;

      var situacao =  document.getElementById("situacao1");
      situacao.innerHTML = resp_obj.situacaoFuncionamento;

      var computadores =  document.getElementById("computadores1");
      computadores.innerHTML = resp_obj.qtdComputadoresPorAluno;

      var alunos =  document.getElementById("alunos1");
      alunos.innerHTML = resp_obj.qtdAlunos;
    }
  }
  req.open('GET', 'http://mobile-aceite.tcu.gov.br:80/nossaEscolaRS/rest/escolas/' + primeira);
  req.send(null);
}

function dadosSegundaEscola(segunda){
  var req = new XMLHttpRequest();
  req.onloadend = function(){
    resp = req.responseText;

    if(resp == 0) {
      document.getElementById('erroAPI').click();
    }
    else{
      resp_obj = JSON.parse(resp);

      var escola2 =  document.getElementById("escola2");
      escola2.innerHTML = resp_obj.nome;

      var rede =  document.getElementById("rede2");
      rede.innerHTML = resp_obj.rede;

      var salas =  document.getElementById("salas2");
      salas.innerHTML = resp_obj.qtdSalasExistentes;

      var situacao =  document.getElementById("situacao2");
      situacao.innerHTML = resp_obj.situacaoFuncionamento;

      var computadores =  document.getElementById("computadores2");
      computadores.innerHTML = resp_obj.qtdComputadoresPorAluno;

      var alunos =  document.getElementById("alunos2");
      alunos.innerHTML = resp_obj.qtdAlunos; 
    }
  }
  req.open('GET', 'http://mobile-aceite.tcu.gov.br:80/nossaEscolaRS/rest/escolas/' + segunda);
  req.send(null);
}

function mediaIdebPrimeira(primeira){
  var req = new XMLHttpRequest();
  req.onloadend = function(){
    resp = req.responseText;

    if(resp == 0) {
      document.getElementById('erroAPI').click();
    }
    else{
      resp_obj = JSON.parse(resp);

      var media =  document.getElementById("media1");
      media.innerHTML = resp_obj.media;
    }
  }
  req.open('GET', 'http://mobile-aceite.tcu.gov.br:80/nossaEscolaRS/rest/escolas/'+ primeira +'/avaliacoes/media');
  req.send(null);
}

function mediaIdebSegunda(segunda){
  var req = new XMLHttpRequest();
  req.onloadend = function(){
    resp = req.responseText;

    if(resp == 0) {
      document.getElementById('erroAPI').click();
    }
    else{
      resp_obj = JSON.parse(resp);

      var media =  document.getElementById("media2");
      media.innerHTML = resp_obj.media;
    }
  }
  req.open('GET', 'http://mobile-aceite.tcu.gov.br:80/nossaEscolaRS/rest/escolas/'+ segunda +'/avaliacoes/media');
  req.send(null);
}

function createModalComparacao(){
  escola = 0;
  $('#modal2').modal('open');
}

$(document).ready(function(){
   $(".button-collapse").sideNav();
   $('.tooltipped').tooltip({delay: 50});
   $('.modal').modal();
   $('.modal').modal({
     complete: function() { finalizar(); }
     });
});
