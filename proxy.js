// server.js
import express from 'express';
import http from 'http';
import cors from 'cors';
import got from 'got';
import { Server } from 'socket.io';
import BinanceKlineWS from './binancews.js';

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Simple HTTP endpoint using got
app.get('/api/klines', async (req, res) => {
    const {symbol,interval }=req.query
    if(!symbol || !interval )
    {
        return res.status(400).json({error : 'Missing Symbol or Interval'});
    }
    try {
        const response = await got(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}`);
        res.send(response.body);
    } catch (error) {
        console.error('Error making request :')
        console.log(error)
        res.status(500).json({error : 'Error fetching data'});
    }
});

app.get('/api/symbols', async (req, res) => {
    try {
        const response = await got('https://api.binance.com/api/v3/exchangeInfo');
        const data = JSON.parse(response.body);
        const symbols = data.symbols.map(symbol => symbol.symbol);
        res.json(symbols);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error fetching symbol list from Binance API' , errordata: error });
    }
});
// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Socket io proxy
const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });
  
  // // Initialize BinanceKlineWS
  // const binanceKlineWS = new BinanceKlineWS();
  
  // // Set up the kline event handler to emit kline data to all connected users
  // binanceKlineWS.onKline = (klineData) => {
  //   // Emit kline data to all connected clients on 'KLINE' topic
  //    console.log("Kline data emitted:", klineData);
  //   io.emit("KLINE", klineData);
  // };
  
  // // Start the WebSocket connection to Binance
  // binanceKlineWS.connect();

  // Handle socket.io connections

  io.on("connection", (socket) => {
    console.log("A user connected");
  
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

