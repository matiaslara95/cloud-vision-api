require("dotenv").config();
const { stringify } = require("querystring");
const dbConnection = require("../../../services/dbConnection");

exports.GetAllImages = async () => {
    return await dbConnection.FindListing("images");
}

exports.GetImagesByID = async ({ id = 0 }) => {
    return await dbConnection.FindOneListingID("images", id);
}

exports.UpdateImagesByID = async (collection) => {
    return await dbConnection.UpdateCollectionByID("images", collection.id, collection);
}

exports.DeleteImagesByID = async ({ id = 0 }) => {
    return await dbConnection.DeleteListingByID("images", id);
}


// exports.GetImagesByID = async ({ id = 0 }) => {
//     return await dbConnection.FindOneListingID("images", id);
// }