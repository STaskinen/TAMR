let TAMusic = {
    Songs:[]
};

const logging = (data) => {
    console.log(data);
}

const getArtist = () => {
    let Artist = $('#artistInput').val();
    getTopTracks(Artist);
    getTopTags(Artist);
    querySpotify(Artist);

};

const querySpotify = (Artist) => {
    $.ajax({
        'url': 'https://api.spotify.com/v1/search/?q=' + Artist + '&type=artist',
        'dataType': 'JSON',
        'success': logging
    });
}

const getTopTracks = (Artist) => {
    $.ajax({
        'url': 'http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=' + Artist + '&api_key=40a38c16be89a56cfa037290df41a9ce&limit=12&format=json',
        'dataType': 'JSON',
        'success': showResults
    });
}

const getTopTags = (Artist) => {
    $.ajax({
        'url': 'http://ws.audioscrobbler.com/2.0/?method=artist.gettoptags&artist=' + Artist + '&api_key=40a38c16be89a56cfa037290df41a9ce&format=json',
        'dataType': 'JSON',
        'success': logging
    });
}

const showResults = (data) => {
    $('#songLibrary').empty();
    console.log(data);
    for (entry of data.toptracks.track) {
        $('#songLibrary').append('<div class=songPlayer> <p>' + entry.name + '</p> </div>')
    }
    /*for (var i = 1; i < 19; i++) {
    $('#songLibrary').append('<div class=songPlayer id=SP' + i + '> <p>Test</p> </div>')
}*/
console.log("'ello")
}

$('#artistSearch').submit(function () {
getArtist();
return false;    
});