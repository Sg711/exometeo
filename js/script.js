// Fonction permettant d'appliquer un overlay avec une icône de chargement sur toute la page
function setOverlay(){
    $('body').append(`
        <div class="overlay"><img src="img/ajax-loader.svg"></div>
    `);
}

// Fonction permettant de supprimer l'overlay appliqué par la fonction précédente
function removeOverlay(){
    $('.overlay').remove();
}

// Si le bouton est cliqué
$('button').click(function(){

    // Options de la geolocalisation
    let options = {
        enableHighAccuracy: true,       // Activation de la haute précision
        timeout: 5000,                  // Temps en ms avant timeout
        maximumAge: 0                   // Desactive le cache gps
    }

    // Fonction qui sera appelée si la localisation n'a pas pu être récupérée (e.code contient le code de l'erreur)
    let error = function(e){
        if(e.code == e.TIMEOUT){
            alert('Temps expiré')
        } else if(e.code == e.PERMISSION_DENIED){
            alert('Vous avez refusé le geolocalisation');
        } else if(e.code == e.POSITION_UNAVAILABLE){
            alert('Localisation impossible');
        } else {
            alert('Problème inconnu');
        }
    }

    // Fonction qui sera appelée si la localisation a reussi (p contient les coordonnées de localisation)
    let success = function(p){

        let latitude = p.coords.latitude;
        let longitude = p.coords.longitude;

        $('button').after('<div class="weather"></div>')
        $('.weather').prepend('<h2>La Météo de Gulli :</h2>');

        $.ajax({
            type: 'GET',
            url: 'https://www.prevision-meteo.ch/services/json/lat='+latitude+'lng='+longitude,
            dataType:'json',
            data: 'city_info',
            success: function(p){


                $('.weather').append('<p>' + p.current_condition ['condition'] +'<img src=' + p.current_condition ["icon"] + '></img></p>');

                $('.weather').append('<p>Le soleil se lève à '+ p.city_info['sunrise'] +' / Et se couchera à '+ p.city_info['sunset'] +'</p>');

                $('.weather').append('<p>Température : ' + p.current_condition['tmp'] + '°C</p>');

                $('.weather').append('<p>Humidité : ' + p.current_condition ['humidity'] + '%</p>');

                $('.weather').append('<p>Vent : ' + p.current_condition ['wnd_spd'] + 'Km/h, direction ' + p.current_condition ['wnd_dir'] + '</p>');

                $('.weather').append('<p>Pression Barométrique : ' + p.current_condition ['pressure'] + ' hPa</p>');
            }
        });
    }

    // Code permettant de mettre en place la demande de geolocalisation au navigateur
    navigator.geolocation.getCurrentPosition(success, error, options);

});

img