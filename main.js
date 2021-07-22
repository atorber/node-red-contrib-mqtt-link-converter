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

function a2b(client, a, message_expression, topic_expression, metadata_expression) {
    let b = {}
    // 格式转换表达式
    b.message = jsonata(message_expression).evaluate(a);
    b.topic = jsonata(topic_expression).evaluate(a);
    // b.metadata = jsonata(metadata_expression).evaluate(a);
    console.log(b)
    client.publish(b.topic, JSON.stringify(b.message))

}

var client = mqtt.connect('mqtt://test.mosquitto.org')

client.on('connect', function () {
    client.subscribe('fromtopic', function (err) {
        if (!err) {
            let a =
            {
                example: [
                    { value: 4 },
                    { value: 7 },
                    { value: 13 }
                ]
            }
            client.publish('fromtopic', JSON.stringify(a))
        }
    })
    client.subscribe('totopic', function (err) {
        if (!err) {
            console.log('订阅成功', 'totopic')
        }
    })
})

client.on('message', function (topic, message) {
    // message is Buffer
    if (topic == 'fromtopic') {
        let a = {
            topic,
            metadata: {},
            message: JSON.parse(message)
        }

        a2b(client, a, message_expression, topic_expression, metadata_expression)
        // let b = a2b(a, message_expression, topic_expression, metadata_expression)
        // client.publish(b.topic, JSON.stringify(b.message))
    }
    console.log(topic)
    console.log(message.toString())
    client.end()
})