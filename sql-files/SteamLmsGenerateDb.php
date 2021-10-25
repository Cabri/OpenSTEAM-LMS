<?php
require("./vendor/autoload.php");
use Dotenv\Dotenv;

// Load .env file data
$dotenv = Dotenv::createImmutable(__DIR__."/../");
$dotenv->safeLoad();

class SteamLmsGenerateDb{
    protected $dbHost;
    protected $dbName;
    protected $dbUser;
    protected $dbPassword;
    protected $adminPseudo;
    protected $adminPassword;
    protected $adminEmail;
    protected $queryFile = '';
    protected $dsn = '';
    protected $db = null;

    public function __construct($ENV)
    {
        $this->dbHost = $ENV['VS_DB_HOST'];
        $this->dbName = $ENV['VS_DB_NAME'];
        $this->dbUser = $ENV['VS_DB_USER'];
        $this->dbPassword = $ENV['VS_DB_PWD'];
        $this->adminPseudo = $ENV['ADMIN_PSEUDO'];
        $this->adminPassword = $ENV['ADMIN_PASSWORD'];
        $this->adminEmail = $ENV['ADMIN_EMAIL'];
        
    }
    
    /**
     * createDatabase
     *
     * @return object $this
     */
    public function createDatabase(){
        // get the connection without the db name to create the database and create the database
        $this->db = $this->getConnection();
        $this->db->query("
            CREATE DATABASE IF NOT EXISTS {$this->dbName}
            CHARACTER SET = 'utf8'
            COLLATE = 'utf8_unicode_ci'
        "); 
        
        return $this;
    }
    
    /**
     * createTables
     *
     * @return object $this
     */
    public function createTables(){
        // reset the db connection as the db name was missing to create the db 
        // and create a new one to create the tables
        $this->db = null;
        $this->db = $this->getConnection(true);

        // get the content of sql file and insert the tables in db
        $this->queryFile = file_get_contents("sql-files/steam-lms-generate-db.sql");
        $req = $this->db->prepare($this->queryFile);
        $req->execute();
        
        return $this;
    }
    
    /**
     * createAdminUser
     *
     * @return object $this
     */
    public function createAdminUser(){
        // hash the password using bcrypt with default cost:10 rounds
        $passwordHash = password_hash($this->adminPassword,PASSWORD_BCRYPT);

        // insert the new user in db
        $req = $this->db->prepare("
            INSERT INTO users(firstname, pseudo, surname, password) VALUES (?,?,?,?)
        ");

        // execute the insert and retrieve the last insert id for the next request
        $req->execute(array($this->adminPseudo, $this->adminPseudo, $this->adminPseudo,$passwordHash));
        $lastInsertedId = $this->db->lastInsertId();

        // add the user as Admin in db
        $req = $this->db->prepare("
            INSERT INTO user_regulars(id, email, mail_messages, is_active, is_admin, private_flag) 
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        $req->execute(array($lastInsertedId,$this->adminEmail,0,1,1,0));
        
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

    }
}

$steamLmsGenerateDb = new SteamLmsGenerateDb($_ENV);
$steamLmsGenerateDb->createDatabase()
                    ->createTables()
                    ->createAdminUser();

 
echo "done"; 