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
      $sql = $conn->prepare("INSERT INTO CONTACTS (User_ID, First_Name, Last_Name, Phone, Email) VALUES (?,?,?,?,?)");
      $sql->bind_param("issss", $inData["User_ID"], $inData["First_Name"], $inData["Last_Name"], $inData["Phone"], $inData["Email"]);

      if(!$sql->execute())
      {
         switch ($conn->errno)
         {
            case 1062:
               sendErrorMessage("DUP_CONTACT");
               break;
            case 1048:
               sendErrorMessage("REQUIRED");
               break;
            case 1232:
               sendErrorMessage("TYPE_MISMATCH");
               break;
            case 1452:
               sendErrorMessage("BAD_ID");
               break;
            default:
               sendErrorMessage("UNKOWN_ERROR");
         }
      }
      $sql = $conn->prepare("SELECT Contact_ID FROM CONTACTS WHERE (User_ID=? AND First_Name=? AND Last_Name=? AND Phone=? AND Email=?)");
      $sql->bind_param("issss", $inData["User_ID"], $inData["First_Name"], $inData["Last_Name"], $inData["Phone"], $inData["Email"]);
      $sql->execute();

      $row = $sql->get_result()->fetch_assoc();
      $Contact_ID = $row["Contact_ID"];
      $res = array("Contact_ID" => $Contact_ID, "error" => "");
      sendResultInfoAsJson(json_encode($res));

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
