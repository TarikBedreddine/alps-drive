//server

const root = require('./drive');
const app = require('./server');

root.createRootFolder();


app.listen(process.env.PORT || 3000, (error) => {
    console.log(error)
});



