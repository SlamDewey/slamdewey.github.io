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
    check_for_edge();
    document.getElementById("snapshot").setAttribute(
        "style", "width: 50%; text-shadow: 1px 1px var(--body-background);");
    document.getElementById("name").setAttribute("style", "color: var(--Profile-Snapshot-Title);");
    document.getElementById("name").setAttribute("style", "color: var(--Profile-Snapshot-Subtitle);");
}

function check_for_edge() {
    if (window.navigator.userAgent.indexOf("Edge") > -1)
        alert("Warning: Microsoft Edge has trouble with CSS image transitions, please use Chrome, Firefox, or even IE for a better experience.");
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