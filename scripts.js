var btn_height = 200;
function fix_heights() {
    //center profile label
    var image = document.getElementById('image'), label = document.getElementById('label');
    label.setAttribute("style", "padding-top: " + (image.offsetHeight / 2 - label.offsetHeight / 2) + "px;");

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

function button_reveal(id) {
    var elements = document.getElementById(id).getElementsByTagName("div");
    elements[0].setAttribute("style", "height: " + btn_height / 4 * 3 + "px;");
    elements[1].setAttribute("style", "height: " + btn_height / 4 + "px;");
}
function button_hide(id) {
    var elements = document.getElementById(id).getElementsByTagName("div");
    elements[0].setAttribute("style", "height: " + btn_height + "px;");
    elements[1].setAttribute("style", "height: 0px;");
}