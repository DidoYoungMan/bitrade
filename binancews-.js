import WebSocket from "ws";

class BinanceKlineWS{

    constructor ()
    {
        this.ws=null;
    }

    connect ()
    {
        //Web socket connect for 1 Min

        this.ws =new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@kline_1m")
         
        this.ws.on("open",()=>{ console.log('Connected to Binance WebSocket for BTCUSDT 1min klines ')})
    
        this.ws.on("message",(data)=>{
            const parsedData=JSON.parse(data)
            if(parsedData.e==='kline')
            {
                const kline=parsedData.kline
                this.onKline(kline)
            }
        })

        this.ws.on("close",()=>
        {
            console.log('Binance WebSocket closed, reconnecting ...')
            setTimeout(()=>this.connect(),5000)
        })

        this.ws.on("error",(error)=>{
            console.error('WebSocket Error:',error)
            this.ws.close()
        })

       
    }
    
    onKline(kline)
    {

    }
}

export default BinanceKlineWS