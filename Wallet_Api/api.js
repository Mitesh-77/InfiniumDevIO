let express = require('express');
let app = express();
const port = process.env.PORT || 4000

app.use(express.json());

app.listen(port, () => {
    console.log('server is running....');
})



app.use('/',require('./routes/users'))
app.use('/',require('./routes/wallet'))
app.use('/',require('./routes/bank'))