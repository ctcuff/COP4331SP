<?php

	$inData = getRequestInfo();


   $servername = "localhost";
   $username = "ArminSQLUser";
   $password = "pass";

   $conn = new mysqli($servername, $username, $password);


	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
      $conn->select_db("COP4331");
      $sql = $conn->prepare("INSERT INTO CONTACTS (User_ID, First_Name, Last_Name, Phone, Email) VALUES (?,?,?,?,?)");
      $sql->bind_param("issss", $inData["User_ID"], $inData["First_Name"], $inData["Last_Name"], $inData["Phone"], $inData["Email"]);
      $success = $sql->execute();

      sendResultInfoAsJson(json_encode(array("Success" => ($success===false ? mysql_errno($conn) : "true"))));

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
	}

	function returnWithError( $err )
	{
		$retValue = '{"ID":0,"First_Name":"","Last_Name":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $First_Name, $Last_Name, $ID )
	{
		$retValue = '{"ID":' . $ID . ',"First_Name":"' . $First_Name . '","Last_Name":"' . $Last_Name . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>
