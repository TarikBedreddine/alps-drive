// REQUIRE ALL NECESSARY FILES & MODULES
const root = require('./drive');
const app = require('./server');

// CREATE AN API/DRIVE FOLDER IN THE ROOT TEMP WINDOWS FOLDER
root.createRootFolder();

// INDICATE TO EXPRESS TO LISTEN ON THE 3000 PORT
app.listen(process.env.PORT || 3000, (error) => {
    console.log(error)
});



