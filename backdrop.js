const backdrops = [
    'starry_night',
    'expandable_ball_pit',
    'wave_flow'
];

var backdrop;

function random_range(min, max) {
    return Math.round((Math.random() * (max - min)) + min);
}
function pick_random_backdrop() {
    backdrop = backdrops[Math.floor(Math.random() * backdrops.length)];
}

function load_script(script) {
    var script_element = document.createElement('script');
    script_element.src = script;
    document.querySelector('head').appendChild(script_element);
}
function load_backdrop(backdrop) {
    load_script("backdrops/" + backdrop + "_backdrop.js");
}

function play_with_this_backdrop() {
    $("#parent").children(":not(#backdrop)").remove();
    $("#parent").append(
    "<a href=\"index.html\" style=\"text-decoration:none\">" +
        "<div class=\"backdrop-back\">< Reload</div>" +
    "</a>");
}

pick_random_backdrop();
load_backdrop(backdrop);