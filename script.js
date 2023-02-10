var debug = false; // print debug info
var oldtxt = "";
const specialsigns = [" "]; //später vielleichtmal mit mehr Zeichen(@,!§$?()usw.)
const specialchar = {
    "ü": "ue",
    "ö": "oe",
    "ä": "ae",
    "ß": "ss"
};
var elemsize = 104
const picnormsize = 19.231

const pertable_img_url = "https://upload.wikimedia.org/wikipedia/commons/4/4d/Periodic_table_large.svg";
const pertable_url = "https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/periodic-table-lookup.json";
const coord_url = "./slicevals.json";

var elements;
var pertable;
var persymboldic = {}; // dict to translate between full name and symbol

// fetch data and run first computation
$( document ).ready(function() {
    // get elements data
    var pertablefetch = $.get(pertable_url, function(data) {
        pertable = JSON.parse(data);
    });

    // get elements and their coords on image
    var elementsfetch = $.get(coord_url, function(data) {;
        elements = data;
    });

    // get text from url from sharing for example
    const urlParams = new URLSearchParams(window.location.search);
    var text = urlParams.has("s") ? urlParams.get("s") : "";
    $('#main-input').val(text);

    // set up bootstrap's tooltip func
    $('[data-toggle="tooltip"]').tooltip();

    $.when(elementsfetch, pertablefetch).done(function name(params) {
        // set up persymboldic to translate between full name and symbol
        for (elem in pertable) {
            if (elem != "order") {
                persymboldic[pertable[elem]["symbol"].toLowerCase()] = elem;
            }
        }

        // compute and display elements
        makeelem();
    });
});

$(window).resize(function() {
    makeelem();
});

Array.prototype.indexOfArray = function (val) {
    var hash = {};
    for (var i = 0; i < this.length; i++) {
      hash[this[i]] = i;
    }
    return (hash.hasOwnProperty(val)) ? hash[val] : -1;
}

function replace_spec_char(text, swapchars) {
    // replaces chars specififed in swapchars in text string.
    // arg text string
    // arg swapchars dict: key=char, value=new char
    // return string
    
    var out = "";

    for (letter of text) {
        if (letter in swapchars) {
            out += swapchars[letter];
        } else {
            out += letter;
        }
    }

    return out
}

function longestlength(arr) {
    // return longest subarray of array
    const lengths = arr.map(a=>a.length);
    return Math.max(...lengths);
}

function generate_combis(text) {
    // looks for matching combinations of elements with the text
    // arg str text

    // for every char find elements that contain the char
    var possible_elems = new Array(text.length);
    for (let index = 0; index < text.length; index++) {
        // check if char(s) in elements and add to arr
        possible_elems[index] = new Array;

        var char = text.charAt(index);

        // char only
        if (elements[char]) {
            possible_elems[index].push(char);
        }
        // char with right neighbour
        if (elements[char + text.charAt(index+1)] && index+1 < text.length) {
            possible_elems[index].push(char + text.charAt(index+1));
        }
    }

    if (debug) {
        console.log("possible_elems: ");
        console.log(possible_elems);
    }

    // recursively search for combis
    var result = {"valid": [], "invalid": []};

    function recurse(at_i, chr_array) {
        // we got through the array
        if (at_i >= possible_elems.length) {
            result["valid"].push(chr_array);
        }
        // there arent anymore option to go further
        else if (possible_elems[at_i].length == 0) {
            result["invalid"].push(chr_array);
        }
        // got to next layer
        else {
            for (const elem of possible_elems[at_i]) {
                recurse(at_i+elem.length, chr_array.concat(elem));
            }
        }
    }

    recurse(0, []);

    if (debug) {
        console.log("result: ");
        console.log(result);
    }

    return result;
    
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function display_elems(combis) {
    // display the elements from elems array

    removeAllChildNodes(document.getElementById("peritable"));

    // set reasonable size for elems depending on screen size
    // subtracting hardcoded value from widthis not the best way
    // but works for now 
    elemsize = ($("#main").width()-25)/longestlength(combis);
    elemsize = elemsize < 150 ? elemsize : 150;

    var firstrow = true;
    for (const elems of combis) {
        // insert spacer before content if we are not in the first row
        if (!firstrow) {
            var or = document.createElement("div");
            or.setAttribute("class", "justify-content-center");
            or.innerHTML = "<p class=\"my-3\">OR</p>";
            document.getElementById("peritable").appendChild(or);
        } else {firstrow = false;}

        var row = document.createElement("div");
        row.setAttribute("class", "row justify-content-center");

        for (var i = 0; i < elems.length; i++) {
            // prepare data for new elems
            // set up symbol
            var elemstyle = `background: url(${pertable_img_url}) ${elements[elems[i]][0]*elemsize}px ${elements[elems[i]][1]*elemsize}px;
                             background-size: ${picnormsize*elemsize}px;
                             width: ${elemsize}px;
                             height: ${elemsize}px;`;
            
            // set up its tooltip text
            var infotext = "";
            if (specialsigns.includes(elems[i])) {
                infotext = "A simple whitespace, nothing severe!";
            } else {
                infotext = pertable[persymboldic[elems[i]]]["summary"]
                if (infotext == null) {
                    infotext = "Unfortunately no data present :(";
                }
            }
                           
            // add all necessary attributes to the element
            var div = document.createElement("div");
            div.setAttribute("class", "elements");
            div.setAttribute("id", "elem" + i);
            div.setAttribute("style", elemstyle);
            div.setAttribute("data-toggle", "tooltip");
            div.setAttribute("title", infotext)

            row.appendChild(div);
            document.getElementById("peritable").appendChild(row);
        }

    }
}

function rm_swaps(array) {
    // removes one array if it exists forward and backwards

    var out = [];
    for (let i = 0; i < array.length; i++) {
        var rev_ind = out.indexOfArray(array[i].slice().reverse())
        if (rev_ind === -1) {
            out.push(array[i]);
        }
    }
    return out;
}

function makeelem() {
    // find combination of letters who can be displayed
    // as Elements of the Periodic Table and display them.
    
    // get input string
    var writingin = document.getElementById("main-input").value.toLowerCase();

    // replace ä, ö etc, specified in specialchar
    writingin = replace_spec_char(writingin, specialchar);

    var combinations = generate_combis(writingin);

    if (combinations.valid.length == 0 && writingin.length != 0) {
        forfail = document.getElementById("forfail");
        forfail.innerHTML = "Generating failed... <br /> Try to write further maybe there will be a match! This is what left:";
        var writingout = [[]]
        for (const combi of combinations.invalid) {
            if (combi.join("").length > writingout[0].join("").length) {
                writingout = [combi];
            }
            else if (combi.join("").length == writingout[0].join("").length) {
                writingout.push(combi);
            }
        }

    } else {
        forfail = document.getElementById("forfail");
        forfail.innerHTML = "";
        var writingout = combinations.valid;
    }

    writingout = rm_swaps(writingout);

    display_elems(writingout)
    
}