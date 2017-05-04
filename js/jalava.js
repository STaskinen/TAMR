let TAMusic = {
    artist: {
        genres: [],
        songs: []
    }
};
let tubeMusic = {
    videos: []
};
$(document).ready(function () {
    console.log('Ready!');
});

let randomizer = 0;

//START of Spotify based functions

const additionalQuerySpotify = (data) => {
    similarQuerySpotify(data.artists.items[0].id);
    genreListing(data.artists.items[0].genres);
};

const artistQuerySpotify = (Artist) => {
    $.ajax({
        'url': 'https://api.spotify.com/v1/search/?q=' + Artist + '&type=artist',
        'dataType': 'JSON',
        'success': additionalQuerySpotify
    });
};

const similarQuerySpotify = (id) => {
    $.ajax({
        'url': 'https://api.spotify.com/v1/artists/' + id + '/related-artists',
        'dataType': 'JSON',
        'success': similarIdQuerySpotify
    });
};

const similarIdQuerySpotify = (data) => {
    for (let i = 0; i < 5; i++) {
        $.ajax({
            'url': 'https://api.spotify.com/v1/search/?q=' + data.artists[i].name + '&type=artist',
            'dataType': 'JSON',
            'success': trackQuerySpotify
        });
    };
};

const trackQuerySpotify = (data) => {

    $.ajax({
        'url': 'https://api.spotify.com/v1/artists/' + data.artists.items[0].id + '/top-tracks?country=FI',
        'dataType': 'JSON',
        'success': trackListerSpotify
    });
};

const trackListerSpotify = (data) => {
    let Listing = { artistName: data.tracks[0].artists[0].name, tracks: [] };
    for (let i = 0; i < 3; i++) {
        Listing.tracks.push(data.tracks[i].name);
    };
    TAMusic.artist.songs.push(Listing);
};

// END of Spotify, START of Last.fm based functions

const getSimilarArtistsFM = (Artist) => {
    $.ajax({
        'url': 'http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=' + Artist + '&limit=5&api_key=40a38c16be89a56cfa037290df41a9ce&format=json',
        'dataType': 'JSON',
        'success': logging
    });
};

const getTopTracksFM = (Artist) => {
    $.ajax({
        'url': 'http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=' + Artist + '&api_key=40a38c16be89a56cfa037290df41a9ce&limit=12&format=json',
        'dataType': 'JSON',
        'success': logging
    });
};

const getTopTagsFM = (Artist) => {
    $.ajax({
        'url': 'http://ws.audioscrobbler.com/2.0/?method=artist.gettoptags&artist=' + Artist + '&api_key=40a38c16be89a56cfa037290df41a9ce&format=json',
        'dataType': 'JSON',
        'success': genreListing
    });
};

//END of Last.fm, START of Youtube based functions

const queryYoutube = () => {

    for (song of TAMusic.artist.songs) {

        tubeMusic = {
            videos: []
        };
        for (track of song.tracks) {
            $.ajax({
                'url': 'https://www.googleapis.com/youtube/v3/search?key= AIzaSyAZj9ET23sYQMYzKvuUtebW_j80K2xB0PM&type=video&q=' + song.artistName + '+' + track + '&part=snippet',
                'dataType': 'JSON',
                'success': listingYoutube
            });
        }
    }
};

const listingYoutube = (data) => {
    tubeMusic.videos.push({ title: data.items[0].snippet.title, id: data.items[0].id.videoId });
    console.log(tubeMusic);
};

//END of Youtube, Start of other functions

const logging = (data) => {
    console.log(data);
    /*if (data.artists) {
        console.log('Spotify: Similar by Artist Name');
        console.log(data);
    } else if (data.similarartists) {
        console.log('Last.fm: Similar by Artist Name');
        console.log(data);
    } else {
        console.log('There be no data.');
    }*/

};
const getArtist = () => {
    let Artist = $('#artistInput').val();
    getTopTagsFM(Artist);
    artistQuerySpotify(Artist);
    // getSimilarArtistsFM(Artist);

};

const showResults = () => {
    console.log('Delayed')
    console.log(TAMusic);
    queryYoutube();
    window.setTimeout(function () {
        for (entry of tubeMusic.videos) {
            $('#songLibrary').append('<iframe id="songPlayer" type="text/html" src="https://www.youtube.com/embed/' + entry.id + '?autoplay=0" frameborder="0"></iframe>');
        }
        /*for (entry of TAMusic.artist.songs) {
        for (track of entry.tracks) {
            $('#songLibrary').append('<div class=songPlayer> <p> ' + track + '</p> <p>Artists: ' + entry.artistName + '</p> </div>');
        }
    }*/
    }, 500);

};

const genreListing = (data) => {
    console.log(data);
    if (data.toptags) {
        for (let i = 0; i < 5; i++) {
            TAMusic.artist.genres.push(data.toptags.tag[i].name.toUpperCase());
        };
    } else {
        for (entry of data) {
            TAMusic.artist.genres.push(entry.toUpperCase());
        };
    };
    listCleaner();
};

const listCleaner = () => {
    let cleaned = []
    $.each(TAMusic.artist.genres, function (i, el) {
        if ($.inArray(el, cleaned) === -1) cleaned.push(el);
    });
    TAMusic.artist.genres = cleaned;
};

const cleaner = () => {
    tubeMusic = {
        videos: []
    };
    TAMusic = {
        artist: {
            genres: [],
            songs: []
        }
    };
};

$('#artistSearch').submit(function () {
    $('#songLibrary').empty();
    cleaner();
    getArtist();
    window.setTimeout(showResults, 1500)
    return false;
});

$('#Randomize').click(function () {
    randomizer = Math.ceil(Math.random() * 100);
    console.log(randomizer);
    console.log(TAMusic);
});

console.log(randomizer);