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
      $sql = $conn->prepare("SELECT ID,First_Name,Last_Name,Password FROM USERS where Username=?");
      $sql->bind_param("s", $inData["Username"]);

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
         // check if the password was entered incorrectly
         if ($row["Password"] != $inData["Password"]) sendErrorMessage("WRONG_PASS");
         // get rid of the password so that we dont risk returning it
         unset($row["Password"]);

         $sql = $conn->prepare("UPDATE USERS SET Last_Login = now() WHERE ID = ?");
         $sql->bind_param("i", $row["ID"]);
         $sql->execute();

         $row["error"] = "";
         sendResultInfoAsJson(json_encode($row));
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
