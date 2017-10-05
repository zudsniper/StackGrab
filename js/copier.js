/**
 * Created by jason on 10/3/17.
 */

var OSName = "Unknown";
if (window.navigator.userAgent.indexOf("Windows NT 10.0")!= -1) OSName="Windows 10";
if (window.navigator.userAgent.indexOf("Windows NT 6.2") != -1) OSName="Windows 8";
if (window.navigator.userAgent.indexOf("Windows NT 6.1") != -1) OSName="Windows 7";
if (window.navigator.userAgent.indexOf("Windows NT 6.0") != -1) OSName="Windows Vista";
if (window.navigator.userAgent.indexOf("Windows NT 5.1") != -1) OSName="Windows XP";
if (window.navigator.userAgent.indexOf("Windows NT 5.0") != -1) OSName="Windows 2000";
if (window.navigator.userAgent.indexOf("Mac")            != -1) OSName="Mac/iOS";
if (window.navigator.userAgent.indexOf("X11")            != -1) OSName="UNIX";
if (window.navigator.userAgent.indexOf("Linux")          != -1) OSName="Linux";

var hoveredCode = "";
var hoveredWrapper;

addCopyIcons();

function addCopyIcons() {

    var copyIconURL = chrome.extension.getURL("resources/font-awesome-copy.svg");

    $("pre code").each(function( index ) {
        $(this).parent().wrap("<div class='copy-wrapper'></div>");

        var wrapper = $(this).parent().parent();

        wrapper.append(
            "<img class='svg copy-btn' src=' "+ copyIconURL +"'>"
        );

        var preHeight = $(this).parent().height();

        if(preHeight >= 50) {
            $(this).parent().parent().children(".copy-btn").each(function() {
                $(this).attr({height: '25', width: '25'});
            });
        } else {
            $(this).parent().parent().children(".copy-btn").each(function() {
                $(this).attr({height: '16', width: '16'});
            });
        }
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
                   });
               });
       });


       $(this).click(function() {
           copyTextToClipboard(copy($(this).prev(".prettyprint").find("code")));
           showCopiedStatus($(this).parent());
       });

       initCopyKeybind($(this).parent());
    });
}

/**
 * @param copy-wrapper
 */
function showCopiedStatus( wrapper ) {
    wrapper.each(function() {
        $(this).prepend("<span class='copied-popup'>Copied. </span>");
        $(this).find('.copy-popup').remove();
    });
}

/**
 * @param copy-wrapper
 */
function initCopyKeybind( wrapper ) {
    wrapper.hover(function() {
            hoveredCode = copy(wrapper.children("pre").children("code"));
            hoveredWrapper = wrapper;
            document.addEventListener('keydown',shortcutCopy, false);
        },
        function() {
            $(this).children(".copied-popup").remove();
            document.removeEventListener('keydown', shortcutCopy);
        });
}

var lastKey;

function shortcutCopy( e ) {


    // make sure there's not a selection that is within the code element you would be copying, being that if there is, the
    // user wants to be able to copy that specific subset of the text, not the whole text.
    if (($(window.getSelection().anchorNode).parent().parent().parent().parent().attr('class') != 'copy-wrapper' )
        || (window.getSelection().anchorNode==null)) {

        var condition = (e.ctrlKey && e.key == "c");

        if (OSName == "Mac/iOS") {

            var cmdPressedLast = false;

            if (lastKey != null) {
                if (lastKey == "Meta") {
                    cmdPressedLast = true;
                }
            }
            lastKey = e.key;

            condition = (cmdPressedLast && e.key == "c");
        }

        if (condition) {
            copyTextToClipboard(hoveredCode);
            showCopiedStatus(hoveredWrapper);
        }
    }
}

/**
 * 'pre code' jquery element
 * @param codeblock
 * @returns copiedcode
 */
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

    //credit assignment starts here

    var creditFooter = codeblock.parent().parent().parent().find(".fw");

    var userActionTime = creditFooter.find("div.user-action-time");
    var userDetails = creditFooter.find("div.user-details");

    var numAuthors = 0;
    userActionTime.each(function( index ) {
        numAuthors = numAuthors + 1;
    });

    if(numAuthors <= 1) {

        userActionTime = userActionTime.children(":first").text().replace(/\s/g,'');
        userDetails = userDetails.children(":first");

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

/**
 *  Add text to clipboard
 * @param text
 */

function copyTextToClipboard(text) {
    var copyFrom = $('<textarea/>');
    copyFrom.text(text);
    $('body').append(copyFrom);
    copyFrom.select();
    document.execCommand('copy');
    copyFrom.remove();
}