const express = require('express');
const cors = require('cors');
const connectDB = require('./mongoose');
const Post = require('./models/posts');
const { loadBlockchainData, web3 } = require('./web3/helper')


const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

app.get('/getSigned_txns', async (req, res) => {
    try {
        const { user } = req.body;
        const result = await Post.find({ from: user });
        res.status(200).json(result);
    } catch (error) {
        console.log(error.messsage);
        return error;
    }
})

app.post('/submit_txns', async (req, res) => {
    try {
        const { raw, tx, from } = req.body;

        console.log(req.body);
        const _data = new Post({
            raw, tx, from
        });
        await _data.save();
        res.status(201).json(_data);
    } catch (error) {
        console.log(error);
        return error;
    }
})

app.listen(port, async () => {
    await connectDB();
    await loadBlockchainData();
    console.log(`Server listeninig at port: http://localhost:${port}`)
});