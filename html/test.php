<?php


  $servername = "localhost";
  $username = "ArminSQLUser";
  $password = "pass";

  $conn = new mysqli($servername, $username, $password);

  if ($conn->connect_error)
  {
    die("Connection failed: " . $conn->connect_error);
  }

  echo "Connected successfully!<br>";

  $conn->select_db("COP4331");


  $res = $conn->query("SELECT * FROM CONTACTS");

  // while there are still rows to get from the query result
  while ($row = $res->fetch_assoc())
  {
    // get the data in the "Username" column for this row
    printf("%s", $row["Email"]);
    echo "<br>";
  }


  printf("Number of rows selected: %d\r\n", $res->num_rows);
  echo "<br>";

  //button pressed
  if ($_SERVER["REQUEST_METHOD"] == "POST")
  {
     echo "The time right now is " . date("m-d-Y H:i:s") . "<br>";
  }


  $res->close();

  $conn->close();

?>

<html>
<body>

<form method="post" action="">
   <input type="submit">
   </form>
</body>
</html>
