const hbs = require('hbs')

hbs.registerHelper('eq', function (a, b) {
    return a == b;
});

hbs.registerHelper('ifeq', function (value1, value2, options) {
    if (value1 === value2) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

hbs.registerHelper('ifnoteq', function (a, b, options) {
    if (a != b) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

hbs.registerHelper('or', function (a, b) {
    return a || b;
});

hbs.registerHelper("json", function (context) {
    return JSON.stringify(context);
});

// register partial

// hbs.registerHelper('calcTotal',function(quantity,price){
//     return ""
// })