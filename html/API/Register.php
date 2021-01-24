<?php

	$inData = getRequestInfo();

   $servername = "localhost";
   $username = "ArminSQLUser";
   $password = "pass";

   $conn = new mysqli($servername, $username, $password);

	if ($conn->connect_error)
	{
		sendErrorMessage("CONNECTION_ERROR");
	}
	else
	{
      $conn->select_db("COP4331");

      $sql = $conn->prepare("INSERT INTO USERS (First_Name, Last_Name, Username, Password) VALUES (?,?,?,?)");
      $sql->bind_param("ssss", $inData["First_Name"], $inData["Last_Name"], $inData["Username"], $inData["Password"]);

      if(!$sql->execute())
      {
         switch ($conn->errno)
         {
            case 1062:
               sendErrorMessage("DUP_USER");
            case 1048:
               sendErrorMessage("REQUIRED");
            default:
               sendErrorMessage("UNKOWN_ERROR");
         }
      }
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
