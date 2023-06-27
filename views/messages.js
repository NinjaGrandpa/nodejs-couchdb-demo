/* 
    CouchDb view for messages
    Is called each time there is an updated or a new message document
    Recieves the document as the argument and uses the 'emit' function to write changes in to the view
    First argument in 'emit' function is the index key and the second is the value
    The 'to' attribute is the key and the doc is a document only containing one '_id' field.
*/

exports.by_to = {
    map: function (doc) {
        if (doc.to) {
            emit(doc.to, { _id: doc._id });
        }
    }
};

// Messages order by created date
exports.by_to_createdAt = {
    map: function (doc) {
        if (doc.to && doc.createdAt) {
            emit([doc.to, doc.createdAt], { _id: doc._id });
        }
    }
};

// Counts the messages stored in a view
exports.to_count = {
    map: function (doc) {
        if (doc.to) {
            emit(doc.to, 1);
        }
    },
    reduce: function (keys, value) {
        return sum(values);
    }
}