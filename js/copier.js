/**
 * Created by jason on 10/3/17.
 */

addCopyIcons();

function addCopyIcons() {
    $("pre code").each(function( index ) {
        $(this).parent().append("<img src='/resources/copyicon.png' height='40' width='40'>");
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

    var creditFooter = codeblock.parent().parent().find(".fw");

    var userActionTime = creditFooter.find("div[class=user-action-time]");
    var userDetails = creditFooter.find("div[class=user-details]");

    var numAuthors = 0;
    userActionTime.each(function( index ) {
        numAuthors++;
    });

    if(numAuthors == 1) {

        userActionTime = userActionTime.get(0).text().replace(/\s/g,'');
        userDetails = userDetails.get(0);

        if (userActionTime == 'asked') {
            text = text + "\n" + commentCharacters + "Code by: " + userDetails.find("a").text();
        } else if (userActionTime == 'answered') {
            text = text + "\n" + commentCharacters + "Code by: " + userDetails.find("a").text();
        }
    } else {

        var author = "Anonymous";
        var editor = "Anonymous";

        userActionTime.each(function( index ){
           if($(this).text().replace(/\s/g,'')=='answered') {
             author =  $(this).nextAll("div[class=user-details]").find("a").text();
           } else if($(this).text().replace(/\s/g,'')=='edited') {
              editor =  $(this).nextAll("div[class=user-details]").find("a").text();
           }
        });

        text = text + "\n" + commentCharacters + "Code by: " + author
            + "\n"+ commentCharacters +"Edited by: " + editor;

    }

    return text;
}