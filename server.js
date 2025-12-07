const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const BOOKINGS_FILE = "./bookings.json";

// Läs bokningar
function readBookings() {
    if (!fs.existsSync(BOOKINGS_FILE)) return [];
    return JSON.parse(fs.readFileSync(BOOKINGS_FILE));
}

// Spara bokningar
function saveBookings(list) {
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(list, null, 2));
}

// POST – skapa bokning
app.post("/book", (req, res) => {
    const { date, time, email, phone } = req.body;

    if (!date || !time || !email || !phone) {
        return res.json({ success: false, error: "Saknar fält" });
    }

    let bookings = readBookings();
    bookings.push({ date, time, email, phone });
    saveBookings(bookings);

    res.json({ success: true });
});

// GET – visa bokningar till admin
app.get("/admin/bookings", (req, res) => {
    res.json(readBookings());
});

// DELETE – radera bokning
app.delete("/admin/delete/:id", (req, res) => {
    const id = Number(req.params.id);
    let bookings = readBookings();

    if (id < 0 || id >= bookings.length) {
        return res.json({ success: false, error: "Fel ID" });
    }

    bookings.splice(id, 1);
    saveBookings(bookings);

    res.json({ success: true });
});

// Start server
app.listen(3000, () => {
    console.log("Servern körs på http://localhost:3000");
});
