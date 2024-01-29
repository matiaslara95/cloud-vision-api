const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config();
const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@images-procesor.xvipxuu.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

exports.CreateUser = async (newUser) => {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const result = await client.db("dbCloudVision").collection('users').insertOne(newUser);
        console.log(`New listing created with the following id: ${result.insertedId}`);
        return result;

    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

exports.CreateUserGoogle = async (newUserGoogle) => {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const result = await client.db("dbCloudVision").collection('usersGoogle').insertOne(newUserGoogle);
        console.log(`New listing created with the following id: ${result.insertedId}`);
        return result;

    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

exports.GetUserByID = async (idUser) => {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const result = await client.db("dbCloudVision").collection('users').findOne({ _id: idUser });

        if (result) {
            console.log(`Found a user in the collection with the id '${idUser}':`);
            console.log(result);
        } else {
            console.log(`No listings found with the id '${idUser}'`);
        }
        return JSON.stringify(result);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

exports.GetUserGoogleByID = async (idUserGoogle) => {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const result = await client.db("dbCloudVision").collection('usersGoogle').findOne({ _id: idUserGoogle });

        if (result) {
            console.log(`Found a user in the collection with the id '${idUserGoogle}':`);
            console.log(result);
        } else {
            console.log(`No listings found with the id '${idUserGoogle}'`);
        }
        return JSON.stringify(result);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

exports.GetUserGoogleByGoogleID = async (googleID) => {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const result = await client.db("dbCloudVision").collection("usersGoogle").findOne({ googleId: googleID });

        if (result) {
            console.log(`Found a listing in the collection with the id '${googleID}':`);
            console.log(result);
        } else {
            console.log(`No listings found with the id '${googleID}'`);
        }
        return JSON.stringify(result);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

exports.GetUsers = async () => {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const result = await client.db("dbCloudVision").collection('users').find();

        if (result) {
            console.log(`Found a listing in the collection`);
            console.log(result);
        } else {
            console.log(`No users found`);
        }
        return JSON.stringify(result);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

exports.GetUsersGoogle = async () => {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const result = await client.db("dbCloudVision").collection('usersGoogle').find();

        if (result) {
            console.log(`Found a listing in the collection`);
            console.log(result);
        } else {
            console.log(`No users found`);
        }
        return JSON.stringify(result);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

exports.UpdateUserByID = async (idUser, updatedCollection) => {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const result = await client.db("dbCloudVision").collection('users')
            .updateOne({ _id: idUser }, { $set: updatedCollection });

        console.log(`${result.matchedCount} user(s) matched the query criteria.`);
        console.log(`${result.modifiedCount} user(s) was/were updated.`);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

exports.UpdateUserGoogleByID = async (idUserGoogle, updatedCollection) => {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const result = await client.db("dbCloudVision").collection('usersGoogle')
            .updateOne({ _id: idUserGoogle }, { $set: updatedCollection });

        console.log(`${result.matchedCount} user(s) matched the query criteria.`);
        console.log(`${result.modifiedCount} user(s) was/were updated.`);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

exports.DeleteUserByID = async (idUser) => {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const result = await client.db("dbCloudVision").collection('users')
            .deleteOne({ _id: idUser });
        console.log(`${result.deletedCount} users(s) was/were deleted.`);

        return JSON.stringify(result);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

exports.DeleteUserGoogleByID = async (idUserGoogle) => {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const result = await client.db("dbCloudVision").collection('usersGoogle')
            .deleteOne({ _id: idUserGoogle });
        console.log(`${result.deletedCount} users(s) was/were deleted.`);

        return JSON.stringify(result);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}