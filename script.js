var debug = true; // print debug info
var oldtxt = "";
var specialsigns = [" "]; //später vielleichtmal mit mehr Zeichen(@,!§$?()usw.)
const specialchar = {
    "ü": "ue",
    "ö": "oe",
    "ä": "ae",
    "ß": "ss"
};
const elements = {
    " ": ["5S000px", "1000px"],
    "h": ["-52px", "-74px"],
    "he": ["127px", "-72px"],
    "li": ["-52px", "-177px"],
    "be": ["-155px", "-177px"],
    "b": ["642px", "-175px"],
    "c": ["539px", "-175px"],
    "n": ["436px", "-175px"],
    "o": ["333px", "-175px"],
    "f": ["230px", "-175px"],
    "ne": ["127px", "-175px"],
    "na": ["-52px", "-280px"],
    "mg": ["-155px", "-280px"],
    "al": ["642px", "-278px"],
    "si": ["539px", "-278px"],
    "p": ["436px", "-278px"],
    "s": ["333px", "-278px"],
    "cl": ["230px", "-278px"],
    "ar": ["127px", "-278px"],
    "k": ["-52px", "-383px"],
    "ca": ["-155px", "-383px"],
    "sc": ["-258px", "-383px"],
    "ti": ["-430px", "-381px"],
    "v": ["1466px", "-381px"],
    "cr": ["1363px", "-381px"],
    "mn": ["1260px", "-381px"],
    "fe": ["1157px", "-381px"],
    "co": ["1054px", "-381px"],
    "ni": ["951px", "-381px"],
    "cu": ["848px", "-381px"],
    "zn": ["745px", "-381px"],
    "ga": ["642px", "-381px"],
    "ge": ["539px", "-381px"],
    "as": ["436px", "-381px"],
    "se": ["333px", "-381px"],
    "br": ["230px", "-381px"],
    "kr": ["127px", "-381px"],
    "rb": ["-52px", "-486px"],
    "sr": ["-155px", "-486px"],
    "y": ["-258px", "-486px"],
    "zr": ["-430px", "-485px"],
    "nb": ["1466px", "-485px"],
    "mo": ["1363px", "-485px"],
    "tc": ["1260px", "-485px"],
    "ru": ["1157px", "-484px"],
    "rh": ["1054px", "-484px"],
    "pd": ["951px", "-484px"],
    "ag": ["848px", "-484px"],
    "cd": ["745px", "-484px"],
    "in": ["642px", "-484px"],
    "sn": ["539px", "-484px"],
    "sb": ["436px", "-484px"],
    "te": ["333px", "-484px"],
    "i": ["230px", "-484px"],
    "xe": ["127px", "-484px"],
    "cs": ["-53px", "-589px"],
    "ba": ["-155px", "-589px"],
    "hf": ["-430px", "-587px"],
    "ta": ["1466px", "-587px"],
    "w": ["1363px", "-587px"],
    "re": ["1260px", "-587px"],
    "os": ["1157px", "-587px"],
    "ir": ["1054px", "-587px"],
    "pt": ["951px", "-587px"],
    "au": ["848px", "-587px"],
    "hg": ["745px", "-587px"],
    "tl": ["642px", "-587px"],
    "pb": ["539px", "-587px"],
    "bi": ["436px", "-587px"],
    "po": ["333px", "-587px"],
    "at": ["230px", "-587px"],
    "rn": ["127px", "-587px"],
    "fr": ["-53px", "-693px"],
    "ra": ["-155px", "-693px"],
    "rf": ["-430px", "-690px"],
    "db": ["1466px", "-690px"],
    "sg": ["1363px", "-690px"],
    "bh": ["1260px", "-690px"],
    "hs": ["1157px", "-690px"],
    "mt": ["1054px", "-690px"],
    "ds": ["951px", "-690px"],
    "rg": ["848px", "-690px"],
    "cn": ["745px", "-690px"],
    "nh": ["642px", "-690px"],
    "fl": ["539px", "-690px"],
    "mc": ["436px", "-690px"],
    "lv": ["333px", "-690px"],
    "ts": ["230px", "-690px"],
    "og": ["127px", "-690px"],
    "la": ["-258px", "-589px"],
    "ce": ["-430px", "-847px"],
    "pr": ["1466px", "-847px"],
    "nd": ["1363px", "-847px"],
    "pm": ["1260px", "-847px"],
    "sm": ["1157px", "-847px"],
    "eu": ["1054px", "-847px"],
    "gd": ["951px", "-847px"],
    "tb": ["848px", "-847px"],
    "dy": ["745px", "-847px"],
    "ho": ["642px", "-847px"],
    "er": ["539px", "-847px"],
    "tm": ["436px", "-847px"],
    "yb": ["333px", "-847px"],
    "lu": ["230px", "-847px"],
    "ac": ["-258px", "-693px"],
    "th": ["-430px", "-950px"],
    "pa": ["1466px", "-950px"],
    "u": ["1363px", "-950px"],
    "np": ["1260px", "-950px"],
    "pu": ["1157px", "-950px"],
    "am": ["1054px", "-950px"],
    "cm": ["951px", "-950px"],
    "bk": ["848px", "-950px"],
    "cf": ["745px", "-950px"],
    "es": ["642px", "-950px"],
    "fm": ["539px", "-950px"],
    "md": ["436px", "-950px"],
    "no": ["333px", "-950px"],
    "lr": ["230px", "-950px"]
}

