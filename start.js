var http=require('http');
var UUID = require('uuid');
const delay = require('delay');

var arguments = process.argv.splice(2);

var host = arguments[0]
var loopTime = parseInt(arguments[1])
var i = 0

function register(){
    let uuid = UUID.v1()
    var req = http.request({
            host,
            port: 5001,
            path: '/player/auth/tourist/signin',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        },(res)=>{
        res.setEncoding('utf-8');

        res.on('data', function(data) {
            start(JSON.parse(data).player.id,JSON.parse(data).token,uuid)
            console.log(i++)
        });
        res.on('end', function(res) {
        });
        req.on('error', function(e) {
            console.log('-------error-------',e);
        });
    });
    req.write(JSON.stringify({email:uuid}));
    req.end();
}
async function start(id,token,uuid){
    let playerIds = [id-1,id-2]
    operation(token,'/player/auth/tourist/signin',"POST",{email:uuid})
    await delay(100);operation(token,'/player/agents/support',"GET")
    operation(token,"/player/agents/merchant",'GET')
    await delay(100);operation(token,"/player/nickname",'PUT',{nickname:'testest'})
    operation(token,"/player/mails/money",'PUT',{mailId:id})
    operation(token,"/player/read",'PUT',undefined,id)
    operation(token,"/player/gold-package",'GET')
    await delay(100);operation(token,"/player/get_tour_award",'POST')
    operation(token,"/player/briefs",'POST',{playerIds})
    operation(token,"/player/brief",'GET',undefined,id-1)
    operation(token,"/player/game/rank",'GET')
    operation(token,"/player/checkin",'GET')
    await delay(100);operation(token,"/player/checkin",'PUT')
    operation(token,"/player/language",'PUT',{language:2})
    operation(token,"/player/icon",'PUT',{icon:1,iconFrame:1})
    operation(token,"/player/unknow_mails",'GET');
    await delay(100);operation(token,"/player/test_recharge",'PUT',undefined,id);
    await delay(100);operation(token,"/player/transfer",'PUT',{targetUserId:id-1,amount:1000})
    operation(token,"/player/currency",'GET')
    operation(token,"/player/transfers/in",'GET')
    operation(token,"/player/transfers/out",'GET')
    operation(token,"/player/app/configs",'GET')
}
function operation(token,path,method,data,putParameter){
    if(putParameter){
        path = path+'/'+putParameter
    }
    var req = http.request({
            host,
            port: 5001,
            path,
            method,
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer "+token
            }
        },(res)=>{
        res.setEncoding('utf-8');

        res.on('data', function(data) {
            let res = JSON.parse(data)
            // if(res.message){
            //     console.log(method+"__"+path)
            //     console.log('\t',res.message)
            // }
        });
        res.on('end', function(res) {
        });
        req.on('error', function(e) {
            console.log('-------error-------',e);
        });
    });
    if(data)req.write(JSON.stringify(data));
    else req.write(JSON.stringify({}))
    req.end();
}
// register()
for (let i = 0; i < loopTime; i++) {
    setInterval(()=>{
        register()
   },500)
}