//jshint esversion:8
const express = require("express");
const app = express();
const {Client,LocalAuth,LegacySessionAuth,MessageMedia,ChatTypes,Buttons,List}=require('whatsapp-web.js');
// const { Client, LocalAuth } = require("whatsapp-web.js");
const pmpermit = require("./helpers/pmpermit");
const config = require("./config");
const fs = require("fs");
const logger = require("./logger");
const { afkStatus } = require("./helpers/afkWrapper");

const client = new Client({
  puppeteer: { headless: true, args: ["--no-sandbox"] },
  authStrategy: new LocalAuth({ clientId: "whatsbot" }),
});

client.commands = new Map();

fs.readdir("./commands", (err, files) => {
  if (err) return console.error(e);
  files.forEach((commandFile) => {
    if (commandFile.endsWith(".js")) {
      let commandName = commandFile.replace(".js", "");
      const command = require(`./commands/${commandName}`);
      client.commands.set(commandName, command);
    }
  });
});

client.initialize();

client.on("auth_failure", () => {
  console.error(
    "There is a problem in authentication, Kindly set the env var again and restart the app"
  );
});

client.on("ready", () => {
  console.log("Bot has been started");
});

client.on('message', async message => {
	// if(message.body === '!ping') {
		// message.reply('pong');
	// }
    
        // client.sendMessage("919538474018@c.us",productsList)
   message.getContact().then((result) => {
       
       if(result.number=="919341269808" || result.number=="919538474018"){
    //    if(true){
        if(message.hasMedia) {
           message.downloadMedia().then((res)=>{

                // console.log(res);
                const media = new MessageMedia(res.mimetype, res.data,res.filename);
                console.log(message);
    
                var axios = require("axios").default;

                var options = {
                  method: 'POST',
                  url: 'https://personal-portfolio-webdears.000webhostapp.com/whats.php'
                };
                
                axios.request(options).then(function (response) {
                    for (let i of response.data){
                        client.sendMessage(`91${i.contact}@c.us`,media,{caption:message.body}).then((rep)=>{
                            console.log(2)
                        })
                    }

                  console.log(response.data);
                }).catch(function (error) {
                  console.error(error);
                });
  

            });
            // do something with the media data here
        }
        else{

            // var but= new Buttons("coool",[{id:"",body:"hi"},{id:"",body:"hi"}], "jj", "hhho")

            // client.sendButtons("919538474018@c.us",but).then((i)={})
                 
            // for(let i=0;i<50;i++){
                // client.sendButtons("919538474018@c.us",'Body text/ MessageMedia instance', [{id:'customId',body:'button1'}], 'Title here, doesn\'t work with media', 'Footer here'), {caption: 'if you used a MessageMedia instance, use the caption here'}
                // client.sendMessage("919538474018@c.us", bbut)
                client.sendMessage("919538474018@c.us","hi");
            // }
        }
    }
    
    else{
        client.sendMessage(message.from,`hi ${message.notifyName}` );
    }
   }).catch((err) => {
    
   });
    
});

// client.on("message_create", async (msg) => {
//   // auto pmpermit
//   try {
//     if (config.pmpermit_enabled == "true") {
//       var otherChat = await (await msg.getChat()).getContact();
//       if (
//         msg.fromMe &&
//         msg.type !== "notification_template" &&
//         otherChat.isUser &&
//         !(await pmpermit.isPermitted(otherChat.number)) &&
//         !otherChat.isMe &&
//         !msg.body.startsWith("!") &&
//         !msg.body.endsWith("_Powered by WhatsBot_")
//       ) {
//         await pmpermit.permit(otherChat.number);
//         await msg.reply(
//           `You are automatically permitted for message !\n\n_Powered by WhatsBot_`
//         );
//       }
//     }
//   } catch (ignore) {}

//   if (msg.fromMe && msg.body.startsWith("!")) {
//     let args = msg.body.slice(1).trim().split(/ +/g);
//     let command = args.shift().toLowerCase();

//     console.log({ command, args });

//     if (client.commands.has(command)) {
//       try {
//         await client.commands.get(command).execute(client, msg, args);
//       } catch (error) {
//         console.log(error);
//       }
//     } else {
//       await client.sendMessage(
//         msg.to,
//         "No such command found. Type !help to get the list of available commands"
//       );
//     }
//   }
// });

// client.on("message_revoke_everyone", async (after, before) => {
//   if (before) {
//     if (
//       before.fromMe !== true &&
//       before.hasMedia !== true &&
//       before.author == undefined &&
//       config.enable_delete_alert == "true"
//     ) {
//       client.sendMessage(
//         before.from,
//         "_You deleted this message_ 👇👇\n\n" + before.body
//       );
//     }
//   }
// });

client.on("disconnected", (reason) => {
  console.log("Client was logged out", reason);
});

app.get("/", (req, res) => {
  res.send(
    '<h1>This server is powered by Whatsbot<br><a href="https://github.com/tuhinpal/WhatsBot">https://github.com/tuhinpal/WhatsBot</a></h1>'
  );
});

app.use(
  "/public",
  express.static("public"),
  require("serve-index")("public", { icons: true })
); // public directory will be publicly available

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server listening at Port: ${process.env.PORT || 8080}`);
});
