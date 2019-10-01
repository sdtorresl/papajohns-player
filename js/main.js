// Setup player
(function($) {
    $(document).ready(function() {

        const source = "https://streams.exeamedia.com/papa";
        const audio = new Audio(); // use the constructor in JavaScript, just easier that way
        audio.src = source;
        audio.autoplay = true;
        

        const stream = {
                title: "Papa Johns",
                mp3: "https://streams.exeamedia.com/papa"
            };
        let ready = false;
        const flagAudio = false;


        $("#player").jPlayer({
            ready: function (event) {
                ready = true;
                $(this).jPlayer("setMedia", stream);
            },
            pause: function() {
                $(this).jPlayer("clearMedia");
            },
            error: function(event) {
                if(ready && event.jPlayer.error.type === $.jPlayer.error.URL_NOT_SET) {
                    // Setup the media stream again and play it.
                    $(this).jPlayer("setMedia", stream).jPlayer("play");
                }
            },
            swfPath: "js",
            supplied: "mp3",
            preload: "none",
            wmode: "window",
            keyEnabled: false,
            cssSelectorAncestor: ".player-container",
            autoPlay: true,
            verticalVolume: "height"
        });

        setInterval(updateMetadata(), 5000);
    });

    $(window).load(function(){
        // $('#player').jPlayer("play");
        // Get info of the current track
        setInterval("updateMetadata()", 20000);
    });

    /** Make an http request and return the
     *  results in a string
     */
    function httpGet(URL) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", URL, false);
        xmlHttp.send(null);
        return xmlHttp.responseText;
    }

    var artist, title, previousArtist, previousTitle;

    /** Update metadata of actual song
     */
    function updateMetadata() {

        data = 'tag=getTags';
        $.ajax({
            data: data,
            url: 'metadata.php',
            success: function(response) {
                var json = JSON.parse(response);

                if (json[0] != artist && json[1] != title) {
                    previousArtist = artist;

                    previousTitle = title;

                    artist = json[0];
                    if (artist.length > 23) {
                        artist;
                    }

                    title = json[1];
                    if (artist.length > 23) {
                        title;
                    }

                    $("#artist").text(artist);
                    $("#title").text(title);

                    if (previousArtist != undefined) {
                        $("#previousSong").html(previousArtist + ' - ' + previousTitle);
                    }
                }
            }
        });
    }

    $('.backbtn').click(function () {
        console.log('hola');
        $('.widget').addClass('hidden');
        $('#content-slow').show();
    });

    $('.close').click(function () {
        $('#content-slow').hide();
    });

    window.updateMetadata = updateMetadata;
})(jQuery);
