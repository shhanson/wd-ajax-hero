(function() {
    'use strict';

    const movies = [];

    const renderMovies = function() {
        $('#listings').empty();

        for (const movie of movies) {
            const $col = $('<div>').addClass('col s6');
            const $card = $('<div>').addClass('card hoverable');
            const $content = $('<div>').addClass('card-content center');
            const $title = $('<h6>').addClass('card-title truncate');

            $title.attr({
                'data-position': 'top',
                'data-tooltip': movie.title
            });

            $title.tooltip({
                delay: 50
            }).text(movie.title);

            const $poster = $('<img>').addClass('poster');

            $poster.attr({
                src: movie.poster,
                alt: `${movie.poster} Poster`
            });

            $content.append($title, $poster);
            $card.append($content);

            const $action = $('<div>').addClass('card-action center');
            const $plot = $('<a>');

            $plot.addClass('waves-effect waves-light btn modal-trigger');
            $plot.attr('href', `#${movie.id}`);
            $plot.text('Plot Synopsis');


            $action.append($plot);
            $card.append($action);

            const $modal = $('<div>').addClass('modal').attr('id', movie.id);
            const $modalContent = $('<div>').addClass('modal-content');
            const $modalHeader = $('<h4>').text(movie.title);
            const $movieYear = $('<h6>').text(`Released in ${movie.year}`);
            const $modalText = $('<p>').text(movie.plot);

            $modalContent.append($modalHeader, $movieYear, $modalText);
            $modal.append($modalContent);

            $col.append($card, $modal);

            $('#listings').append($col);

            $('.modal-trigger').leanModal();
        }
    };

    // ADD YOUR CODE HERE



    //$("button").click(function(event) {

    $("form").submit(function(event) {
        event.preventDefault();
        //console.log("YO BUTTON!");

        let $searchString = $("#search").val();
        if ($searchString !== "") {
            let $xhr = $.getJSON('http://omdbapi.com/?s=' + $searchString + "&type=movie");

            $xhr.done(function(data) {
                if ($xhr.status !== 200) {
                    console.log("NO BUENO!");
                    return;
                }


                let results = data.Search;
                let movie = {};
                //console.log(results);
                for (let i = 0; i < results.length; i++) {
                    movie = {
                        id: results[i].imdbID,
                        poster: "",
                        title: results[i].Title,
                        year: results[i].Year,
                        plot: ""
                    };
                    if (results[i].Poster !== "N/A") {
                        movie.poster = results[i].Poster;
                    }

                    let $xhrplot = $.getJSON('http://omdbapi.com/?t=' + movie.title + "&plot=full");
                    $xhrplot.done(function(data){
                        if ($xhrplot.status !== 200) {
                            return;
                        }


                        movie.plot = data.Plot;

                    });
                    //console.log("PLOT: " + results[i].Plot);

                    movies.push(movie);
                }

                renderMovies();

            });
        }


    });

})();
