function bbcodeToHtml(html) {
    //iframes
    html = html.replace(/(\[iframe\])(https:\/\/(fr\.|en\.|)vittascience\.com[a-zA-Z0-9?=&\/﻿]+)(\[\/iframe\])/gi, "<iframe width='100%' height='500' frameborder='0' allowfullscreen style='border:1px #d6d6d6 solid;' src=\"$2&embed=1&frameid=" + generateRandomString(6) + "\"></iframe>")
    html = html.replace(/(\[iframe\])(http:\/\/51\.178\.95\.45[a-zA-Z0-9?=&\/]+)(\[\/iframe\])/gi, "<iframe width='100%' height='500' frameborder='0' allowfullscreen style='border:1px #d6d6d6 solid;' src=\"$2&embed=1&frameid=" + generateRandomString(6) + "\"></iframe>")
    html = html.replace(/(\[iframe\])(http:\/\/vittascience[a-zA-Z0-9?=&\/\\]+)(\[\/iframe\])/gi, "<iframe width='100%' height='500' frameborder='0' allowfullscreen style='border:1px #d6d6d6 solid;' src=\"$2&embed=1&frameid=" + generateRandomString(6) + "\"></iframe>")
    html = html.replace(/(\[iframe\])(https:\/\/(vgamma|valpha|vbeta|vdelta|vdemo).vittascience[a-zA-Z0-9?=&\/\\\.]+)(\[\/iframe\])/gi, "<iframe width='100%' height='500' frameborder='0' allowfullscreen style='border:1px #d6d6d6 solid;' src=\"$2&embed=1&frameid=" + generateRandomString(6) + "\"></iframe>")

    html = html.replace(/(\[iframe\])(https:\/\/view\.genial\.ly[a-zA-Z0-9?=&_\-\/﻿]+)(\[\/iframe\])/gi, "<iframe width='100%' height='500' frameborder='0' allowfullscreen style='border:1px #d6d6d6 solid;' src=\"$2\"></iframe>");
    html = html.replace(/(\[iframe\])(https:\/\/docs\.google\.com[a-zA-Z0-9?=&_\-\/﻿]+)(\[\/iframe\])/gi, "<iframe width='100%' height='500' frameborder='0' allowfullscreen style='border:1px #d6d6d6 solid;' src=\"$2\"></iframe>");
    // Cabri iframe
    html = html.replace(/(\[iframe\])(http(s)?:\/\/.*?)(\[\/iframe\])/gi, "<iframe style='width: 100%; height: 100%;' frameborder='0' allowfullscreen style='border:1px #d6d6d6 solid;' src=\"$2\"></iframe>");

    //url
    html = html.replace(/(href=)/gi, " target=\"_blank\" $1")
    html = html.replace(/(\[url=)(.+?(?=\]))(\])(.+?(?=\[))(\[\/url\])/gi, "<a href='$2' target=\"_blank\">$4</a>")

    //pdf
    html = html.replace(/(\[embed\])(.+)(\[\/embed\])/gi, "<embed width=100% height=500 type=\"application/pdf\" src=\"$2\"/>")
    html = html.replace(/\[embed=A4\](.+)\[\/embed\]/gi, "<embed class='pdf-a4' type='application/pdf' src='$1'/>")

    //vimeo
    html = html.replace(/(\[vimeo\])([a-zA-Z0-9?=\-_&\/]+)(\[\/vimeo\])/gi, "<iframe src=\"https://player.vimeo.com/video/$2\" allowfullscreen allow='autoplay'>")

    //youtube
    html = html.replace(/(\[video\])([a-zA-Z0-9?=\-_&\/]+)(\[\/video\])/gi, "<iframe src='https://www.youtube.com/embed/$2' width=\"100%\" height=\"480\" frameborder=\"0\" allowfullscreen></iframe>")

    //peertube
    html = html.replace(/(\[peertube\])([a-zA-Z0-9?=\-_&.:\/]+)(\[\/peertube\])/gi, "<iframe src='$2' width=\"100%\" height=\"480\" frameborder=\"0\" allowfullscreen></iframe>")

    //bold
    html = html.replace(/\[b\]/gi, "<strong>")
    html = html.replace(/\[\/b\]/gi, "</strong>")
    //list
    html = html.replace(/\[list\]/gi, "<ul>")
    html = html.replace(/\[\/list\]/gi, "</ul></br>")
    html = html.replace(/\[\*\]/gi, "<li>")
    html = html.replace(/\[\/\*\]/gi, "</li>")
    //italic
    html = html.replace(/\[i\]/gi, "<i>")
    html = html.replace(/\[\/i\]/gi, "</i>")
    //underline
    html = html.replace(/\[u\]/gi, "<u>")

    html = html.replace(/\[\/u\]/gi, "</u>")
    //image
    html = html.replace(/(\[img)([a-zA-Z0-9?=&\/\\:\-,\+%._]*)(\])([a-zA-Z0-9éàçèïîôâàë?=&\/\\:%.\-\+\)\(_]+)(\[\/img\])/gi, "<img src='$4'/>")
    //line return
    html = html.replace(/\n/gi, "</br>")
    //exponent
    html = html.replace(/\[exp\]/gi, "<sup>")
    html = html.replace(/\[\/exp\]/gi, "</sup>")
    //right
    html = html.replace(/\[right\]/gi, "<p style='text-align:right;'>")
    html = html.replace(/\[\/right\]/gi, "</p>")
    //left
    html = html.replace(/\[left\]/gi, "<p style='text-align:left;'>")
    html = html.replace(/\[\/left\]/gi, "</p>")
    //center
    html = html.replace(/\[center\]/gi, "<p style='text-align:center;'>")
    html = html.replace(/\[\/center\]/gi, "</p>")
    //quote
    html = html.replace(/\[quote([=]?.*?)\]/gi, "<p style='font-style: italic;'>$1 a dit : </p><p style='text-align:center;background-color:var(--bg-1);'><span style='font-size:2em;'>\"</span>")
    html = html.replace(/\[\/quote\]/gi, "<span style='font-size:2em;'>\"</span></p>")

    //size
    html = html.replace(/\[size\=([0-9]{1,3})]/gi, "<span style='font-size:$1px;'>")
    html = html.replace(/\[\/size\]/gi, "</span>")
    return html
}

function generateRandomString(length = 10) {
    let characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let randomString = '';
    for (let i = 0; i < length; i++) {
        randomString += characters.charAt(getRandomInt(characters.length - 1));
    }
    return randomString;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
