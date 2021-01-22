<?php

	$inData = getRequestInfo();

	$ID = 0;
	$First_Name = "";
	$Last_Name = "";

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
		$sql = "SELECT ID,First_Name,Last_Name FROM USERS where Username='" . $inData["Username"] . "' and Password='" . $inData["Password"] . "'";
		$result = $conn->query($sql);
		if ($result->num_rows > 0)
		{
			$row = $result->fetch_assoc();
			$First_Name = $row["First_Name"];
			$Last_Name = $row["Last_Name"];
			$ID = $row["ID"];

         $sql = $conn->prepare("UPDATE USERS SET Last_Login = now() WHERE ID = ?");
         $sql->bind_param("i", $ID);
         $sql->execute();

			returnWithInfo($First_Name, $Last_Name, $ID);
		}
		else
		{
			returnWithError( "No Records Found" );
		}
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
