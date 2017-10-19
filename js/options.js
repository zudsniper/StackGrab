/**
 * Created by jason on 10/19/17.
 */

class Options {
    constructor(citesources, langdetect) {
        this.citesources = citesources;
        this.langdetect = langdetect;
    }

    populate() {
        //TODO: temporary, non-scalable so has to die
        if($("#cite-sources").is(":checked")) {
            this.citesources = true;
        }
        if($("#lang-detect").is(":checked")) {
            this.langdetect = true;
        }
    }

    get getCiteSources() {
        return this.citesources;
    }

    get getLangDetect() {
        return this.langdetect;
    }
}

var options = new Options();

$("#save-options").click(function() {
    options.populate();
});

options.populate();
