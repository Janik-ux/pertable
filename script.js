var oldtxt = "";
var popups = 0;
var specialsigns = [" "]; //später vielleichtmal mit mehr Zeichen(@,!§$?()usw.)
var specialchar = {
    "ü": "ue",
    "ö": "oe",
    "ä": "ae",
    "ß": "ss"
};
var picdic = {
    " ": ["1559px", "0px"],
    "h": ["0px", "0px"],
    "he": ["115.5px", "0px"],
    "li": ["0px", "891px"],
    "be": ["1889px", "891px"],
    "b": ["670px", "891px"],
    "c": ["559px", "891px"],
    "n": ["448px", "891px"],
    "o": ["337px", "891px"],
    "f": ["226.5px", "891px"],
    "ne": ["115.5px", "891px"],
    "na": ["0px", "783px"],
    "mg": ["1889px", "783px"],
    "al": ["669.5px", "783px"],
    "si": ["559px", "783px"],
    "p": ["448px", "783px"],
    "s": ["337px", "783px"],
    "cl": ["226.5px", "783px"],
    "ar": ["115.5px", "783px"],
    "k": ["0px", "675px"],
    "ca": ["1889px", "675px"],
    "sc": ["1778px", "675px"],
    "ti": ["1667.5px", "675px"],
    "v": ["1556.5px", "675px"],
    "cr": ["1445.5px", "675px"],
    "mn": ["1334.5px", "675px"],
    "fe": ["1223.5px", "675px"],
    "co": ["1113px", "675px"],
    "ni": ["1002.5px", "675px"],
    "cu": ["891.5px", "675px"],
    "zn": ["780.5px", "675px"],
    "ga": ["669.5px", "675px"],
    "ge": ["559.5px", "675px"],
    "as": ["448.5px", "675px"],
    "se": ["337.5px", "675px"],
    "br": ["226.5px", "675px"],
    "kr": ["115.5px", "675px"],
    "rb": ["0px", "567px"],
    "sr": ["1889px", "567px"],
    "y": ["1778px", "567px"],
    "zr": ["1667.5px", "567px"],
    "nb": ["1556.5px", "567px"],
    "mo": ["1445.5px", "567px"],
    "tc": ["1334.5px", "567px"],
    "ru": ["1223.5px", "567px"],
    "rh": ["1113px", "567px"],
    "pd": ["1002.5px", "567px"],
    "ag": ["891.5px", "567px"],
    "cd": ["780.5px", "567px"],
    "in": ["669.5px", "567px"],
    "sn": ["559.5px", "567px"],
    "sb": ["448.5px", "567px"],
    "te": ["337.5px", "567px"],
    "i": ["226.5px", "567px"],
    "xe": ["115.5px", "567px"],
    "cs": ["0px", "459px"],
    "ba": ["1889px", "459px"],
    "hf": ["1667.5px", "459px"],
    "ta": ["1556.5px", "459px"],
    "w": ["1445.5px", "459px"],
    "re": ["1334.5px", "459px"],
    "os": ["1223.5px", "459px"],
    "ir": ["1113px", "459px"],
    "pt": ["1002.5px", "459px"],
    "au": ["891.5px", "459px"],
    "hg": ["780.5px", "459px"],
    "tl": ["669.5px", "459px"],
    "pb": ["559.5px", "459px"],
    "bi": ["448.5px", "459px"],
    "po": ["337.5px", "459px"],
    "at": ["226.5px", "459px"],
    "rn": ["115.5px", "459px"],
    "fr": ["0px", "350.5px"],
    "ra": ["1889px", "350.5px"],
    "rf": ["1667.5px", "350.5px"],
    "db": ["1556.5px", "350.5px"],
    "sg": ["1445.5px", "350.5px"],
    "bh": ["1334.5px", "350.5px"],
    "hs": ["1223.5px", "350.5px"],
    "mt": ["1113px", "350.5px"],
    "ds": ["1002.5px", "350.5px"],
    "rg": ["891.5px", "350.5px"],
    "cn": ["780.5px", "350.5px"],
    "nh": ["669.5px", "350.5px"],
    "fl": ["559.5px", "350.5px"],
    "mc": ["448.5px", "350.5px"],
    "lv": ["337.5px", "350.5px"],
    "ts": ["226.5px", "350.5px"],
    "og": ["115.5px", "350.5px"],
    "la": ["1778px", "220.5px"],
    "ce": ["1667.5px", "220.5px"],
    "pr": ["1556.5px", "220.5px"],
    "nd": ["1445.5px", "220.5px"],
    "pm": ["1334.5px", "220.5px"],
    "sm": ["1223.5px", "220.5px"],
    "eu": ["1113px", "220.5px"],
    "gd": ["1002.5px", "220.5px"],
    "tb": ["891.5px", "220.5px"],
    "dy": ["780.5px", "220.5px"],
    "ho": ["669.5px", "220.5px"],
    "er": ["559.5px", "220.5px"],
    "tm": ["448.5px", "220.5px"],
    "yb": ["337.5px", "220.5px"],
    "lu": ["226.5px", "220.5px"],
    "ac": ["1778px", "112.5px"],
    "th": ["1667.5px", "112.5px"],
    "pa": ["1556.5px", "112.5px"],
    "u": ["1445.5px", "112.5px"],
    "np": ["1334.5px", "112.5px"],
    "pu": ["1223.5px", "112.5px"],
    "am": ["1113px", "112.5px"],
    "cm": ["1002.5px", "112.5px"],
    "bk": ["891.5px", "112.5px"],
    "cf": ["780.5px", "112.5px"],
    "es": ["669.5px", "112.5px"],
    "fm": ["559.5px", "112.5px"],
    "md": ["448.5px", "112.5px"],
    "no": ["337.5px", "112.5px"],
    "lr": ["226.5px", "112.5px"]
}

