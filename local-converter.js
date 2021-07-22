/* 
在本地协进行议转换
数据流向：
    expression —— MQTT pub
*/

/* 
let a = {
    topic: 'fromtopic',
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
    payload: {}
} 
*/

var mqtt = require('mqtt')
var jsonata = require("jsonata");

// 转换函数+发布，需传client参数
function a2b2pub(client, a, message_expression, topic_expression) {
    let b = {}
    // 格式转换表达式
    b.message = jsonata(message_expression).evaluate(a);
    b.topic = jsonata(topic_expression).evaluate(a);
    console.log(b)
    client.publish(b.topic, JSON.stringify(b.message))
}

// 转换函数
function a2b(a, message_expression, topic_expression) {
    let b = {}
    // 格式转换表达式
    b.message = jsonata(message_expression).evaluate(a);
    b.topic = jsonata(topic_expression).evaluate(a);
    console.log('转换产出：',b)
    return b
}

// 转换规则
const message_expression = `{'topic':topic,'sum':$sum(message.example.value)}`;
const topic_expression = `'totopic'`;
let a = {
    topic: 'fromtopic',
    message: {
        example: [
            { value: 4 },
            { value: 7 },
            { value: 13 }
        ]
    }
}

console.log('原始消息：',a)

var client = mqtt.connect('mqtt://test.mosquitto.org')
client.on('connect', function () {
    client.subscribe('totopic', function (err) {
        if (!err) {
            console.log('订阅成功', 'totopic')
            // 转换并发布
            a2b2pub(client, a, message_expression, topic_expression)

        }
    })
})

client.on('message', function (topic, message) {
    console.log('订阅接收到消息：')
    console.log(topic)
    console.log(message.toString())
    client.end()
})

let res = a2b(a, message_expression, topic_expression)
console.log(res)




