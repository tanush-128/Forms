const apiKey = "7b16d7618e651eb9a56f9e8df397a953-us13"
const listId = "d95cb6c291"
const express = require('express')
const bodyParser = require('body-parser')
const https = require('https')
const md5 = require('md5')

const app = express()
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))

app.get('/',(req,res)=>{
res.sendFile(__dirname + "/index.html")
})

app.post('/',function(req){
    const email = req.body.email
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    console.log(email+','+firstName +' '+lastName)
    const data = {
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME:firstName,
                    LNAME:lastName
                }

            }
        ]
    }
    const jsonData = JSON.stringify(data);
    const url = `https://us13.api.mailchimp.com/3.0/lists/${listId}`
    const options = {
        method :"POST",
        auth : `tanush:${apiKey}` 
    }

    const request =https.request(url,options, function(response){
        response.on("data",function(data){
            // console.log(JSON.parse(data))
        })
       console.log(response.statusCode)

    })
    const subscriber_hash = md5(email) 
    https.get(`https://us13.api.mailchimp.com/3.0/lists/${listId}/${subscriber_hash}`,function(response){
        // console.log(response.statusCode)
    })

    request.write(jsonData)
    request.end()
    console.log(request.statusCode)
    


})

app.listen(3000,()=>{
    console.log("server running at port:3000")
})
