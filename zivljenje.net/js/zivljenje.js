var zivljenjenet = {
    selectedServiceContainer: {
        visible: false
    }
};

$(document).ready(function () {
    //Email address
    content_HELPER(["EMAIL", "email"]);

    //Copyright
    content_HELPER(["COPYRIGHT", "copyright"]);

    //Attach event handler(s)
    $("#cookieConsent").on("click", function (e) {
        cookieConsent(e);
    });

    $("#closeSelectedService").on("click", function (e) {
        serviceContainer_HANDLER(["selectedService", ""]);
    });

    $("#individualTherapy").on("click", function (e) {
        serviceContainer_HANDLER(["selectedService", "individual.json"]);
    });

    $("#groupTherapy").on("click", function (e) {
        serviceContainer_HANDLER(["selectedService", "group.json"]);
    });

    $("#learningTherapy").on("click", function (e) {
        serviceContainer_HANDLER(["selectedService", "learning.json"]);
    });

    $("#workshop").on("click", function (e) {
        serviceContainer_HANDLER(["selectedService", "workshop.json"]);
    });

    $("#labourTherapy").on("click", function (e) {
        serviceContainer_HANDLER(["selectedService", "childbirth.json"]);
    });

    $("#nonlabourTherapy").on("click", function (e) {
        serviceContainer_HANDLER(["selectedService", "nonpregnancy.json"]);
    });
   
    //Check cookie
    checkCookie("cookieConsent");
});

function serviceContainer_HANDLER(localArgs) {
    //Resolve state of the container
    
    var _containerVisible = zivljenjenet.selectedServiceContainer.visible;
    console.log(":: _containerVisible :: " + _containerVisible);
    //Show container/hide container
    if (_containerVisible == false) {
        //Show container
        $("#" + localArgs[0]).show("slow");

        //Update container status in model
        zivljenjenet.selectedServiceContainer.visible = true;

        //Trigger service read
        serviceDetail_XHR(localArgs);
    }
    else {
        //Check the source of the call. If localArgs[1] are empty then its close command otherwise user must have clicked another service. 
        //In that case do not close window
        console.log(":: localArgs[1].length :: " + localArgs[1].length);
        if (localArgs[1].length > 0) {
            console.log(":: ITS ALREADY OPENED ::");
            //Update container status in model
            zivljenjenet.selectedServiceContainer.visible = true;

            //Trigger service read
            serviceDetail_XHR(localArgs);

            return;
        }
        else {
            console.log(":: CLOSING ::");
            //Hide container
            //$("#" + localArgs[0]).hide();
            $("#" + localArgs[0]).slideUp();

            //Update container status in model
            zivljenjenet.selectedServiceContainer.visible = false;

            //Exit funtion, no need for data if container is hidden
            return;
        }
    }
}

function serviceDetail_XHR(localArgs) {

    //Path to JSON file repo
    var _url = "data/" + localArgs[1];

    //Retrive JSON files
    $.getJSON(_url, function (data) {

        //Pass recieved data to display function
        serviceDetail_HELPER(data);
    });
}

function serviceDetail_HELPER(data) {
    //Remove all current content from destination placeholders
    $("#selectedServiceTitle").text("");
    $("#selectedServiceDesc").empty();

    //Place content into designated containers
    $("#selectedServiceTitle").text(data.title);

    $("#selectedServiceDesc").append('<p>' + data.description + '</p>');
}

function content_HELPER(localArgs) {
    if (localArgs[0] == "EMAIL") {
        $("#" + localArgs[1]).html('<a href="mailto:vita.rozman@gmail.com?subject=Povpraševanje">vita.rozman@gmail.com</a>');
    }
    else if (localArgs[0] == "COPYRIGHT") {
        var _today = new Date();
        var _year = _today.getFullYear();

        $("#" + localArgs[1]).html('Copyright zivljenje.net &copy;' + _year + ' :: Vse pravice pridržane.');
    }
    else {
        //Not implemented
    }
}

//Cookie button handler
function cookieConsent(event) {
    //Set cookie
    var d = new Date();
    d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = "cookieConsent" + "=" + 1 + "; " + expires;

    //Trigger another cookie check
    checkCookie("cookieConsent");
}

//Cookie checker
function checkCookie(cookie) {
    var _cookiePresent = siteCookies.getItem(cookie);

    if (_cookiePresent == null) {
        //Show cookie section
        $("#cookieContainer").show("slow");
    }
    else {
        //Show cookie section
        $("#cookieContainer").hide("slow");
    }
}

//Cookies
//A complete cookies reader/writer framework with full unicode support. Thanks to cookies.js
var siteCookies = {
    getItem: function (sKey) {
        if (!sKey) { return null; }
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    },
    setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
        var sExpires = "";
        if (vEnd) {
            switch (vEnd.constructor) {
                case Number:
                    sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                    break;
                case String:
                    sExpires = "; expires=" + vEnd;
                    break;
                case Date:
                    sExpires = "; expires=" + vEnd.toUTCString();
                    break;
            }
        }
        document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
        return true;
    },
    removeItem: function (sKey, sPath, sDomain) {
        if (!this.hasItem(sKey)) { return false; }
        document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
        return true;
    },
    hasItem: function (sKey) {
        if (!sKey) { return false; }
        return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    },
    keys: function () {
        var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
        for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
        return aKeys;
    }
};