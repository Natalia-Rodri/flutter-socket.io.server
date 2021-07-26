const { io } = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();

bands.addBand( new Band( "NiziU") );
bands.addBand( new Band( "Twice") );
bands.addBand( new Band( "Aespa") );
bands.addBand( new Band( "Black Pink") );

io.on('connection', client => {
    console.log("Cliente conectado");

    client.emit("active-bands", bands.getBands());

    client.on('disconnect', () => { 
        console.log("Cliente desconectado");
     });

    client.on("mensaje", ( payload ) => {
        console.log("mensajee!!!!!", payload);
        io.emit("mensaje", {admin: "Nuevo mensaje"});
        
    });

    
    client.on("vote-band", (payload) => {
        bands.voteBand(payload.id);
        io.emit("active-bands", bands.getBands());
    });

    client.on("add-band", (payload) => {
        nuevaBanda = new Band(payload.name);
        console.log(nuevaBanda);
        bands.addBand(nuevaBanda);
        io.emit("active-bands", bands.getBands());
    });

    client.on("remove-band", (payload) => {
        bands.deleteBand(payload.id);
        io.emit("active-bands", bands.getBands());
    });


    client.on("emitir-mensaje", ( payload ) => {
        //io.emit("nuevo-mensaje", payload); //Emite a todos
        client.broadcast.emit("nuevo-mensaje", payload); //Emite a todos menos al que lo emitió
    })
});
  
