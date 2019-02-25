const backdrops = [
    'Bubbling Ball Pit',
    'Collision Detection Graph'
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
function load_backdrop(title) {
    /* LOAD DEPENDENCIES */
    if (title === 'wave_flow') {
        load_script("javascript_dependencies/simplex-noise.js", true);
    }
    if (title === 'Collision Detection Graph' || title === 'Bubbling Ball Pit') {
        load_script("javascript_dependencies/spacial/AABB.js", true);
        load_script("javascript_dependencies/spacial/QuadTree.js", true);
    }
    load_script("backdrops/" + title + "_backdrop.js", true);
}
function display_backdrop_title() {
    document.getElementById('backdrop_name').innerHTML = "This Backdrop is called: " + backdrop;
    document.getElementById('backdrop_detail').innerHTML = "Don't like this backdrop? Refresh for a random one!\tThere are currently " + backdrops.length + " backdrops!";
}

function play_with_this_backdrop() {
    $("#parent").children(":not(#backdrop)").remove();
    $("#parent").append(
    "<a href=\"index.html\" style=\"text-decoration:none\">" +
        "<div class=\"backdrop-back\">< Reload</div>" +
    "</a>");

    load_backdrop_speciic_content();
}

pick_random_backdrop();
load_backdrop(backdrop);