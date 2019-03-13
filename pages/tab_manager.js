function display_content(evt, id) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("content-display-button");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    var cont = document.getElementById(id)
    if (cont != null) cont.style.display = "inline-block";
    
    if (!evt.currentTarget.className.includes("active"))
        evt.currentTarget.className += " active";
}