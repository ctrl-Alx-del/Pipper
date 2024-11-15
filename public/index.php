<?php
require "../.env";

header("Access-Control-Allow-Origin: *");

header("Content-Type: application/json; charset=UTF-8");

header("Access-Control-Allow-Methods: OPTIONS,GET,POST,PUT,DELETE");

header("Access-Control-Max-Age: 3600");

header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$servername = "localhost:3306";

$username = "root";

$password = getenv("PASSWORD");

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', $uri);

$requestMethod = $_SERVER["REQUEST_METHOD"];

if ($requestMethod == "GET" && $uri[1] == "posts") {
    try{
    $connect = new PDO("mysql:host=$servername;dbname=nasty", $username, $password);
    $connect->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
   

    //$statement = $connect->query('SELECT * FROM nasty.pips');
    $statement = $connect->query('SELECT * FROM pips ORDER BY idpips DESC');
    $result = $statement->fetchAll(PDO::FETCH_ASSOC);

    //slet muligvis
    // Query to fetch primary key values
    $primaryKeyStatement = $connect->query('SELECT idpips FROM pips');
    $primaryKeys = $primaryKeyStatement->fetchAll(PDO::FETCH_COLUMN);

    // Combine the primary keys with the posts
    $response = [
        "posts" => $result,
        "primaryKeys" => $primaryKeys
    ];
    //hertil og ret $response til $result

    echo json_encode($response);

    }catch(PDOException $e){
    echo "Connection failed: " . $e->getMessage();
    }
} else if ($requestMethod == "POST" && $uri[1] == "posts") {
    // Get the input data from the request body
    $input = (array) json_decode(file_get_contents('php://input'), true);

    // Validate required fields (e.g., Message, username and image)
    if (!isset($input['message']) && !isset($input['username']) && !isset($input['image'])) {
        echo json_encode(["error" => "Invalid input. Message, username and image are required."]);
        return;
    }

    // Assign values to variables
    $message = $input['message'];
    $brugernavn = $input['username'];
    $image = $input['image'];
    

    try {
        // Connect to the database using PDO
        $connect = new PDO("mysql:host=$servername;dbname=nasty", $username, $password);
        $connect->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Prepare the SQL query using placeholders to avoid SQL injection
        $sql = "INSERT INTO pips (username, message, image) VALUES (:brugernavn, :message, :image)";

        // Prepare the statement
        $statement = $connect->prepare($sql);

        // Bind the parameters
        $statement->bindParam(':brugernavn', $brugernavn);
        $statement->bindParam(':message', $message);
        $statement->bindParam(':image', $image);

        // Execute the statement
        if ($statement->execute()) {
            // Return a success message
            echo json_encode(["message" => "Student data inserted successfully"]);
        } else {
            echo json_encode(["error" => "Failed to insert data"]);
        }
        
    } catch (PDOException $e) {
        // Handle any errors during the database connection or query
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
}
else if ($requestMethod == "POST" && $uri[1] == "posts") {
    $input = (array) json_decode(file_get_contents('php://input'), true);


} else {
    echo json_encode(["error" => "Missing text"]);
}
?> 


