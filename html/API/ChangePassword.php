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
      $sql = $conn->prepare("SELECT ID FROM USERS where First_Name=? AND Last_Name=? AND Username=?");
      $sql->bind_param("sss", $inData["First_Name"], $inData["Last_Name"], $inData["Username"]);

      if(!$sql->execute())
      {
         switch ($conn->errno)
         {
            case 1048:
               sendErrorMessage("REQUIRED");
            default:
               sendErrorMessage("UNKOWN_ERROR");
         }
      }

      $result = $sql->get_result();

		if ($result->num_rows > 0)
		{
			$row = $result->fetch_assoc();

         $sql = $conn->prepare("UPDATE USERS SET Password = ? WHERE ID = ?");
         $sql->bind_param("si", $inData["Password"], $row["ID"]);
         $sql->execute();

         sendNoError();
		}
		else
		{
			sendErrorMessage("NO_USER");
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
