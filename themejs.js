(function ($) {

Drupal.themejs = {};

/**
 * Versi javascript dari fungsi PHP url().
 * @todo: support for absolute.
 */
Drupal.themejs.url = function (path, options) {
    if (Drupal.urlIsLocal(path)) {
        path = Drupal.settings.basePath + path;
    }
    if (options.query) {
        var stringify = $.param(options.query);
        if (stringify.length != 0) {
            path += '?' + stringify
        }
    }
    if (options.fragment) {
        path += '#' + encodeURIComponent(options.fragment)
    }
    return path;
}

/**
 * Memberikan beberapa default informasi element sebagai array,
 * sehingga bisa langsung append value ke array.
 */
Drupal.themejs.defaultElement = function () {
    return ['', {class:[], attributes:[]},[]];
}

/**
 * Mengubah struktur array berisi info element menjadi HTML string.
 *
 * @param element,
 *   Jika string, maka langsung return string tersebut.
 *   Jika array, maka harus mengikut konvensi sbb:
 *   Hanya terdiri dari 3 element. Element pertama adalah tag
 *   element HTML (string). Element kedua adalah object sederhana
 *   berisi informasi attribute. Property menjadi informasi attribute.
 *   Property khusus bernama `attributes` digunakan untuk menampung
 *   nama attributes yang ribet. Element ketiga adalah string atau array
 *   yang berarti body dari tag element. Jika array, maka akan dilakukan
 *   recursive render.
 *
 * Contoh: ['a',{},'Click me'] akan menjadi <a>Click me</a>
 * Contoh: ['span',{class: "light", attributes: [['data-is-left','true'],['data-direct','up']]},'Toggle']
 * akan menjadi <span class="light" data-is-left="true" data-direct="up">Toggle</span>
 * Contoh: ['div',{id: 'ID', class:['red', 'dark']},[['a',{},'Click me'],['a',{},'Click me again']]]
 * akan menjadi <div id="ID" class="red dark"><a>Click me</a><a>Click me again</a></div>
 */
Drupal.themejs.renderElement = function (element) {
    if (typeof element == 'string') {
        return element;
    }
    // Validate.
    if (!$.isArray(element)) {
        return '';
    }
    if (element.length != 3) {
        return '';
    }
    if (typeof element[0] != 'string') {
        return '';
    }
    if (typeof element[1] != 'object') {
        return '';
    }
    if (!element[1].attributes || !$.isArray(element[1].attributes)) {
        element[1].attributes = [];
    }
    var attributes = element[1].attributes;
    delete element[1].attributes;
    // Render.
    var string = '<'+element[0];
    for (x in element[1]) {
        attributes.push([x, element[1][x]])
    }
    for (x in attributes) {
        // Validate again.
        if ($.isArray(attributes[x]) && attributes[x].length == 2) {
            string += ' ' + Drupal.checkPlain(attributes[x][0]);
            var value = attributes[x][1];
            if ($.isArray(attributes[x][1])) {
                value = attributes[x][1].join(' ');
            }
            string += '="' + Drupal.checkPlain(value) + '"';
        }
    }
    string += '>';
    if (typeof element[2] == 'string') {
        string += element[2];
    }
    else if ($.isArray(element[2])) {
        for (x in element[2]) {
            string += Drupal.themejs.renderElement(element[2][x]);
        }
    }
    string += '</'+element[0]+'>';
    return string;
}

/**
 * Memberikan fitur untuk cache.
 */
Drupal.themejs.cache = {
    get: function (cid) {
        if (Drupal.themejs.cache.repository[cid]) {
            return Drupal.themejs.cache.repository[cid];
        }
        return null
    },
    set: function (cid, object) {
        if (typeof cid != 'string') {
            return false;
        }
        var value = (typeof object == 'object') ? JSON.parse(JSON.stringify(object)) : object;
        Drupal.themejs.cache.repository[cid] = value;
    },
    repository: {}
}

})(jQuery);
