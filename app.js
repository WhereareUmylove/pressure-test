var request = require('request');
var UUID = require('uuid');
const delay = require('delay');

var basrURL = 'http://localhost:5001'
// var basrURL = 'http://dev.env.matases.com:5001'

function register(){
    let uuid = UUID.v1()
    request({
        url: basrURL+'/player/auth/tourist/signin',
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({email:uuid})
    }, (error, response, body)=>{
        if(error){
            console.log(error)
        }
        if(body){
            console.log(JSON.parse(body).token,JSON.parse(body).player.id)
            start(JSON.parse(body).token,JSON.parse(body).player.id,uuid)
        }
    });
}
async function start(token,id,uuid){
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
async function operation(token,path,type,data,putParameter){
    var url = ""
    if(putParameter){
        url = basrURL+path+'/'+putParameter
    }else{
        url = basrURL+path
    }
    // if(data&&type==="POST"){
    //     request.post({url, form:data,json:true,headers:{"Authorization":"Bearer "+token}},
    //     (error, response, body)=>{
    //         if(response){
    //             console.log(response.statusCode+"："+type+"__"+url)
    //         }
    //     })
    // }else if(data&&type==="PUT"){
    //     request.put({url, form:data,json:true,headers:{"Authorization":"Bearer "+token}},
    //     (error, response, body)=>{
    //         if(response){
    //             console.log(response.statusCode+"："+type+"__"+url)
    //         }
    //     })
    // }else{
        request({
            url,
            method: type,
            json:true,
            headers: {
                'Content-Type':'application/x-www-form-urlencoded',
                "Authorization": "Bearer "+token
            },
            form:data
        }, (error, response, body)=>{
            if(error){
                console.log(error)
            }
            if(response){
                console.log(response.statusCode+"："+type+"__"+url)
            }
        });
    // }
}

// register()
setInterval(()=>{
     register()
},1000)
