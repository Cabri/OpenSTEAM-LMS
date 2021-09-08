<?php

use Doctrine\ORM\Tools\Setup;
use Doctrine\ORM\EntityManager;
use Doctrine\DBAL\DriverManager;
use Dotenv\Dotenv;

require_once "vendor/autoload.php";

// Create a simple "default" Doctrine ORM configuration for Annotations
$isDevMode = true;
$proxyDir = null;
$cache = null;
$useSimpleAnnotationReader = false;
// Array of all namespaces containing entities with annotations.
$config = Setup::createAnnotationMetadataConfiguration(
    array(
        __DIR__ . "/user/Entity",
        __DIR__ . "/classroom/Entity",
        __DIR__ . "/python/Entity",
        __DIR__ . "/interfaces/Entity",
        __DIR__ . "/vittamapE/Entity",
        __DIR__ . "/shop/Entity",
        __DIR__ . "/tables/Entity",
        __DIR__ . "/api/Entity",
        __DIR__ . "/learn/Entity"
    ),
    $isDevMode,
    $proxyDir,
    $cache,
    $useSimpleAnnotationReader
);

// Load env variables 
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();


// Database configuration parameters
$connectionParams = array(
    'dbname' =>  $_ENV['VS_DB_NAME'],
    'user' => $_ENV['VS_DB_USER'],
    'port' => $_ENV['VS_DB_PORT'],
    'password' => $_ENV['VS_DB_PWD'],
    'host' => $_ENV['VS_DB_HOST'],
    'driver' => 'pdo_mysql'
);
$conn = DriverManager::getConnection($connectionParams);
// obtaining the entity manager
$entityManager = EntityManager::create($conn, $config);
