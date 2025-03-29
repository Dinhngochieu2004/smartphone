const {createClient} = require("redis");
const client = createClient({
    url: "redis://default:BByCKk0ouS5qHhHEdJwtrRs6basyonoQ@redis-15019.c73.us-east-1-2.ec2.redns.redis-cloud.com:15019",
});
client.on("error", (error)=>console.log("redis client error", error));
const connectionRedis = ()=>{
    return client.connect()
       .then(()=>console.log("Redis Connected!")) 
       .catch((error)=> console.log(error)); 
};
module. exports ={
    connectionRedis,
    redisClient: client,   
}