<?php

	$inData = getRequestInfo(); //grabs json

	 $servername = "localhost"; //variables for us to log in to the server?
	 $username = "ArminSQLUser";
	 $password = "pass";

	 $conn = new mysqli($servername, $username, $password); //making the connection to the mysqlnd_ms_dump_servers

	 if($conn->connect_error)
	 {//if connection fails
		 sendErrorMessage("CONNECTION_ERROR");
	 }
	 else
	 {
	 	$conn->select_db("COP4331");//connects to specific Database

		$sql = $conn->prepare("DELETE FROM CONTACTS WHERE Contact_ID=?");
		$sql->bind_param("i", $inData["Contact_ID"]);
		$sql->execute();

		sendNoError();

		$conn->close();
	 }

	 function getRequestInfo()
	 {
		 return json_decode(file_get_contents('php://input'), true);
	 }

	 function sendResultInfoAsJson( $obj )
	 {
		 header('Content-type: application/json');
		 echo $obj;
				// once we return something, end the script
		 exit;
	 }

	 function sendErrorMessage( $err )
 	{
 		sendResultInfoAsJson(json_encode(array("error" => $err)));
 	}

    function sendNoError()
    {
       sendErrorMessage("");
    }

	 ?>
