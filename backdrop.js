const backdrops = [
    'expandable_ball_pit',
    'wave_flow',
    'graph_theory'
];

var backdrop;

function random_range(min, max) {
    return Math.round((Math.random() * (max - min)) + min);
}
function pick_random_backdrop() {
    backdrop = backdrops[Math.floor(Math.random() * backdrops.length)];
}

function load_script(script, async) {
    var script_element = document.createElement('script');
    script_element.src = script;
    script_element.async = async;
    document.querySelector('head').appendChild(script_element);
}
function load_backdrop(backdrop) {
    /* LOAD DEPENDENCIES */
    if (backdrop == 'wave_flow') {
        load_script("javascript_dependencies/simplex-noise.js", true);
    }
    if (backdrop == 'graph_theory') {
        load_script("javascript_dependencies/spacial/AABB.js", true);
        load_script("javascript_dependencies/spacial/QuadTree.js", true);
    }
    load_script("backdrops/" + backdrop + "_backdrop.js", false);
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