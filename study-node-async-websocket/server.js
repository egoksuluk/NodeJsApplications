let Websocket = require("ws");
const wsUrl = "wss://stream.binance.com:9443/ws/btcusdt@trade";
//WebSocket: Connection is always open!
// req -> res , publish -> subscribe, ..
// streaming (text,binary) --> Event-Driven (Domain Event)
let ws = new Websocket(wsUrl);
// Consumer REST over WebSocket (Binance)
// Web Socket client
ws.on('message',frame => {
    let trade = JSON.parse(frame);
    console.log(trade);
});

//HTTP : HD , req->res , Connection  Oriented,
//HTTP/2 (SSE:Server Sent Event)(Text:Push tek taraflı)
//HTTP/3 (WS )
//Connection is closed after response
//Consuming REST over HTTP (Binance)
//HTTP client
let fetch = require("node-fetch");
let url = "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT";
setInterval(()=>{
    fetch(url).then(res => res.json())
        .then(ticker => console.log(ticker));
},1000);


/* HTTP Response JSON : Request-Response yöntemi olduğu için tek seferde dönen data az, değişkenler isimle verilmiş
{ symbol: 'BTCUSDT', price: '33964.35000000' }
 */

/* Web Socket JSON response , çok fazla veri döndüğü için değişken isimleri sadece harf
{
    e: 'trade',
        E: 1624543019061,
    s: 'BTCUSDT',
    t: 929257896,
    p: '33964.34000000',
    q: '0.06639900',
    b: 6603697572,
    a: 6603697551,
    T: 1624543019061,
    m: false,
    M: true
}
*/