var mqtt = require('mqtt')
var jsonata = require("jsonata");

/* 
let a = {
    topic: 'fromtopic',
    metadata:{},
    payload: {
        example: [
            { value: 4 },
            { value: 7 },
            { value: 13 }
        ]
    }
}
let b = {
    topic: 'totopic',
    metadata:{},
    payload: {}
} 
*/

const message_expression = `{'topic':topic,'sum':$sum(message.example.value)}`;
const topic_expression = `'totopic'`;
const metadata_expression = `'metadata'`;

function a2b(a, message_expression, topic_expression, metadata_expression) {
    let b = {}
    // 格式转换表达式
    b.message = jsonata(message_expression).evaluate(a);
    b.topic = jsonata(topic_expression).evaluate(a);
    b.metadata = jsonata(metadata_expression).evaluate(a);
    console.log(b)
    return b

}


// test-demo
let a = {
    topic: 'fromtopic',
    metadata: {},
    message: {
        example: [
            { value: 4 },
            { value: 7 },
            { value: 13 }
        ]
    }
}

a2b(a, message_expression, topic_expression, metadata_expression, metadata_expression)