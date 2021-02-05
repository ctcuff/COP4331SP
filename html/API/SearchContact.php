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
      // everything will partially match with a blank field, so get rid of blank fields
      $inData = array_filter($inData);

      // check is the User_ID represents a valid user
      $sql = $conn->prepare("SELECT * FROM USERS WHERE ID=?");
      $sql->bind_param("i", $inData["User_ID"]);
      $sql->execute();
      $rows = $sql->get_result();
      if($rows->num_rows < 1) sendErrorMessage("BAD_ID");

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
         ");
      $sql->bind_param("issss", $inData["User_ID"], $inData["Query"], $inData["Query"], $inData["Query"], $inData["Query"]);
      $success = $sql->execute();
      // get result from query and get all result rows
      $rows = $sql->get_result()->fetch_all(MYSQLI_ASSOC);
      $res = array(
         "contacts" => $rows,
         "error" => ""
      );

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
		sendResultInfoAsJson(json_encode(array("contacts" => array(), "error" => $err)));
	}

   function sendNoError()
   {
      sendErrorMessage("");
   }

?>
