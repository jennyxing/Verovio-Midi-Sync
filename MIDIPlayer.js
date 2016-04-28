if (typeof(console) === "undefined") var console = {
    log: function() {}
};
var vrvToolkit = new verovio.toolkit();
var time = 0;
var highlighttick;
var notesbeingplayed = [];

function tick() {
    var elementsAtTime = vrvToolkit.getElementsAtTime(time);
    time += 100;
    var elementsattime = JSON.parse(elementsAtTime);
    var group = document.querySelector('#output');
    //getElementsByTagName actually recursively all the decendants with the tag 'svg'
    //such as (for 3 pages) [svg, svg#definition-scale, svg, svg#definition-scale, svg, svg#definition-scale, definition-scale: svg#definition-scale]
    var svgpage = group.getElementsByTagName('svg');
    if (elementsattime.page > 0){
      // console.log(elementsattime);
      notesbeingplayed.forEach(function(noteid) {
          d3.select(svgpage[(elementsattime.page-1)*2]).select("#" + noteid).style("filter", null)
      });
      elementsattime.notes.forEach(function(noteid) {
          d3.select(svgpage[(elementsattime.page-1)*2]).select("#" + noteid).style("filter", "url(#highlighting)")
          notesbeingplayed.push(noteid);
      });
    }
}

var playpause = function(stop) {
    if (MIDI.Player.playing) {
        $("#playpause").html("Play");
        window.clearInterval(highlighttick);
        MIDI.Player.pause(true);
    } else {
        $("#playpause").html("Pause");
        highlighttick = window.setInterval(tick, 100);
        MIDI.Player.resume();
    }
};

function renderSVGandMIDI() {
    $("#output").html("");
    time = 0;
    var meiFile = $('#meiFile')[0].files[0];    
    var reader = new FileReader();
    reader.readAsText(meiFile);

    reader.onload = function(e) {
        //load svg of score from verovio. these are the options so that the score fits on the page
        var zoom = 50;
        var pageHeight = ($(document).height()) * 100 / zoom;
        var pageWidth = ($(document).width()) * 95 / zoom;
        var border = 50;
        var options = JSON.stringify({
            inputFormat: 'mei',
            pageHeight: pageHeight,
            pageWidth: pageWidth,
            border: border,
            scale: zoom,
            adjustPageHeight: 1,
            ignoreLayout: 1,
        });
        vrvToolkit.setOptions(options);
        vrvToolkit.loadData(e.target.result + "\n");
        var pageCount = vrvToolkit.getPageCount();
        //render svg int preset div
        for (i = 1; i <= pageCount; i++) {
            var svgforpage = vrvToolkit.renderPage(i, "")
            $("#output").append(svgforpage);
        }

        //use D3 to append a filter into defs (hardcoded)
        var d3svg = d3.select("svg");
        var defs = d3svg.select("defs");
        var filter = defs.append("filter")
            .attr("id", "highlighting")
            .attr("x", "-50%")
            .attr("y", "-50%")
            .attr("width", "200%")
            .attr("height", "200%");
        filter.append("feFlood")
            .attr("flood-color", "red")
            .attr("result", "base");
        filter.append("feGaussianBlur")
            .attr("in", "SourceAlpha")
            .attr("stdDeviation", 50)
            .attr("result", "blur-out");
        filter.append("feOffset")
            .attr("in", "blur-out")
            .attr("dx", 5)
            .attr("dy", 5)
            .attr("result", "the-shadow");
        filter.append("feColorMatrix")
            .attr("in", "the-shadow")
            .attr("result", "color-out")
            .attr("type", "matrix")
            .attr("values", "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1.5 0")
        filter.append("feComposite")
            .attr("in", "base")
            .attr("in2", "color-out")
            .attr("operator", "in")
            .attr("result", "drop");
        filter.append("feComposite")
            .attr("in", "SourceGraphic")
            .attr("in2", "drop")
            .attr("mode", "normal");

        MIDI.loader = new sketch.ui.Timer;
        MIDI.loadPlugin({
            soundfontUrl: "./soundfont/",
            onprogress: function(state, progress) {
                MIDI.loader.setValue(progress * 100);
            },
            onsuccess: function() {
                // speed the song is played back
                MIDI.Player.timeWarp = 2;
                //load midi of score
                var base64midi = vrvToolkit.renderToMidi(e.target.result + "\n", "");
                loadedsong = 'data:audio/midi;base64,' + base64midi;
                MIDI.Player.loadFile(loadedsong);
                //show button for playing and pausing
                $("#playpause").show();
                //allow click of note to jump to the time in the MIDI the note is played
                $("g.note").click(function() {
                  window.clearInterval(highlighttick);
                  MIDI.Player.pause(true);
                  var timeofElement = vrvToolkit.getTimeForElement(this.id);
                  //convert time of element to miliseconds
                  MIDI.Player.currentTime = timeofElement/120.0*1000.0;
                  time = MIDI.Player.currentTime;
                  highlighttick = window.setInterval(tick, 100);
                  $("#playpause").html("Pause");
                  MIDI.Player.resume();
                });
            }
        });
    };
}