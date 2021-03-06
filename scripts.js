var btn_height;

//update heights of the buttons on page load and on page resize.
function fix_heights() {
    //recalculate window size and therefore button heights
    btn_height = window.innerHeight * 0.25;
    var link_containers = document.getElementsByClassName("Link-Container");
    for (var i = 0; i < link_containers.length; i++) {
        //set button size
        link_containers[i].setAttribute("style", "height: " + btn_height + "px;");
        //close buttons again in case they were open
        button_hide(link_containers[i].id);
    }
}

function animate_profile_snapshot() {
    document.getElementById("snapshot").setAttribute("style", "width: 30%;");
    setTimeout(function() {
        document.getElementById("name").setAttribute("style", "color: var(--Profile-Snapshot-Title);");
        document.getElementById("subtitle").setAttribute("style", "color: var(--Profile-Snapshot-Subtitle);");
    }, 1000);
}

function check_for_bad_browser() {
    if (window.navigator.userAgent.indexOf("Edge") > -1) {
        alert('Note: Microsfot Edge cannot handle image animations in CSS.\nYou may experience minor visual glitches' +
        ' when viewing images.');
        return false;
    }
    if ((!!navigator.userAgent.match(/Trident/g) || !!navigator.userAgent.match(/MSIE/g))) {
        return true;
    }
    return false;
}

function destroy_content() {
    var body = document.getElementsByTagName('body');
    body[0].parentElement.removeChild(body[0]);
    document.write("<!DOCTYPE html> <html><body><h1>" +
                    "I'm sorry but this site relies heavily on advanced JavaScript and CSS " +
                    "animations that are not supported in your current browser." + 
                    "<br />" +
                    "I recommend browsing in Chrome, Firefox, or Edge (if you must)." + 
                    "</h1></body></html>");
}

/************************************************************************************************
    button controls:

@param id the id of the div.Link-Container  These functions manipulate the content based on
a standard format of:
    div.Link-Container#id
        div.Link-Cover#id-span
        div.Link-Reveal#id-Reveal

************************************************************************************************/
function button_reveal(id) {
    var elements = document.getElementById(id).getElementsByTagName("div");
    elements[0].setAttribute("style", "height: " + (btn_height - 50) + "px;");
    elements[1].setAttribute("style", "height: " + 50 + "px;");
}
function button_hide(id) {
    var elements = document.getElementById(id).getElementsByTagName("div");
    elements[0].setAttribute("style", "height: " + btn_height + "px;");
    elements[1].setAttribute("style", "height: 0px;");
}