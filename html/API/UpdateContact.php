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

      // Check to see if the contact ID is valid
      $sql = $conn->prepare("SELECT * FROM CONTACTS WHERE Contact_ID=?");
      $sql->bind_param("s",$inData["Contact_ID"]);
      $sql->execute();
      if(empty($sql->get_result()->fetch_all())) sendErrorMessage("BAD_CONTACT_ID");

      // Get rid of blank fields so that they dont get overridden in the table
      $inData = array_filter($inData);
      // Dont change the table until we can change all the fields we need to, successfully
      $conn->autocommit(false);
      foreach ($inData as $key => $value)
      {
         $queryString = "UPDATE CONTACTS SET {$key}=? WHERE Contact_ID = ?";
         $sql = $conn->prepare($queryString);
         $sql->bind_param("si", $value, $inData["Contact_ID"]);
         if (!$sql->execute())
         {
            // undo any changes to the contact since we had an error at some point while doing so
            $conn->rollback();
            switch ($conn->errno)
            {
               case 0:
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
      }
      $conn->commit();

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
