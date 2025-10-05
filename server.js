const express = require("express");
const fs = require("fs");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());

// JSON dosyasını oku
const rawData = fs.readFileSync("./products.json");
const products = JSON.parse(rawData);

// Root endpoint
app.get("/", (req, res) => {
  res.send("API çalışıyor! Ürünler için /products endpointini kullanın.");
});

// Products endpoint
app.get("/products", async (req, res) => {
  let goldPrice = null;

  try {
    // GoldAPI'den altın fiyatını çek (USD/ons)
    const response = await axios.get("https://www.goldapi.io/api/XAU/USD", {
      headers: {
        "x-access-token": "goldapi-5m24msmgdtu9xx-io", // Kendi API key
        "Content-Type": "application/json"
      }
    });

    // Ons → gram çevrimi
    goldPrice = response.data.price / 31.1035;
  } catch (error) {
    console.error("Altın fiyatı alınamadı:", error.response?.data || error.message);
    // goldPrice null kalacak
  }

  const mapped = products.map((p) => {
    // Fiyat hesaplama (goldPrice null ise "Fiyat alınamadı")
    const price = goldPrice ? ((p.popularityScore + 1) * p.weight * goldPrice).toFixed(2) : "Fiyat alınamadı";

    // Popülerliği 0–5 skala ile dönüştür
    const popularity = +(p.popularityScore * 5).toFixed(1);

    return {
      ...p,
      price,
      displayPopularity: popularity,
    };
  });

  res.json(mapped);
});

// Sunucuyu başlat
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Backend API çalışıyor: http://localhost:${PORT}`);
});
