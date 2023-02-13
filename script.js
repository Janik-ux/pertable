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
    var elementsfetch = $.get(coord_url, function(data) {
        elements = data;
    });

    // get text from url from sharing for example
    const urlParams = new URLSearchParams(window.location.search);
    var text = urlParams.has("s") ? urlParams.get("s") : "";
    $('#main-input').val(text);

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
    // display new on screen change to possibly change size of elems
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

function cap_first(string) {
    // capitalize first letter
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function generate_combis(text) {
    // looks for matching combinations of elements with the text
    // arg str text

    // for every char at a position find elements that begin with it
    // e.g. "H": [H, HO, HE, ...]
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
        // got to next layer (or next next because of elem has two letters)
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
    elemsize = ($("#main").width())/longestlength(combis);
    elemsize = elemsize < 150 ? elemsize : 150;

    var rownum = 0;
    for (const elems of combis) {
        // insert spacer before content if we are not in the first row
        if (rownum > 0) {
            var or = document.createElement("div");
            or.setAttribute("class", "justify-content-center");
            or.innerHTML = "<p class=\"my-3\">OR</p>";
            document.getElementById("peritable").appendChild(or);
        }

        if (elems.length == 0) {
            // nothing to show, skipping
            continue
        }

        // create row for bootstrap style
        var row = document.createElement("div");
        row.setAttribute("class", "row justify-content-center mb-2");
        document.getElementById("peritable").appendChild(row);

        // create wrapper around elems to export to img
        var wrap = document.createElement("div");
        wrap.setAttribute("id", "elemrowwrap"+rownum);
        wrap.setAttribute("class", "d-flex");
        row.appendChild(wrap);

        for (var i = 0; i < elems.length; i++) {
            // prepare data for new elems
            // set up symbol
            var elemstyle = `background: url(${pertable_img_url}) ${elements[elems[i]][0]*elemsize}px ${elements[elems[i]][1]*elemsize}px;
                             background-size: ${picnormsize*elemsize}px;
                             width: ${elemsize}px;
                             height: ${elemsize}px;`;
            
            // set up its tooltip text
            var infotext = "";
            var elemtitle = "";
            if (specialsigns.includes(elems[i])) {
                infotext = "A simple whitespace, nothing severe!";
                elemtitle = "The Mighty Whitespace";
            } else {
                infotext = pertable[persymboldic[elems[i]]]["summary"];
                infotext += "<br><a href=" + pertable[persymboldic[elems[i]]]["source"] + ">Wikipedia</a>"
                if (infotext == null) {
                    infotext = "Unfortunately no data present :(";
                }
                elemtitle = cap_first(persymboldic[elems[i]]);
            }

            // add all necessary attributes to the element
            var div = document.createElement("div");
            div.setAttribute("class", "js-element");
            div.setAttribute("id", "elem" + i);
            div.setAttribute("style", elemstyle);
            div.setAttribute("title", elemtitle);
            div.setAttribute("data-toggle", "popover");
            div.setAttribute("data-content", infotext);

            // append to dom
            wrap.appendChild(div);
        }

        if (wrap.hasChildNodes()) {
            // add share and download buttons
            var downl =    `<button class="btn btn-square m-1" onclick="export_img(${rownum})">
                                    <i class="bi-download"></i>
                            </button>`
            row.insertAdjacentHTML("beforeend", downl)
        }

        rownum += 1;
    }

    // display tip only if there are symbols displayed
    if (document.getElementById("peritable").hasChildNodes()) {
        var tip = document.createElement("p");
        tip.setAttribute("class", "text-info");
        tip.innerHTML = "Tip: Click on an element!";
        document.getElementById("peritable").appendChild(tip);
    }

    // add bootstrap popover to all elements
    $(".js-element").popover({trigger: "click", placement: "auto", html: true});
    
    // make popovers disappear on click anywhere else
    $('html').on('click', function(e) {
        if (typeof $(e.target).data('original-title') == 'undefined' &&
           !$(e.target).parents().is('.popover.in')) {
          $('[data-original-title]').popover('hide');
        }
    });

    // make other popovers disappear
    $('.js-element').on('click', function (e) {
        $('.js-element').not(this).popover('hide');
    });
}

function share() {
    var link = window.location.href.split("?")[0] + "?s=" + $('#main-input').val();
    if (navigator.share) {
        navigator.share({
          title: 'Periodic Table Writing',
          url: link
        }).then(() => {null})
        .catch(console.error);
      } else {
        navigator.clipboard.writeText(link)
            .then(() => {
                var alert = `<div class="alert alert-primary alert-dismissible fade show" role="alert">
                                Link copied to clipboard!
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>`;
                document.getElementById("main-heading").insertAdjacentHTML("afterend", alert);
            }, 
            () => {

            });
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

function export_img(rownum) {
    var node = document.getElementById("elemrowwrap"+rownum);
    // export elems row to img
    domtoimage.toBlob(node)
        .then(function (blob) {
            window.saveAs(blob, "pertablewriting.png");
        });
}

function makeelem() {
    // find combination of letters who can be displayed
    // as Elements of the Periodic Table and display them.
    
    // get input string
    var writingin = document.getElementById("main-input").value.toLowerCase();

    if (writingin.length == 0) {
        removeAllChildNodes(document.getElementById("peritable"));
        document.getElementById("forfail").innerHTML = "";
        return
    }

    // replace ä, ö etc, specified in specialchar
    writingin = replace_spec_char(writingin, specialchar);

    var combinations = generate_combis(writingin);

    // catch if generate combis didn#t get a valid answer
    if (combinations.valid.length == 0) {
        // display error message if neccessary, maybe put in func
        forfail = document.getElementById("forfail");
        forfail.innerHTML = "<p>Generating failed... <br> Try to write further maybe there will be a match! This is what left:</p>";
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