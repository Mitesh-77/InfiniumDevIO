let express = require('express');
let cors = require('cors')
let app = express();
const port = process.env.PORT || 4000

app.use(express.json());
app.use(cors())

app.use('/', require('./routes/card'))

app.listen(port, () => {
    console.log('server is running....');
})