var pertable;
var persymbols = new Array;
var persymboldic = {};
$.get("https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/periodic-table-lookup.json", function(data) {
    pertable = JSON.parse(data);
}).done(function() {
    for (elem in pertable) {
        if (elem != "order") {
            persymbols.push(pertable[elem]["symbol"].toLowerCase());
            persymboldic[pertable[elem]["symbol"].toLowerCase()] = elem;
        }
    }
});

function dropdownfunc(thebutton) {
    document.getElementById("thedropdown").classList.toggle("show");
    thebutton.classList.toggle("change");
}

function popupfunc(id) {
    var popup = document.getElementById("in" + id);
    popup.classList.toggle("show");
}

function makeelem() {
    var failed = 0;
    var testy;
    var writingout = new Array;
    var writingin = document.getElementById("input").value.toLowerCase();
    var temporalstr = "";
    for (letter of writingin) {
        if (letter in specialchar) {
            temporalstr += specialchar[letter];
        } else {
            temporalstr += letter;
        }
    }
    writingin = temporalstr;
    var ind = 0;
    var skip = 0;
    var recu = 0;
    for (letter of writingin) {
        if (skip == 1) {
            skip = 0;
            ind += 1;
            continue;
        } else if (specialsigns.includes(letter) || persymbols.includes(letter)) {
            writingout.push(letter);
            recu = 0;
        } else if (persymbols.includes(letter + writingin[ind + 1])) {
            writingout.push(letter + writingin[ind + 1]);
            skip = 1;
            recu = 1;
        } else if (persymbols.includes(writingin[ind - 1] + letter) && ind != 0 && recu == 0) {
            writingout[writingout.length - 1] = writingin[ind - 1] + letter;
            recu = 1;
        } else {
            var failed = 1;
            fail = document.getElementById("forfail")
            fail.innerHTML = "Generating failed... <br /> Try to write further maybe there will be a match! This is what left:";
            fail.style.margin = "15px";
            break;
        }
        ind += 1;
    }
    if (failed != 1) {
        fail = document.getElementById("forfail");
        fail.innerHTML = null;
        fail.style.margin = "15px";
    }
    for (var i = 0; i < writingout.length; i++) {
        if (i >= popups) {
            var div = document.createElement("div");
            div.setAttribute("class", "popup");
            div.setAttribute("onclick", "popupfunc(this.id)");
            div.setAttribute("id", "elem" + popups);
            div.style.background = "url(https://scientificgems.files.wordpress.com/2016/06/periodic_table_complete.png) " + picdic[writingout[i]][0] + " " + picdic[writingout[i]][1];
            div.style.backgroundSize = "2000px 1000px"
            var span = document.createElement("span");
            span.setAttribute("class", "popuptext");
            span.setAttribute("id", "inelem" + popups);
            if (specialsigns.includes(writingout[i])) {
                span.innerHTML = "A simple whitespace, nothing severe!";
            } else {
                var text = pertable[persymboldic[writingout[i]]]["appearance"]
                if (text == null) {
                    text = "Without appearance"
                }
                span.innerHTML = text + "<br />" + "boils at: " + pertable[persymboldic[writingout[i]]]["boil"];
            }
            div.appendChild(span);
            document.getElementById("peritable").appendChild(div);
            popups += 1;
        } else {
            document.getElementById("elem" + i).style.backgroundPosition = picdic[writingout[i]][0] + " " + picdic[writingout[i]][1];
            if (specialsigns.includes(writingout[i])) {
                document.getElementById("inelem" + i).innerHTML = "A simple whitespace, nothing severe"
            } else {
                var text = pertable[persymboldic[writingout[i]]]["appearance"]
                if (text == null) {
                    text = "Without appearance"
                }
                document.getElementById("inelem" + i).innerHTML = text + "\n" + "boils at: " + pertable[persymboldic[writingout[i]]]["boil"];
            }
        }
    }
    var delpopups = popups;
    for (var i = writingout.length; i < delpopups; i++) {
        document.getElementById("elem" + i).remove();
        popups -= 1;

    }
}