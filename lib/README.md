<!--
 Copyright 2021 Anthony Mugendi
 
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 
     http://www.apache.org/licenses/LICENSE-2.0
 
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
-->

# Why?
Type inference is important when you are dealing with arbitrary data. It is however even more important when toy want to use that data in a "type-safe" manner like adding into database tables with specific, strict schema.

This module tries it's best to not only infer datatype but also add important metadata to indicate type specificity. For example, Strings can also be "CHAR", "TINYTEXT", "TEXT" specific. Dates can be "DATE" or "DATETIME" specific.

This module tries to model types against MYSQL Data Types as indicated [Here](https://www.w3schools.com/sql/sql_datatypes.asp).

## Usage
Install ```yarn add type-infer``` then:

```javascript

    //This example checks different datatypes via a loop
    //See test.js for more...

    const type = require('type-infer');

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
    
    console.log(JSON.stringify(resp, 0, 4));

```

This will log the following JSON:

```javascript

    [
      {
        value: '2021-07-23T07:50:10.858Z',
        type: 'DATE',
        specific: 'DATETIME'
      },
      { value: '2021-03-31', type: 'DATE', specific: 'DATE' },
      { value: '12:34', type: 'TIME', specific: '24HR' },
      { value: '13:55', type: 'TIME', specific: '24HR' },
      { value: '1:23 pm', type: 'TIME', specific: '12HR' },
      { value: 'this is a string', type: 'STRING', specific: 'TINYTEXT' },
      { value: 'a', type: 'STRING', specific: 'CHAR' },
      {
        value: 'dKrmgnsa23BzNoloEK07fcTO1YUtqZm8phkrbjrE4RAAc3lRuDhjYDAdTh5XnvHhLGzyFzxsNLTYab0p4e4lUpcHo5DU420fgEAvFAE9fLhOSPwEv9cDPoYoQ2ZMPXZ65ykx0Am8EdDp5OD1Ya9z5doQU87rDjhIUVG1blU4K1DOR2jGgiwiACWnygNWfLYJX8M8kF57',
        type: 'STRING',
        specific: 'TINYTEXT'
      },
      {
        value: 'iphxL9jfWUlrUKIq8S2nUluMkRrVBT1mhZq2OgHqVE0fRpslnXRNaBbzikKICEgn94BL60CkGHtRufDFiG6XoqgRYZqvLCGS0mY0RjE7esBsLLKbbxiItcuodwlsV4SMkmyPXQ4pJmq6EhiT3zFPQOY7BaKEHck4Q2z7VkoIP11iWaxWvLtSrbfLRWNXhgY7gUP6qFRVA9EzbTbkFpVyYguNcLjQTB8VCM3HY7Y3CtPxUbTdV2NrydVWTigkismLVUEpBHswGMu1RhJ4AP5qq89b1dHem9L0ZVo3P8EI31lUogqp9YPicWuumZ7xGsqhsPKklRoTjyQEnqs0pcIG0PWdJJTwx9wrOCjN7vWbifBiuuFY3PqptEwBFIzQZ2QSbd2iZjgm3v7wdOmq94nfbRXY8nyeVtWD7kzByEdFcMBQqtuti8pxVo1Z3FGj5jbL7bNJtzdfTADPTOz5nN8W4ffTNSbcmX3qANTzsIjOyFIXuzwPYV7ZKJC4UK0zd0zXqJwDAxc6WI90SXaqg3rDRyu05jeCrIoOMaL2k9p6fACyGW6Sk7kfRPkMqr8887zzoKMwGbNIxnjwq0GwC0aeoUFpjzDgEwgrpbgiwBOH5ZkaJSZ2EvwTRNuzTEL8dcUNMkvOyhjE6p80SkdWfpLJuq9TrpgLXgnnpZcWlphjpC8tgSRs496KTZg56nQu',
        type: 'STRING',
        specific: 'TEXT'
      },
      { value: 18890, type: 'NUMBER', specific: 'INT' },
      { value: 43564, type: 'NUMBER', specific: 'INT' },
      { value: -23, type: 'NUMBER', specific: 'INT' },
      { value: -3673462, type: 'NUMBER', specific: 'INT' },
      { value: '9223372036854775808', type: 'NUMBER', specific: 'BIGINT' },
      { value: '-9223372036854775808', type: 'NUMBER', specific: 'BIGINT' },
      { value: 322.34, type: 'NUMBER', specific: 'FLOAT' },
      { value: 332.78, type: 'NUMBER', specific: 'FLOAT' },
      {
        value: '9223372036854775808.889',
        type: 'NUMBER',
        specific: '*FLOAT'
      },
      { value: true, type: 'BOOLEAN', specific: 'NONE' },
      { value: false, type: 'BOOLEAN', specific: 'NONE' }
    ]    

```

**Note:** 

- The **specific** types with an asterisk (*) such as *FLOAT. This means that the float is based on a number that Javascipt cannot guarantee precision of. [Read More](https://www.avioconsulting.com/blog/overcoming-javascript-numeric-precision-issues)

- Also note that with BIGINT and *FLOAT types return a stringified version of the value in a bid to try and maintain precision.

- Below is the helper function for the example above.

```

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

```
