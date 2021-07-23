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

const type = require('.');


let opts = {
    parseTime: true,
    parseDate: true,
    parseNumber: true
};



let vals = [
    // Date with time
    new Date().toISOString(),
    // Date alone
    '2021-03-31',
    // Time
    '12:34', '13:55', '1:23 pm',
    // strings
    "this is a string", "a", randomStr(200), randomStr(700),
    // integers
    18890, "43564", -23, '-3673462',
    // big integers
    '9223372036854775808', '-9223372036854775808',
    // floats
    322.34, "332.78", '9223372036854775808.889',
    //booleans
    true, false

]

let resp = vals.map(val => type(val, opts));

console.log(resp);


function genLongStr(length) {
    let str = '';


    for (i = 0; i <= length; i++) {
        str += randomStr();
    }

    return str;
}

function randomStr(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}