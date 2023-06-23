"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.convertTimestampToDate = (_a) => {
    var { created_at } = _a, otherProperties = __rest(_a, ["created_at"]);
    if (!created_at)
        return Object.assign({}, otherProperties);
    return Object.assign({ created_at: new Date(created_at) }, otherProperties);
};
exports.createRef = (arr, key, value) => {
    return arr.reduce((ref, element) => {
        ref[element[key]] = element[value];
        return ref;
    }, {});
};
exports.formatComments = (comments, idLookup) => {
    return comments.map((_a) => {
        var { created_by, belongs_to } = _a, restOfComment = __rest(_a, ["created_by", "belongs_to"]);
        const article_id = idLookup[belongs_to];
        return Object.assign({ article_id, author: created_by }, this.convertTimestampToDate(restOfComment));
    });
};
