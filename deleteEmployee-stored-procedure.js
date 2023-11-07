function deleteEmployee(department, id) {
    var context = getContext();
    var container = context.getCollection();
    var response = context.getResponse();

    if (!id || !department) {
        throw new Error("Please provide both the employee's ID and Department (Partition Key) you wish to delete.");
    }

    var filterQuery = {
        'query': 'SELECT * FROM Employees e WHERE e.id = @id AND e.Department = @department',
        'parameters': [
            { 'name': '@id', 'value': id },
            { 'name': '@department', 'value': department }
        ]
    };

    container.queryDocuments(container.getSelfLink(), filterQuery, {}, function(err, items) {
        if (err) {
            throw new Error("Error querying the document: " + err.message);
        } else if (items.length === 0) {
            response.setBody('No employee found with the given ID and Department.');
        } else {
            var employeeDocument = items[0];
            container.deleteDocument(employeeDocument._self, { 'partitionKey': department }, function(err, result) {
                if (err) {
                    throw new Error("Error deleting the document: " + err.message);
                } else {
                    response.setBody('Successfully deleted the employee with ID: ' + id + ' from Department: ' + department);
                }
            });
        }
    });
}
