/**
 * Created by jason on 10/3/17.
 */

/*
 * Replace all SVG images with inline SVG
 */

addCopyIcons();

function addCopyIcons() {

    var copyIconURL = chrome.extension.getURL("resources/font-awesome-copy.svg");

    $("pre code").each(function( index ) {
        $(this).parent().wrap("<div class='copy-wrapper'></div>");

        var wrapper = $(this).parent().parent();

        wrapper.append(
            "<img class='svg copy-btn' src=' "+ copyIconURL +"' height='40' width='40'>"
        );
    });

    $(".copy-btn").each(function( index ) {

       $(this).hover(
           function() {
               $(this).parent().each(function() {
                $(this).prepend("<span class='copy-popup'>Copy</span>");
           });
        },
           function() {
              $(this).parent().each(function() {
                   $(this).children(":first.copy-popup, .copied-popup").each(function() {
                       $(this).remove();
                   })
               });
       });


       $(this).click(function() {
           copyTextToClipboard(copy($(this).prev(".prettyprint").find("code")));
           $(this).parent().each(function() {
               $(this).prepend("<span class='copied-popup'>Copied. </span>");
               $(this).find('.copy-popup').remove();
           });
       });
    });
}


// 'pre code' jquery element
function copy( codeblock ) {

    var language;
    var text = "";
    var commentCharacters = '//';

   var classList = codeblock.parent().attr('class').split(/\s/);

    $.each(classList, function(index, item) {
        if (item.substring(0, 5) === 'lang-') {
           language = item.substring(5);
        }
    });

    codeblock.find("span").each(function( i ) {
       text = text + $(this).text();
    });

    //check comment type database, for now assume // is comment

    //credit

    var creditFooter = codeblock.parent().parent().parent().find(".fw");

    var userActionTime = creditFooter.find("div.user-action-time");
    var userDetails = creditFooter.find("div.user-details");

    var numAuthors = 0;
    userActionTime.each(function( index ) {
        numAuthors = numAuthors + 1;
    });

    alert(numAuthors);

    if(numAuthors <= 1) {

        userActionTime = userActionTime.children(":first").text().replace(/\s/g,'');
        userDetails = userDetails.children(":first");

        alert("user action time: " + userActionTime + "\nuser details: " + userDetails);

        if (userActionTime == 'asked') {
            text = text + "\n" + commentCharacters + "Code by: " + userDetails.children("a").text();
        } else if (userActionTime == 'answered') {
            text = text + "\n" + commentCharacters + "Code by: " + userDetails.children("a").text();
        }
    } else {

        var author = "Anonymous";
        var editor = "Anonymous";

        userActionTime.each(function( index ){
           if($(this).text().replace(/\s/g,'')=='answered') {
             author =  $(this).nextAll("div.user-details").children("a").text();
           } else if($(this).text().replace(/\s/g,'')=='edited') {
              editor =  $(this).nextAll("div.user-details").children("a").text();
           }
        });

        text = text + "\n" + commentCharacters + "Code by: " + author
            + "\n"+ commentCharacters +"Edited by: " + editor;

    }

    return text;
}

function copyTextToClipboard(text) {
    var copyFrom = $('<textarea/>');
    copyFrom.text(text);
    $('body').append(copyFrom);
    copyFrom.select();
    document.execCommand('copy');
    copyFrom.remove();
}

function imgToSVG() {
    $('img.svg').each(function () {
        var $img = jQuery(this);
        var imgID = $img.attr('id');
        var imgClass = $img.attr('class');
        var imgURL = $img.attr('src');

        $.get(imgURL, function (data) {
            // Get the SVG tag, ignore the rest
            var $svg = jQuery(data).find('svg');

            // Add replaced image's ID to the new SVG
            if (typeof imgID !== 'undefined') {
                $svg = $svg.attr('id', imgID);
            }
            // Add replaced image's classes to the new SVG
            if (typeof imgClass !== 'undefined') {
                $svg = $svg.attr('class', imgClass + ' replaced-svg');
            }

            // Remove any invalid XML tags as per http://validator.w3.org
            $svg = $svg.removeAttr('xmlns:a');

            // Replace image with new SVG
            $img.replaceWith($svg);

        }, 'xml');


    });
}