const pertable_img_url = "https://upload.wikimedia.org/wikipedia/commons/4/4d/Periodic_table_large.svg"

var pertable;
var persymboldic = {}; // dict to translate between full name and symbol
$.get("https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/periodic-table-lookup.json", function(data) {
    pertable = JSON.parse(data);
}).done(function() {
    for (elem in pertable) {
        if (elem != "order") {
            persymboldic[pertable[elem]["symbol"].toLowerCase()] = elem;
        }
    }
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

    var firstrow = true;
    for (const elems of combis) {
        // insert spacer before content if we are not in the first row
        if (!firstrow) {
            var or = document.createElement("div");
            or.setAttribute("class", "centerdiv elemrowspacer");
            or.innerHTML = "OR";
            document.getElementById("peritable").appendChild(or);
        } else {firstrow = false;}

        var row = document.createElement("div");
        row.setAttribute("class", "centerdiv elemrow");
        for (var i = 0; i < elems.length; i++) {
            // display the element
            var div = document.createElement("div");
            div.setAttribute("class", "elements");
            div.setAttribute("id", "elem" + i);
            div.style.background = `url(${pertable_img_url}) ${elements[elems[i]][0]} ${elements[elems[i]][1]}`;
            div.style.backgroundSize = "2000px"

            // creating popup with more infos
            var span = document.createElement("span");
            span.setAttribute("class", "tooltiptext");
            span.setAttribute("id", "inelem" + i);

            if (specialsigns.includes(elems[i])) {
                span.innerHTML = "A simple whitespace, nothing severe!";
            } else {
                var text = pertable[persymboldic[elems[i]]]["summary"]
                if (text == null) {
                    text = "Unfortunately no data present :(";
                }
                span.innerHTML = text;
            }

            // add all to tree
            div.appendChild(span);
            row.appendChild(div);
            document.getElementById("peritable").appendChild(row);
        }

    }
}

function rm_swaps(array) {
    // removes one array if it exists forward and backwards
    // attention: doesnt remove doubles
    // but in my application there cant be any doubles
    console.log(array)
    var out = [];
    for (let i = 0; i < array.length; i++) {
        var rev_ind = out.indexOfArray(array[i].slice().reverse())
        console.log(out)
        console.log(rev_ind)
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
    var writingin = document.getElementById("input").value.toLowerCase();

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