<?php
require("./vendor/autoload.php");
use Dotenv\Dotenv;

// Before: make sure that the user is not yet in the table users or user_regulars
// use with
// php sql-files/SteamLmsInsertUser.php pseudo=pseudo firstname=Anselme surname=Lanturlu password='SafePass!' email=me@example.com

// Load .env file data
$dotenv = Dotenv::createImmutable(__DIR__."/../");
$dotenv->safeLoad();

class SteamLmsGenerateDb{
    protected $dbHost;
    protected $dbName;
    protected $dbUser;
    protected $dbPassword;
    protected $dsn = '';
    protected $db = null;

    public function __construct($ENV)
    {
        $this->dbHost = $ENV['VS_DB_HOST'];
        $this->dbName = $ENV['VS_DB_NAME'];
        $this->dbUser = $ENV['VS_DB_USER'];
        $this->dbPassword = $ENV['VS_DB_PWD'];
    }



    /**
     * insert-user
     *
     * @return object $this
     */
    public function pushUser($_A){
        // hash the password using bcrypt with default cost:10 rounds
        $passwordHash = password_hash($_A["password"],PASSWORD_BCRYPT);

        // insert the new user in db
        $req = $this->db->prepare("
            INSERT INTO users(firstname, pseudo, surname, password) VALUES (?,?,?,?)
        ");

        // execute the insert and retrieve the last insert id for the next request
        $req->execute(array($_A["firstname"], $_A["pseudo"], $_A["surname"],$passwordHash));
        $lastInsertedId = $this->db->lastInsertId();

        // add the user as Admin in db
        $req = $this->db->prepare("
            INSERT INTO user_regulars(id, email, mail_messages, is_active, is_admin, private_flag) 
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        $req->execute(array($lastInsertedId,$_A["email"],0,1,1,0));

        return $this;
    }

    public function getConnection($db_created=false){
        // set the dsn according to the action to perform (create the db or insert tables and admin)
        $this->dsn = $db_created === false
            ? "mysql:host={$this->dbHost}"
            : "mysql:host={$this->dbHost};dbname={$this->dbName}" ;

        try{
            // create the connection, set the options and return it
            $this->db = new PDO($this->dsn,$this->dbUser,$this->dbPassword);
            $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $this->db;

        } catch(Exception $e){
            // display errors
            echo $e->getMessage();
        }
        return $this;
    }
}

$steamLmsGenerateDb = new SteamLmsGenerateDb($_ENV);
parse_str(implode('&', array_slice($argv, 1)), $_A);
$steamLmsGenerateDb->getConnection(true);
$steamLmsGenerateDb ->pushUser($_A);


echo "done";