// Copyright 2021 Anthony Mugendi
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const regexList = require("./lib/regex-list");

// console.log(regexList);

function type(value, opts = {}) {

    if (opts.constructor.name !== "Object") {
        throw new Error(`Options argument must be an Object`);
    }

    opts = Object.assign({
        parseTime: false,
        parseDate: true,
        parseNumber: true
    }, opts);

    let type, testVal, strVal = value ? value.toString().trim() : null;

    if (value === null) type = "Null";
    else if (value === undefined) type = "Undefined";
    else type = value.constructor.name;


    if (type == 'String') {

        if (opts.parseNumber) {
            // test if string
            testVal = Number(value);
            if (isNaN(testVal) === false) {
                type = 'Number';
                value = testVal;
            }
        }

        // Test if date
        if (opts.parseDate) {
            if (regexList.isDate.test(value) || regexList.isDateTime.test(value))
                if (isNaN((new Date(value)).getTime()) == false) type = "DATE";
        }

        // test time. Cannot be reliable as any values such as 21:45 will pass for time
        // so only parse if flag is provided
        if (opts.parseTime)
            if (value, regexList.isTime.test(value)) type = "TIME";

    }

    // 
    // console.log(-9 % 1);
    type = type.toUpperCase();

    // console.log(opts);

    let specific = opts && 'function' == typeof opts.specify ?
        opts.specify(type, value) :
        specify(type, strVal);

    if (value)
        value = value.toString() == strVal ? value : strVal;

    return {
        value,
        type,
        specific
    }

}

function specify(type, value) {

    let specific = null;


    switch (type) {
        case 'NUMBER':
            // test for floats

            // integer
            if (Number.isSafeInteger(Number(value))) specific = "INT";
            else specific = "BIGINT";


            if (regexList.isFloat.test(value)) {
                if (Number.isSafeInteger(Number(value.split('.').shift()))) specific = "FLOAT";
                else specific = "*FLOAT";
            }

            break;

        case "DATE":

            if (value, regexList.isTime.test(value)) specific = "TIME";
            if (value, regexList.isDateTime.test(value)) specific = "DATETIME";
            if (value, regexList.isDate.test(value)) specific = "DATE";
            break

        case "STRING":

            if (value.length == 1) specific = "CHAR";

            else if (value.length > 1 && value.length <= 255) specific = "TINYTEXT";

            else if (value.length > 255 && value.length <= 65535) specific = "TEXT";

            else if (value.length > 65535 && value.length <= 16777215) specific = "MEDIUMTEXT";

            else if (value.length > 16777215 && value.length <= 4294967295) specific = "LONGTEXT";
            break;

        case "TIME":

            if (/([ap]m$)/.test(value)) specific = '12HR'
            else specific = '24HR'

            break;

        default:
            specific = "NONE"
            break;
    }


    return specific

}


module.exports = type