<?php

	$inData = getRequestInfo();


   $servername = "localhost";
   $username = "ArminSQLUser";
   $password = "pass";

   $conn = new mysqli($servername, $username, $password);


	if ($conn->connect_error)
	{
		sendErrorMessage( "CONNECTION_ERROR" );
	}
	else
	{
      $conn->select_db("COP4331");
      // everything will partially match with nothing, so get rid of blank fields
      $inData = array_filter($inData);
      //echo json_encode($inData);

      // get the contacts from this user, given the information. note that we use a partial
      // match here so that the user doesnt have to be exact.
      // We have to use the CONCAT function because % isnt properly escaped in the prepare function
      $sql = $conn->prepare("SELECT Contact_ID,First_Name,Last_Name,Phone,Email FROM CONTACTS WHERE
         User_ID=? AND (
         First_Name like CONCAT('%',?,'%') OR
         Last_Name like CONCAT('%',?,'%') OR
         Phone like CONCAT('%',?,'%') OR
         Email like CONCAT('%',?,'%')
         )
         "); //OR Last_Name LIKE %?% OR Phone LIKE %?% OR Email LIKE %?%
      $sql->bind_param("issss", $inData["User_ID"], $inData["First_Name"],$inData["Last_Name"],$inData["Phone"],$inData["Email"]);
      $success = $sql->execute();
      // get result from query and get all result rows
      $rows = $sql->get_result()->fetch_all(MYSQLI_ASSOC);
      // add error key to signal no error
      $rows["error"] = "";

      sendResultInfoAsJson(json_encode($rows));

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
